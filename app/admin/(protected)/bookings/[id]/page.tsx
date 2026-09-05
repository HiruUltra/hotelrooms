import { notFound } from "next/navigation";
import { addExtraCharge, generateInvoice } from "@/actions/billing-actions";
import { updateBookingStatus } from "@/actions/booking-actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import Booking from "@/models/Booking";
import ExtraCharge from "@/models/ExtraCharge";
import Invoice from "@/models/Invoice";

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const booking = await Booking.findById(id).populate("room").lean();
  if (!booking) notFound();
  const [charges, invoice] = await Promise.all([ExtraCharge.find({ booking: id }).lean(), Invoice.findOne({ booking: id }).lean()]);
  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-serif text-4xl font-bold">{booking.reference}</h1><p className="text-muted-foreground">{booking.customerName} · {booking.customerPhone}</p></div>
        <div className="flex gap-2"><StatusBadge value={booking.status} /><StatusBadge value={booking.paymentStatus} /></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg border bg-white p-5 shadow-soft lg:col-span-2">
          <h2 className="text-xl font-bold">Booking details</h2>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div><dt className="text-muted-foreground">Room</dt><dd>{booking.room?.roomNumber} {booking.room?.name}</dd></div>
            <div><dt className="text-muted-foreground">Source</dt><dd>{booking.source}</dd></div>
            <div><dt className="text-muted-foreground">Check-in</dt><dd>{new Date(booking.checkIn).toLocaleString()}</dd></div>
            <div><dt className="text-muted-foreground">Check-out</dt><dd>{new Date(booking.checkOut).toLocaleString()}</dd></div>
            <div><dt className="text-muted-foreground">Guests</dt><dd>{booking.adults} adults, {booking.children} children</dd></div>
            <div><dt className="text-muted-foreground">Total</dt><dd>{formatMoney(booking.totalAmount)}</dd></div>
          </dl>
        </div>
        <form action={updateBookingStatus} className="grid gap-3 rounded-lg border bg-white p-5 shadow-soft">
          <input type="hidden" name="bookingId" value={String(booking._id)} />
          <label className="grid gap-1 text-sm font-medium">Booking status<select name="status" defaultValue={booking.status}><option>Pending</option><option>Confirmed</option><option>Checked In</option><option>Checked Out</option><option>Cancelled</option><option>No Show</option></select></label>
          <label className="grid gap-1 text-sm font-medium">Payment status<select name="paymentStatus" defaultValue={booking.paymentStatus}><option>Unpaid</option><option>Partially Paid</option><option>Paid</option><option>Refunded</option></select></label>
          <label className="grid gap-1 text-sm font-medium">Internal notes<textarea name="internalNotes" defaultValue={booking.internalNotes} /></label>
          <SubmitButton>Update booking</SubmitButton>
        </form>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Extra charges</h2>
          <div className="mt-4 grid gap-2">{charges.map((charge: any) => <div key={String(charge._id)} className="flex justify-between rounded-md bg-muted p-3 text-sm"><span>{charge.category}: {charge.description}</span><strong>{formatMoney(charge.totalPrice)}</strong></div>)}</div>
          <form action={addExtraCharge} className="mt-5 grid gap-3">
            <input type="hidden" name="bookingId" value={String(booking._id)} />
            <select name="category"><option>Food</option><option>Drinks</option><option>Laundry</option><option>Transport</option><option>Room Service</option><option>Damage Charge</option><option>Other</option></select>
            <input name="description" placeholder="Item description" required />
            <div className="grid grid-cols-2 gap-3"><input type="number" name="quantity" min="1" defaultValue="1" /><input type="number" name="unitPrice" min="0" defaultValue="0" /></div>
            <textarea name="notes" placeholder="Notes" />
            <SubmitButton>Add charge</SubmitButton>
          </form>
        </div>
        <form action={generateInvoice} className="grid gap-3 rounded-lg border bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold">Invoice builder</h2>
          <input type="hidden" name="bookingId" value={String(booking._id)} />
          <label className="grid gap-1 text-sm font-medium">Discount<input type="number" name="discount" min="0" defaultValue={invoice?.discount ?? 0} /></label>
          <label className="grid gap-1 text-sm font-medium">Tax %<input type="number" name="taxRate" min="0" defaultValue="10" /></label>
          <label className="grid gap-1 text-sm font-medium">Service %<input type="number" name="serviceChargeRate" min="0" defaultValue="0" /></label>
          <label className="grid gap-1 text-sm font-medium">Amount paid now<input type="number" name="amountPaid" min="0" defaultValue="0" /></label>
          <label className="grid gap-1 text-sm font-medium">Payment method<input name="paymentMethod" defaultValue={invoice?.paymentMethod} /></label>
          <label className="grid gap-1 text-sm font-medium">Status<select name="status" defaultValue={invoice?.status ?? "Draft"}><option>Draft</option><option>Finalized</option><option>Paid</option><option>Cancelled</option></select></label>
          <textarea name="notes" placeholder="Invoice notes" defaultValue={invoice?.notes} />
          <div className="flex flex-wrap gap-3"><SubmitButton>Save invoice</SubmitButton>{invoice ? <a href={`/api/invoices/${invoice._id}/pdf`} className="rounded-md border px-4 py-2 text-sm font-semibold">Download PDF</a> : null}</div>
        </form>
      </div>
    </section>
  );
}
