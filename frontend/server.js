import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb"; // ObjectId uvozimo direktno!
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- KONFIGURACIJA ENV & SERVERJA ---
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`; 
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error("❌ ERROR: Missing MONGODB_URI or JWT_SECRET!");
  process.exit(1);
}

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Zagotovi, da mapa obstaja
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const app = express();

// --- DATABASE CONNECTION ---
const client = new MongoClient(MONGODB_URI);
let db;

async function startServer() {
  try {
    await client.connect();
    // Uporabimo potrjeno ime baze
    db = client.db("avtoDB"); 
    console.log("✅ Connected to MongoDB");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("❌ DB Connection Error:", e);
    process.exit(1);
  }
}
startServer();

// --- MULTER (Lokalno Shranjevanje) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// --- AUTH MIDDLEWARE (Preverja JWT) ---
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access Denied. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.body.sellerId = decoded.userId; 
        next();
    } catch (ex) {
        return res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};

// --- MIDDLEWARE ---
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173"],
  credentials: true
}));
app.use("/uploads", express.static(UPLOAD_DIR));

// --- ROUTES ---

app.post("/api/login", express.json(), async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = db.collection("users");
        const user = await users.findOne({ email });
        
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
        
        const token = jwt.sign(
            { userId: user._id.toHexString(), email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ 
            success: true, 
            message: "Login successful",
            token: token, 
            fullName: user.fullName 
        });
    } catch (error) {
        console.error(" ❌ Login Error: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/register", express.json(), async (req, res) => {
    try {
        const { fullName, email, password, phone, address, profileType, companyName } = req.body; 
        const users = db.collection("users");
        
        if (await users.findOne({ email })) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await users.insertOne({ 
            fullName, email, password: hashedPassword, phone, address, profileType, companyName: companyName || null, profileStatus: 'complete', createdAt: new Date() 
        });
        
        res.status(201).json({ success: true, message: "Registration and profile setup complete." });
    } catch(e) { 
        console.error("❌ Register Complete Error:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.post("/api/listings", upload.array("images"), async (req, res) => {
  try {
    // Multer je zdaj že parsal body v req.body
    const { 
      brand, model, price, year, milage, hp, description,
      bodyType, fuelType, gearbox, vin, driveType, doors, seats, euroStandard, features,
      sellerId 
    } = req.body;
    
    // ... (ostala logika) ...

    const imageUrls = (req.files || []).map(file => {
      return `${PUBLIC_URL}/uploads/${file.filename}`;
    });

    const calculatedKw = hp ? Math.round(Number(hp) * 0.7457) : undefined;
    let parsedFeatures = [];
    if (features) { try { parsedFeatures = JSON.parse(features); } catch (e) {} }

    const newListing = {
      brand, model, price: Number(price), year: Number(year), milage: Number(milage), hp: Number(hp), 
      kW: calculatedKw, bodyType: bodyType || "Other", fuelType: fuelType || "Other", gearbox: gearbox || "Manual", vin: vin || "", 
      description: description || "", driveType: driveType || "FWD", doors: Number(doors) || 5, seats: Number(seats) || 5, 
      euroStandard: euroStandard || "Euro 6", features: parsedFeatures,
      
      sellerId: new ObjectId(sellerId),
      images: imageUrls,
      createdAt: new Date(),
      status: "active"
    };

    await db.collection("listings").insertOne(newListing);
    res.status(201).json({ success: true, message: "Listing created." });
  } catch (e) {
    console.error("❌ Upload Error:", e);
    res.status(500).json({ success: false, message: "Server error during upload" });
  }
});

// 4. GET ALL LISTINGS
app.get("/api/listings", async (_req, res) => {
  try {
    const all = await db.collection("listings").find({}).sort({ createdAt: -1 }).toArray();
    res.json({ success: true, data: all });
  } catch (e) { res.status(500).json({ success: false }); }
});

// 5. GET SINGLE LISTING (Unprotected)
app.get("/api/listing/:id", async (req, res) => { // POPRAVIL: Iz "listing" v "listings"
  try {
    const { id } = req.params;
    let query;
    // Robusno iskanje po ObjectId ali String
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


// 6. Car Data Proxy (Ostale rute)
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




// garaza
app.get("/api/users/:userId/listings", async (req, res) => {
    try {
        const userId = req.params.userId;
                console.log("🔍 SellerID from Token:", userId);
        const sellerObjectId = new ObjectId(userId); 

        const userListings = await db.collection("listings").find({ 
            sellerId: sellerObjectId // Išči strogo po ObjectId
        }).sort({ createdAt: -1 }).toArray();

        res.json({ success: true, data: userListings });
    } catch (e) {
        console.error("❌ Garage Fetch Error:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// kontakt 
app.get("/api/listings/:id/contact", async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid listing ID" });
        }

        // 1. Najdi prodajalčev ID iz oglasa
        const listing = await db.collection("listings").findOne({ _id: new ObjectId(id) }, { projection: { sellerId: 1 } });
        
        if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

        // 2. Najdi telefon prodajalca (shranjen je kot string)
        const seller = await db.collection("users").findOne({ _id: listing.sellerId }, { projection: { phone: 1 } });
        
        if (!seller || !seller.phone) return res.status(404).json({ success: false, message: "Contact not available" });

        res.json({ success: true, phone: seller.phone });
    } catch (e) {
        console.error("❌ Contact Fetch Error:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
});