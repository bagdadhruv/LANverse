import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function verifyToken(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    return jwt.verify(auth.split(" ")[1], JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const userData = verifyToken(req);
  if (!userData) return res.status(401).json({ error: "Unauthorized" });

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("lanverse");
  const users = db.collection("users");

  const user = await users.findOne({ _id: new ObjectId(userData.id) }, { projection: { password: 0 } });
  await client.close();
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json(user);
} 