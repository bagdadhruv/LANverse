import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("lanverse");
  const events = db.collection("events");

  if (req.method === "GET") {
    const allEvents = await events.find({}).toArray();
    res.status(200).json(allEvents);
  } else if (req.method === "POST") {
    const event = req.body;
    await events.insertOne(event);
    res.status(201).json({ message: "Event created" });
  } else {
    res.status(405).end();
  }

  await client.close();
} 