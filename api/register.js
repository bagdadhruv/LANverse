import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("lanverse");
  const users = db.collection("users");

  const existing = await users.findOne({ username });
  if (existing) {
    await client.close();
    return res.status(409).json({ error: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await users.insertOne({ username, password: hashed });
  await client.close();
  res.status(201).json({ message: "User registered" });
} 