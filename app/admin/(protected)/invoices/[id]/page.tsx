import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import Invoice from "@/models/Invoice";

export default async function InvoicePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const invoice = await Invoice.findById(id).lean();
  if (!invoice) notFound();
  const snapshot = invoice.snapshot as any;
  const currency = snapshot.settings?.currency ?? "LKR";
  const booking = snapshot.booking ?? {};
  return <section className="mx-auto max-w-4xl rounded-lg border bg-white p-8 shadow-soft print:shadow-none"><div className="flex justify-between"><div><h1 className="font-serif text-4xl font-bold">{snapshot.settings.hotelName}</h1><p className="text-sm text-muted-foreground">{snapshot.settings.address}</p></div><a href={`/api/invoices/${invoice._id}/pdf`} className="h-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground print:hidden">Download PDF</a></div><div className="mt-8 grid gap-2 text-sm md:grid-cols-2"><p>Invoice: <strong>{invoice.invoiceNumber}</strong></p><p>Booking: <strong>{booking.reference ?? "Manual"}</strong></p><p>Customer: {booking.customerName}</p><p>Phone: {booking.customerPhone}</p><p>Room: {booking.room?.roomNumber || "Manual / non-room"}</p><p>Status: {invoice.status}</p>{booking.checkIn ? <p>Check-in: {new Date(booking.checkIn).toLocaleString()}</p> : null}{booking.checkOut ? <p>Check-out: {new Date(booking.checkOut).toLocaleString()}</p> : null}</div><div className="mt-8 border-t pt-6">{snapshot.totals?.roomSubtotal > 0 ? <div className="flex justify-between"><span>Room subtotal</span><strong>{formatMoney(snapshot.totals.roomSubtotal, currency)}</strong></div> : null}{snapshot.charges?.map((charge: any, index: number) => <div className="mt-2 flex justify-between" key={String(charge._id ?? index)}><span>{charge.description} ({charge.quantity} x {formatMoney(charge.unitPrice, currency)})</span><strong>{formatMoney(charge.totalPrice, currency)}</strong></div>)}<div className="mt-6 grid gap-2 border-t pt-4 text-right"><p>Discount: {formatMoney(invoice.discount, currency)}</p><p>Tax: {formatMoney(invoice.tax, currency)}</p><p>Service: {formatMoney(invoice.serviceCharge, currency)}</p><p className="text-xl font-bold">Total: {formatMoney(invoice.totalAmount, currency)}</p><p>Paid: {formatMoney(invoice.amountPaid, currency)}</p><p>Balance: {formatMoney(invoice.balanceDue, currency)}</p></div></div><div className="mt-16 border-t pt-8 text-sm text-muted-foreground">Authorized signature</div></section>;
}
