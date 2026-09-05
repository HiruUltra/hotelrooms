import { connectDb } from "@/lib/db";
import Counter from "@/models/Counter";

export async function nextReference(prefix: string) {
  await connectDb();
  const year = new Date().getUTCFullYear();
  const key = `${prefix}-${year}`;
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return `${prefix}-${year}-${String(counter.seq).padStart(6, "0")}`;
}
