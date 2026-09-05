import { connectDb } from "@/lib/db";
import ExtraItem from "@/models/ExtraItem";

export default async function ExtrasPage() {
  await connectDb();
  const items = await ExtraItem.find().sort({ category: 1 }).lean();
  return <section><h1 className="font-serif text-4xl font-bold">Extra items</h1><p className="mt-2 text-muted-foreground">Reusable catalogue for food, drinks, laundry, transport, and service charges.</p><div className="mt-6 grid gap-3 md:grid-cols-3">{items.map((item: any) => <div className="rounded-lg border bg-white p-5 shadow-soft" key={String(item._id)}><p className="text-sm text-gold">{item.category}</p><h2 className="text-xl font-bold">{item.description}</h2><p className="mt-2 text-muted-foreground">Default price: {item.defaultPrice}</p></div>)}</div>{items.length === 0 ? <p className="mt-6 rounded-lg border bg-white p-8 text-muted-foreground">Seed the database to load common extra items.</p> : null}</section>;
}
