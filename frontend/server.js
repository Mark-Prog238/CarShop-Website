import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

if (!MONGODB_URI) {
  console.error("❌ NAPAKA: Manjka MONGODB_URI v .env datoteki!");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// --- MULTER ---
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});
const upload = multer({ storage });

// --- DATABASE ---
const client = new MongoClient(MONGODB_URI);
let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("carshop");
    console.log("✅ Povezan z MongoDB");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server teče na portu ${PORT}`);
      console.log(`🌍 Public URL: ${BACKEND_URL}`);
      console.log(`🔒 Dovoljen Frontend: ${FRONTEND_URL}`);
    });
  } catch (e) {
    console.error("❌ DB Connection Error:", e);
  }
}
startServer();

// --- ROUTES ---

// 1. Login
app.post("/api/login", async (req, res) => {
    // ... tvoja obstoječa login logika ...
    // Ker nimam tvoje 'users' spremenljivke globalno, uporabi db.collection
    try {
        const { email } = req.body; // Dodaj še preverjanje gesla (bcrypt)!
        const user = await db.collection("users").findOne({ email });
        if(user) res.json({ success: true, userId: user._id, fullName: user.fullName });
        else res.status(401).json({ success: false });
    } catch (e) { res.status(500).json({success:false}) }
});

// 2. Register
app.post("/api/register", async (req, res) => {
    // ... tvoja obstoječa register logika ...
    try {
        const { fullName, email, password } = req.body; 
        // Tu dodaj hashiranje in preverjanje
        await db.collection("users").insertOne({ fullName, email, password });
        res.status(201).json({ success: true });
    } catch(e) { res.status(500).json({success:false}) }
});

// 3. Car Data Proxy
app.get("/api/cars/makes", async (_req, res) => {
  try {
    const resp = await fetch("https://carapi.app/api/makes/v2");
    const j = await resp.json();
    res.json({ data: j.data || [] });
  } catch { res.json({ data: [] }); }
});

app.get("/api/cars/models/:make", async (req, res) => {
  try {
    const resp = await fetch(`https://carapi.app/api/models/v2?make=${encodeURIComponent(req.params.make)}`);
    const j = await resp.json();
    res.json({ data: j.data || [] });
  } catch { res.json({ data: [] }); }
});

// 4. CREATE LISTING
app.post("/api/listings", upload.array("images"), async (req, res) => {
  try {
    const { 
      brand, model, price, year, milage, hp, description,
      bodyType, fuelType, gearbox, vin, driveType, doors, seats, euroStandard, features 
    } = req.body;
    
    // UPORABA BACKEND_URL IZ .ENV
    const imageUrls = req.files.map(file => `${BACKEND_URL}/uploads/${file.filename}`);

    const calculatedKw = hp ? Math.round(Number(hp) * 0.7457) : undefined;

    let parsedFeatures = [];
    if (features) {
        try { parsedFeatures = JSON.parse(features); } catch (e) {}
    }

    const newListing = {
      brand, model, 
      price: Number(price), year: Number(year), milage: Number(milage), hp: Number(hp), 
      kW: calculatedKw,
      bodyType: bodyType || "Other", fuelType: fuelType || "Other", gearbox: gearbox || "Manual", vin: vin || "", 
      description: description || "", driveType: driveType || "FWD", 
      doors: Number(doors) || 5, seats: Number(seats) || 5, euroStandard: euroStandard || "Euro 6", 
      features: parsedFeatures,
      images: imageUrls,
      createdAt: new Date(),
      status: "active"
    };

    const result = await db.collection("listings").insertOne(newListing);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 5. GET ALL
app.get("/api/listings", async (_req, res) => {
  const all = await db.collection("listings").find({}).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: all });
});

// 6. GET SINGLE
app.get("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let query;
    if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
    } else {
        query = { _id: id };
    }

    const doc = await db.collection("listings").findOne(query);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid id" });
  }
});