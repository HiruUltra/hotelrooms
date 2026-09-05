import Link from "next/link";
import { Plus } from "lucide-react";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import Room from "@/models/Room";

export default async function AdminRoomsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  await connectDb();
  const query: Record<string, unknown> = {};
  if (params.type) query.type = params.type;
  if (params.status) query.status = params.status;
  if (params.q) query.$text = { $search: params.q };
  const rooms = await Room.find(query).sort({ roomNumber: 1 }).lean();
  return (
    <section>
      <div className="flex items-center justify-between gap-4"><h1 className="font-serif text-4xl font-bold">Rooms</h1><Link href="/admin/rooms/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add room</Link></div>
      <form className="mt-6 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-4"><input name="q" placeholder="Room number or name" defaultValue={params.q} /><select name="type" defaultValue={params.type || ""}><option value="">All types</option><option>Standard</option><option>Deluxe</option><option>Family</option><option>Suite</option></select><select name="status" defaultValue={params.status || ""}><option value="">All statuses</option><option>Available</option><option>Occupied</option><option>Cleaning</option><option>Maintenance</option><option>Inactive</option></select><button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Filter</button></form>
      <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-soft"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-muted"><tr><th className="p-3">Room</th><th>Type</th><th>AC</th><th>Capacity</th><th>Rate</th><th>Status</th><th>Active</th><th></th></tr></thead><tbody>{rooms.map((room: any) => <tr className="border-t" key={String(room._id)}><td className="p-3 font-semibold">{room.roomNumber} · {room.name}</td><td>{room.type}</td><td>{room.ac ? "AC" : "Non-AC"}</td><td>{room.maxAdults}+{room.maxChildren}</td><td>{formatMoney(room.pricePerNight)}</td><td><StatusBadge value={room.status} /></td><td>{room.isActive ? "Yes" : "No"}</td><td><Link className="font-semibold text-forest" href={`/admin/rooms/${room._id}`}>Edit</Link></td></tr>)}</tbody></table></div>
    </section>
  );
}
