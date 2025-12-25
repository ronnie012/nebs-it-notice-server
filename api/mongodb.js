import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("❌ Missing MONGO_URI in environment variables");
}

if (process.env.NODE_ENV === "development") {
  // Keep global client across hot reloads in dev environment
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

clientPromise = client.connect();

export default clientPromise;
