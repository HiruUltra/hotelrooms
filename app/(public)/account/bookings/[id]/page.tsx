import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/actions/guards";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import Booking from "@/models/Booking";
import Invoice from "@/models/Invoice";

export default async function AccountBookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  await connectDb();
  const { id } = await params;
  const booking = await Booking.findOne({ _id: id, user: user.id }).populate("room").lean();
  if (!booking) notFound();
  const invoice = await Invoice.findOne({ booking: booking._id }).lean();
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-5xl font-bold">{booking.reference}</h1>
      <div className="mt-8 grid gap-4 rounded-lg border bg-white p-5 shadow-soft md:grid-cols-2">
        <p><span className="text-muted-foreground">Room:</span> {booking.room?.roomNumber} {booking.room?.name}</p>
        <p><span className="text-muted-foreground">Status:</span> {booking.status}</p>
        <p><span className="text-muted-foreground">Payment:</span> {booking.paymentStatus}</p>
        <p><span className="text-muted-foreground">Total:</span> {formatMoney(booking.totalAmount)}</p>
        <p><span className="text-muted-foreground">Check-in:</span> {new Date(booking.checkIn).toLocaleString()}</p>
        <p><span className="text-muted-foreground">Check-out:</span> {new Date(booking.checkOut).toLocaleString()}</p>
      </div>
      <div className="mt-6 flex gap-3">
        <Link href={`/book/${booking.room?._id}`} className="rounded-md border px-4 py-2 text-sm font-semibold">Rebook</Link>
        {invoice ? <a href={`/api/invoices/${invoice._id}/pdf`} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Download invoice</a> : null}
      </div>
    </main>
  );
}
