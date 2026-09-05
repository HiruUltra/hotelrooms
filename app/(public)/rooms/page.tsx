import { RoomCard } from "@/components/room-card";
import { connectDb } from "@/lib/db";
import { getHotelSettings } from "@/lib/hotel-settings";
import Room from "@/models/Room";

export default async function RoomsPage() {
  const settings = await getHotelSettings();
  const rooms = await connectDb()
    .then(() => Room.find({ isActive: true }).sort({ pricePerNight: 1 }).lean())
    .catch(() => []);
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-serif text-5xl font-bold">Rooms</h1>
      <p className="mt-3 text-muted-foreground">Browse active rooms and choose the stay that fits your guests.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{rooms.map((room: any) => <RoomCard key={String(room._id)} room={room} currency={settings.currency} />)}</div>
      {rooms.length === 0 ? <p className="mt-10 rounded-lg border bg-white p-8 text-center text-muted-foreground">No rooms are available yet.</p> : null}
    </main>
  );
}
