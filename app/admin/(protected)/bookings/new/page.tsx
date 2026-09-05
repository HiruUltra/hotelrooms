import { BookingForm } from "@/components/forms/booking-form";
import { connectDb } from "@/lib/db";
import Room from "@/models/Room";

export default async function AdminNewBookingPage({ searchParams }: { searchParams: Promise<{ roomId?: string }> }) {
  await connectDb();
  const { roomId } = await searchParams;
  const room = roomId ? await Room.findById(roomId).lean() : await Room.findOne({ isActive: true, status: { $ne: "Maintenance" } }).sort({ roomNumber: 1 }).lean();
  return (
    <section>
      <h1 className="font-serif text-4xl font-bold">Add booking</h1>
      {room ? <div className="mt-6"><BookingForm room={room} admin /></div> : <p className="mt-6 rounded-lg border bg-white p-8 text-muted-foreground">Create an active room before adding bookings.</p>}
    </section>
  );
}
