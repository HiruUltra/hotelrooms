import mongoose from "mongoose";
import { env } from "@/lib/env";

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: CachedConnection;
};

const cached = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cached;

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required for database operations.");
  }
  cached.promise ??= mongoose.connect(env.MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}

export function hasDatabaseConfig() {
  return Boolean(env.MONGODB_URI);
}
