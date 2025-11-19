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

// Setup paths for file storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Zagotovi, da mapa za nalaganje obstaja
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
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Doda timestamp, da zagotovi unikatnost
        cb(null, Date.now() + '-' + file.originalname);
    }
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
app.use(express.json());
// Serviraj naložene datoteke kot statične datoteke
app.use("/uploads", express.static(UPLOAD_DIR));


// --- ROUTES ---

// 1. LOGIN (Generira Token)
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = db.collection("users");
        const user = await users.findOne({ email });
        
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // Predpostavljam, da imate v bazi shranjena hashirana gesla
        const isMatch = await bcrypt.compare(password, user.password); 
        // Če še nimate bcrypta: const isMatch = (password === "nekaj");
        
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
        
        // Generiranje JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
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

// 2. REGISTER
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body; 
        const users = db.collection("users");
        if (await users.findOne({ email })) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await users.insertOne({ fullName, email, password: hashedPassword, createdAt: new Date() });
        res.status(201).json({ success: true, userId: result.insertedId });
    } catch(e) { 
        console.error("❌ Register Error:", e);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// 3. CREATE LISTING (ZAŠČITENA RUTA)
app.post("/api/listings", authMiddleware, upload.array("images"), async (req, res) => {
  try {
    const { 
      brand, model, price, year, milage, hp, description,
      bodyType, fuelType, gearbox, vin, driveType, doors, seats, euroStandard, features,
      sellerId // <- Določeno iz JWT
    } = req.body;
    
    // Zberi poti do lokalno shranjenih datotek
    const imageUrls = (req.files || []).map(file => {
      // Pot, ki jo bo uporabil Frontend za dostop do slike
      return `${PUBLIC_URL}/uploads/${file.filename}`;
    });

    // Ostala logika (Pretvorbe & Shranjevanje)
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
    res.status(201).json({ success: true });
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
app.get("/api/listing/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let query;
    if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) };
    } else {
        query = { _id: id }; // Redundanca, za vsak slučaj
    }
    const doc = await db.collection("listings").findOne(query);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid id" });
  }
});


// othr shit
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
