import { notFound } from "next/navigation";
import { BookingForm } from "@/components/forms/booking-form";
import { connectDb } from "@/lib/db";
import Room from "@/models/Room";

export default async function BookPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const room = await connectDb()
    .then(() => Room.findById(roomId).lean())
    .catch(() => null);
  if (!room) notFound();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-semibold text-gold">Booking flow</p>
      <h1 className="font-serif text-5xl font-bold">Reserve {room.name}</h1>
      <p className="mt-3 text-muted-foreground">Complete the details below. Availability is checked again on the server before saving.</p>
      <div className="mt-8"><BookingForm room={room} /></div>
    </main>
  );
}
