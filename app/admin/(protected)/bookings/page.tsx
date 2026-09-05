import Link from "next/link";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import Booking from "@/models/Booking";

export default async function AdminBookingsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  await connectDb();
  const query: Record<string, unknown> = {};
  if (params.status) query.status = params.status;
  if (params.source) query.source = params.source;
  if (params.q) query.$text = { $search: params.q };
  const bookings = await Booking.find(query).populate("room").sort({ createdAt: -1 }).limit(100).lean();
  return (
    <section>
      <div className="flex items-center justify-between"><h1 className="font-serif text-4xl font-bold">Bookings</h1><Link href="/admin/bookings/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Add booking</Link></div>
      <form className="mt-6 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-4"><input name="q" placeholder="Reference, invoice, name, phone, email, NIC" defaultValue={params.q} /><select name="status" defaultValue={params.status || ""}><option value="">All statuses</option><option>Pending</option><option>Confirmed</option><option>Checked In</option><option>Checked Out</option><option>Cancelled</option><option>No Show</option></select><select name="source" defaultValue={params.source || ""}><option value="">All sources</option><option>Website</option><option>Walk-in</option><option>Phone</option><option>Admin</option></select><button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Search</button></form>
      <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-soft"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="bg-muted"><tr><th className="p-3">Reference</th><th>Customer</th><th>Phone</th><th>Room</th><th>Source</th><th>Dates</th><th>Guests</th><th>Status</th><th>Payment</th><th>Total</th><th></th></tr></thead><tbody>{bookings.map((booking: any) => <tr className="border-t" key={String(booking._id)}><td className="p-3 font-semibold">{booking.reference}</td><td>{booking.customerName}</td><td>{booking.customerPhone}</td><td>{booking.room?.roomNumber} {booking.room?.type}</td><td>{booking.source}</td><td>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</td><td>{booking.adults}+{booking.children}</td><td><StatusBadge value={booking.status} /></td><td><StatusBadge value={booking.paymentStatus} /></td><td>{formatMoney(booking.totalAmount)}</td><td><Link className="font-semibold text-forest" href={`/admin/bookings/${booking._id}`}>Open</Link></td></tr>)}</tbody></table></div>
    </section>
  );
}
