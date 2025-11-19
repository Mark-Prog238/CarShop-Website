import express, { response } from "express";
import cors from "cors";
import { connectDB } from "./connect.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
const db = await connectDB();
const users = db.collection("users");
const listings = db.collection("listings");

// static hosting for uploaded images
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});
const upload = multer({ storage });

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMathc = await bcrypt.compare(password, user.password);
    if (!isMathc) {
      return res
        .status(401)
        .json({ success: false, message: "Incorect password" });
    }
    res.status(200).json({ success: true, message: "Login succesfull" });
  } catch (error) {
    console.error(" ❌ login error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await users.findOne({ email });
    if (user) {
      res.json({ message: "user already exists" });
      console.log("❌ Error creating user: ", email, "user already exists");
      return;
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await users.insertOne({
      fullName,
      email,
      password: hashedPassword,
    });
    if (result.insertedId) {
      console.log("✅ New user created:", email);
      return res
        .status(201)
        .json({ success: true, message: "User created successfully" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Failed to create user" });
    }
  } catch (error) {
    console.error("❌ Error creatring user: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// za aute

app.get("/api/cars/makes", async (_req, res) => {
  try {
    let data;
    try {
      const resp = await fetch("https://carapi.app/api/makes/v2", {
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) throw new Error("carapi make err");
      const j = await resp.json();
      data = j.data || j.makes || [];
    } catch {
      data = [];
    }
    res.json({ data });
  } catch (e) {
    res.status(200).json({ data: [] });
  }
});

app.get("/api/cars/models/:make", async (req, res) => {
  const { make } = req.params;
  const key = `car_models_${make}`;
  try {

    let data;
    try {
      const resp = await fetch(
        `https://carapi.app/api/models/v2?make=${encodeURIComponent(make)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (!resp.ok) throw new Error("carapi model err");
      const j = await resp.json();
      data = j.data || [];
    } catch {
      const arr = [];
      data = arr.map((name, idx) => ({ id: idx + 1, name }));
    }
    res.json({ data });
  } catch (e) {
    const arr = [];
    res
      .status(200)
      .json({ data: arr.map((name, idx) => ({ id: idx + 1, name })) });
  }
});





// 3. CREATE LISTING (POSODOBLJENO: Vključuje features, doors, seats, driveType...)
app.post("/api/listings", upload.array("images"), async (req, res) => {
  try {
    console.log("📥 Prejemam podatke:", req.body);

    // 1. Preberemo VSE podatke iz requesta
    const { 
      brand, model, price, year, milage, hp, description,
      bodyType, fuelType, gearbox, vin,
      // NOVE SPREMENLJIVKE:
      driveType, doors, seats, euroStandard, features 
    } = req.body;
    
    const imageUrls = req.files.map(file => `http://localhost:${PORT}/uploads/${file.filename}`);

    // Izračun kW
    const calculatedKw = hp ? Math.round(Number(hp) * 0.7457) : undefined;

    // PARSANJE FEATURE-jev
    // FormData pošlje array kot string, zato ga moramo pretvoriti nazaj v Array
    let parsedFeatures = [];
    if (features) {
        try {
            parsedFeatures = JSON.parse(features);
        } catch (e) {
            console.log("Napaka pri branju features JSON:", e);
        }
    }

    const newListing = {
      brand,
      model,
      price: Number(price),
      year: Number(year),
      milage: Number(milage),
      hp: Number(hp),
      kW: calculatedKw,
      
      // Osnovni podatki
      bodyType: bodyType || "Other",
      fuelType: fuelType || "Other",
      gearbox: gearbox || "Manual",
      vin: vin || "",
      description: description || "",
      
      // NOVI PODATKI V BAZI:
      driveType: driveType || "FWD",
      doors: Number(doors) || 5,
      seats: Number(seats) || 5,
      euroStandard: euroStandard || "Euro 6",
      features: parsedFeatures, // Shrani se kot ["ABS", "Navigation", ...]
      
      images: imageUrls,
      createdAt: new Date(),
      status: "active"
    };

    const result = await db.collection("listings").insertOne(newListing);
    console.log("✅ Uspešno shranjeno z ID:", result.insertedId);
    
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (e) {
    console.error("❌ Upload Error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
});












app.get("/api/listings", async (_req, res) => {
  const all = await listings.find({}).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: all });
});

app.get("/api/listing/:id", async (req, res) => {
  try {
    console.log("Fetching listing with id:", req.params.id);
    const { id } = req.params;
    const doc = await listings.findOne({
      _id: new (await import("mongodb")).ObjectId(id),
    });
    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid id" });
    console.log("❌ listing fetch error:");
  }
});

app.listen(PORT, () => console.log("server running on http://localhost:8000"));
