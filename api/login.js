import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("lanverse");
  const users = db.collection("users");

  const user = await users.findOne({ username });
  if (!user) {
    await client.close();
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    await client.close();
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  await client.close();
  res.status(200).json({ token });
} 