import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fallbackRoomImages } from "@/lib/constants";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import Room from "@/models/Room";

export default async function RoomDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const room = await Room.findById(id).lean();
  if (!room) notFound();
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
          <Image src={room.images?.[0] || fallbackRoomImages[0]} alt={room.name} fill className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">Room {room.roomNumber}</p>
          <h1 className="mt-2 font-serif text-5xl font-bold">{room.name}</h1>
          <p className="mt-4 text-muted-foreground">{room.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted-foreground">Type</dt><dd className="font-semibold">{room.type}</dd></div>
            <div><dt className="text-muted-foreground">Climate</dt><dd className="font-semibold">{room.ac ? "AC" : "Non-AC"}</dd></div>
            <div><dt className="text-muted-foreground">Capacity</dt><dd className="font-semibold">{room.maxAdults} adults, {room.maxChildren} children</dd></div>
            <div><dt className="text-muted-foreground">Rate</dt><dd className="font-semibold">{formatMoney(room.pricePerNight)}</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">{room.amenities?.map((item: string) => <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold" key={item}>{item}</span>)}</div>
          <Link href={`/book/${room._id}`} className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Book this room</Link>
        </div>
      </div>
    </main>
  );
}
