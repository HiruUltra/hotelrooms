import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import Invoice from "@/models/Invoice";

export default async function AdminDashboard() {
  await connectDb();
  const [totalRooms, availableRooms, occupiedRooms, pendingBookings, recentBookings, unpaidInvoices] = await Promise.all([
    Room.countDocuments(),
    Room.countDocuments({ status: "Available", isActive: true }),
    Room.countDocuments({ status: "Occupied" }),
    Booking.countDocuments({ status: "Pending" }),
    Booking.find().populate("room").sort({ createdAt: -1 }).limit(6).lean(),
    Invoice.aggregate([{ $match: { balanceDue: { $gt: 0 } } }, { $group: { _id: null, total: { $sum: "$balanceDue" } } }])
  ]);
  const cards = [
    ["Total rooms", totalRooms],
    ["Available rooms", availableRooms],
    ["Occupied rooms", occupiedRooms],
    ["Pending bookings", pendingBookings],
    ["Total unpaid balance", formatMoney(unpaidInvoices[0]?.total ?? 0)]
  ];
  return (
    <section>
      <h1 className="font-serif text-4xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-5">{cards.map(([label, value]) => <Card key={label as string} className="shadow-none"><p className="text-sm text-muted-foreground">{label}</p><strong className="mt-2 block text-2xl">{value}</strong></Card>)}</div>
      <div className="mt-8 rounded-lg border bg-white shadow-soft">
        <div className="border-b p-4"><h2 className="text-xl font-bold">Recent bookings</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted"><tr><th className="p-3">Reference</th><th>Guest</th><th>Room</th><th>Source</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>{recentBookings.map((booking: any) => <tr className="border-t" key={String(booking._id)}><td className="p-3 font-semibold">{booking.reference}</td><td>{booking.customerName}</td><td>{booking.room?.roomNumber}</td><td>{booking.source}</td><td><StatusBadge value={booking.status} /></td><td>{formatMoney(booking.totalAmount)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
