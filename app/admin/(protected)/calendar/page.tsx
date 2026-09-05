import { connectDb } from "@/lib/db";
import Booking from "@/models/Booking";
import Room from "@/models/Room";

export default async function CalendarPage() {
  await connectDb();
  const [rooms, bookings] = await Promise.all([Room.find().sort({ roomNumber: 1 }).lean(), Booking.find({ status: { $in: ["Pending", "Confirmed", "Checked In"] } }).lean()]);
  return (
    <section>
      <h1 className="font-serif text-4xl font-bold">Room calendar</h1>
      <div className="mt-6 grid gap-3">{rooms.map((room: any) => {
        const roomBookings = bookings.filter((booking: any) => String(booking.room) === String(room._id));
        return <div key={String(room._id)} className="rounded-lg border bg-white p-4 shadow-soft"><div className="font-semibold">Room {room.roomNumber} · {room.status}</div><div className="mt-3 grid gap-2 md:grid-cols-3">{roomBookings.length ? roomBookings.map((booking: any) => <div className="rounded-md bg-muted p-3 text-sm" key={String(booking._id)}>{booking.reference}: {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</div>) : <span className="text-sm text-muted-foreground">No active reservations.</span>}</div></div>;
      })}</div>
    </section>
  );
}
