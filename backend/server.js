import express, { response } from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getCache, setCache } from "./utils/cache.js";
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

// Cars data proxy with cache + fallback
app.get("/api/cars/makes", async (_req, res) => {
  try {
    const cached = getCache("car_makes");
    if (cached) return res.json({ data: cached });

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
    setCache("car_makes", data, 24 * 60 * 60 * 1000);
    res.json({ data });
  } catch (e) {
    res.status(200).json({ data: [] });
  }
});

app.get("/api/cars/models/:make", async (req, res) => {
  const { make } = req.params;
  const key = `car_models_${make}`;
  try {
    const cached = getCache(key);
    if (cached) return res.json({ data: cached });

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
    setCache(key, data, 24 * 60 * 60 * 1000);
    res.json({ data });
  } catch (e) {
    const arr = [];
    res
      .status(200)
      .json({ data: arr.map((name, idx) => ({ id: idx + 1, name })) });
  }
});

// Listings API
app.post("/api/listings", upload.any(), async (req, res) => {
  try {
    const { brand, model, year, milage, hp, price } = req.body;
    const imageFiles = (req.files || []).filter((f) =>
      f.mimetype.startsWith("image/")
    );
    const imageUrls = imageFiles.map(
      (f) => `/uploads/${path.basename(f.path)}`
    );

    const listing = {
      brand,
      model,
      year: year ? Number(year) : undefined,
      milage: milage ? Number(milage) : undefined,
      hp: hp ? Number(hp) : undefined,
      price: price ? Number(price) : undefined,
      images: imageUrls,
      createdAt: new Date(),
    };

    const result = await listings.insertOne(listing);
    return res
      .status(201)
      .json({ success: true, id: result.insertedId, listing });
  } catch (error) {
    console.error("❌ listing create error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/listings", async (_req, res) => {
  const all = await listings.find({}).sort({ createdAt: -1 }).toArray();
  res.json({ success: true, data: all });
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await listings.findOne({
      _id: new (await import("mongodb")).ObjectId(id),
    });
    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(400).json({ success: false, message: "Invalid id" });
  }
});

app.listen(8000, () => console.log("server running on http://localhost:8000"));
