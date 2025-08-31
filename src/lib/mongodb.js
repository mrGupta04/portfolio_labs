import { MongoClient } from "mongodb";

const uri = process.env.MONGODB; // full MongoDB connection string
const options = {};

if (!uri) {
  throw new Error("❌ Please define the MONGODB environment variable in .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev mode, prevent multiple connections during hot-reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ✅ export for NextAuth adapter
export default clientPromise;

// ✅ helper to get db if you need it outside NextAuth
export async function getDatabase(dbName = process.env.MONGODB_DB || "moonride") {
  const client = await clientPromise;
  return client.db(dbName);
}
