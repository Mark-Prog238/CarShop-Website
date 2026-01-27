// Optimized Backend – Faster Mongo Queries, Cleaner API
import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// -------------------- CONFIG --------------------
const PORT = process.env.PORT || 8000;
const PUBLIC_URL = process.env.PUBLIC_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const LOCAL_URL = process.env.LOCAL_URL;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// -------------------- SERVER INIT --------------------
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: [FRONTEND_URL, LOCAL_URL], credentials: true }));
app.use("/uploads", express.static(UPLOAD_DIR));

const client = new MongoClient(MONGODB_URI);
let db;

// -------------------- CONNECT + INDEXES --------------------
async function startServer() {
    await client.connect();
    db = client.db("avtoDB");

    // 🟢 PERFORMANCE: Add INDEXES
    db.collection("listings").createIndex({ createdAt: -1 });
    db.collection("listings").createIndex({ sellerId: 1 });
    db.collection("users").createIndex({ email: 1 }, { unique: true });

    console.log("🔥 Mongo Connected + Indexes Ready");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
startServer();

// -------------------- UPLOAD HANDLING --------------------
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOAD_DIR),
    filename: (_, file, cb) =>
        cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`)
});
const upload = multer({ storage });

// -------------------- HELPERS --------------------
const getUserId = (req) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        return jwt.verify(token, JWT_SECRET).userId;
    } catch {
        return null;
    }
};

// -------------------- AUTH --------------------
app.post("/api/login", async (req, res) => {
    const user = await db.collection("users").findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password)))
        return res.status(401).json({ success: false, message: "Wrong credentials" });

    const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: "30d" }
    );

    res.json({ success: true, token, fullName: user.fullName });
});

app.post("/api/register", async (req, res) => {
    const { fullName, email, password, phone, address, profileType, companyName } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await db.collection("users").insertOne({
            fullName,
            email,
            password: hashed,
            phone,
            address,
            profileType,
            companyName,
            createdAt: new Date()
        });
        res.json({ success: true, userId: user.insertedId });
    } catch {
        res.json({ success: false, message: "User exists" });
    }
});

// -------------------- LISTINGS --------------------
app.post("/api/listings", upload.array("images"), async (req, res) => {
    const userId = getUserId(req);
    const files = req.files || [];

    const images = files.map(f => `${PUBLIC_URL}/uploads/${f.filename}`);
    const features = req.body.features ? JSON.parse(req.body.features) : [];
    const hp = Number(req.body.hp);

    const listing = {
        ...req.body,
        price: Number(req.body.price),
        year: Number(req.body.year),
        milage: Number(req.body.milage),
        hp,
        kW: Math.round(hp * 0.74),
        features,
        images,
        sellerId: new ObjectId(userId),
        createdAt: new Date(),
        status: "active"
    };

    await db.collection("listings").insertOne(listing);
    res.json({ success: true, message: "Created" });
});

// GET ALL (fast, sorted, ready for pagination)
app.get("/api/listings", async (req, res) => {
    const listings = await db.collection("listings")
        .find({})
        .project({ description: 0 }) // 🟢 removes heavy text for faster load
        .sort({ createdAt: -1 })
        .toArray();

    res.json({ success: true, data: listings });
});

// GET BY ID (fast)
app.get("/api/listings/:id", async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.json({ success: false });

    const listing = await db.collection("listings").findOne({ _id: new ObjectId(id) });
    res.json({ success: !!listing, data: listing });
});

// USER GARAGE
app.get("/api/garage/listings", async (req, res) => {
    const userId = getUserId(req);
    if (!userId) return res.json({ success: true, data: [] });

    const data = await db.collection("listings")
        .find({ sellerId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();

    res.json({ success: true, data });
});

// DELETE
app.delete("/api/listings/:id", async (req, res) => {
    await db.collection("listings").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
});

// UPDATE
app.put("/api/listings/:id", async (req, res) => {
    const { _id, sellerId, ...updates } = req.body;
    await db.collection("listings").updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updates }
    );
    res.json({ success: true });
});

// -------------------- LIKES --------------------
app.post("/api/users/:userId/likes", async (req, res) => {
    const userId = new ObjectId(req.params.userId);
    const { listingId } = req.body;

    const update = await db.collection("users").findOneAndUpdate(
        { _id: userId },
        [{ $set: {
            savedListings: {
                $cond: [
                    { $in: [listingId, "$savedListings"] },
                    { $setDifference: ["$savedListings", [listingId]] },
                    { $concatArrays: ["$savedListings", [listingId]] }
                ]
            }
        }}],
        { returnDocument: "after" }
    );

    const isLiked = update.savedListings?.includes(listingId);
    res.json({ success: true, isLiked });
});

app.get("/api/users/:userId/likes", async (req, res) => {
    const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.userId) });

    const ids = (user?.savedListings || []).map(id => new ObjectId(id));

    const data = await db.collection("listings").find({ _id: { $in: ids } }).toArray();
    res.json({ success: true, data });
});

// -------------------- CONTACT --------------------
app.get("/api/listings/:id/contact", async (req, res) => {
    const listing = await db.collection("listings").findOne({ _id: new ObjectId(req.params.id) });

    const seller = await db.collection("users").findOne({ _id: listing.sellerId });

    res.json({ success: true, phone: seller?.phone });
});
