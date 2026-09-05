import Link from "next/link";
import { requireUser } from "@/actions/guards";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import Booking from "@/models/Booking";

export default async function AccountBookingsPage() {
  const user = await requireUser();
  await connectDb();
  const bookings = await Booking.find({ user: user.id }).populate("room").sort({ createdAt: -1 }).lean();
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-5xl font-bold">My bookings</h1>
      <div className="mt-8 overflow-x-auto rounded-lg border bg-white shadow-soft">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted"><tr><th className="p-3">Reference</th><th>Room</th><th>Dates</th><th>Status</th><th>Payment</th><th>Total</th><th></th></tr></thead>
          <tbody>{bookings.map((booking: any) => <tr className="border-t" key={String(booking._id)}><td className="p-3 font-semibold">{booking.reference}</td><td>{booking.room?.roomNumber}</td><td>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</td><td><StatusBadge value={booking.status} /></td><td><StatusBadge value={booking.paymentStatus} /></td><td>{formatMoney(booking.totalAmount)}</td><td><Link href={`/account/bookings/${booking._id}`} className="font-semibold text-forest">Open</Link></td></tr>)}</tbody>
        </table>
      </div>
      {bookings.length === 0 ? <p className="mt-6 rounded-lg border bg-white p-8 text-center text-muted-foreground">No bookings yet.</p> : null}
    </main>
  );
}
