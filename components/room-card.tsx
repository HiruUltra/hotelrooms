import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users } from "lucide-react";
import { fallbackRoomImages } from "@/lib/constants";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

export function RoomCard({ room, currency = "LKR" }: { room: any; currency?: string }) {
  const image = room.images?.[0] || fallbackRoomImages[0];
  return (
    <article className="overflow-hidden rounded-lg border bg-white shadow-soft transition hover:-translate-y-1">
      <div className="relative aspect-[4/3]">
        <Image src={image} alt={room.name} fill className="object-cover" />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl font-bold">{room.name}</h3>
            <p className="text-sm text-muted-foreground">Room {room.roomNumber} · {room.type} · {room.ac ? "AC" : "Non-AC"}</p>
          </div>
          <StatusBadge value={room.status} />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> {room.maxAdults} adults, {room.maxChildren} children</span>
          <span className="flex items-center gap-2"><BedDouble className="h-4 w-4 text-gold" /> {room.bedType}</span>
        </div>
        <div className="flex items-center justify-between">
          <strong>{formatMoney(room.pricePerNight, currency)} / night</strong>
          <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" href={`/rooms/${room._id}`}>View</Link>
        </div>
      </div>
    </article>
  );
}
