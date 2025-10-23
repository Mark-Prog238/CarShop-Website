import { MongoClient } from "mongodb";
const uri =
  "mongodb+srv://marksalamon101_db_user:UbVjDb3Fhiq6oG1l@avtodb.ryx32ol.mongodb.net/?appName=avtoDB";
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (db) return db;

  try {
    await client.connect();
    db = client.db("avtoDB"); // make sure this is your real DB name
    console.log("✅ Connected to MongoDB");
    console.log("📂 Using database:", db.databaseName);
    return db;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}
