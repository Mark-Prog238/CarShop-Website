import express from "express";
import cors from "cors";
import { connectDB } from "./db/connect.js";
import bcrypt from "bcrypt";
const app = express();
app.use(cors());
app.use(express.json());
const db = await connectDB();
const users = db.collection("users");

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

app.listen(8000, () => console.log("server running on https://localhost:8000"));
