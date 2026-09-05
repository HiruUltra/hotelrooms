import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import Invoice from "@/models/Invoice";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const invoice = await Invoice.findById(id).lean();
  if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  const snapshot = invoice.snapshot as any;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const settings = snapshot.settings;
  const booking = snapshot.booking ?? {};
  const currency = settings.currency ?? "LKR";
  doc.setFontSize(20);
  doc.text(settings.hotelName, 48, 52);
  doc.setFontSize(10);
  doc.text(settings.address, 48, 70);
  doc.text(`${settings.phone} | ${settings.email}`, 48, 86);
  doc.setFontSize(16);
  doc.text(`Invoice ${invoice.invoiceNumber}`, 380, 52);
  doc.setFontSize(11);
  doc.text(`Booking: ${booking.reference ?? "Manual"}`, 48, 125);
  doc.text(`Customer: ${booking.customerName ?? ""}`, 48, 145);
  doc.text(`Phone: ${booking.customerPhone ?? ""}`, 48, 165);
  doc.text(`Room: ${booking.room?.roomNumber ?? "Manual / non-room"} ${booking.room?.type ?? ""}`, 48, 185);
  const stayText = booking.checkIn && booking.checkOut ? `${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}` : "Not applicable";
  doc.text(`Stay: ${stayText}`, 48, 205);
  let y = 250;
  doc.text("Description", 48, y);
  doc.text("Amount", 460, y);
  y += 20;
  if ((snapshot.totals?.roomSubtotal ?? 0) > 0) {
    doc.text(`Room x ${booking.nights ?? 0} nights`, 48, y);
    doc.text(formatMoney(snapshot.totals.roomSubtotal, currency), 430, y);
  } else {
    y -= 18;
  }
  for (const charge of snapshot.charges ?? []) {
    y += 18;
    doc.text(`${charge.description} (${charge.quantity} x ${formatMoney(charge.unitPrice, currency)})`, 48, y);
    doc.text(formatMoney(charge.totalPrice, currency), 430, y);
  }
  y += 36;
  doc.text(`Discount: ${formatMoney(invoice.discount, currency)}`, 360, y);
  y += 18;
  doc.text(`Tax: ${formatMoney(invoice.tax, currency)}`, 360, y);
  y += 18;
  doc.text(`Service: ${formatMoney(invoice.serviceCharge, currency)}`, 360, y);
  y += 18;
  doc.text(`Total: ${formatMoney(invoice.totalAmount, currency)}`, 360, y);
  y += 18;
  doc.text(`Paid: ${formatMoney(invoice.amountPaid, currency)}`, 360, y);
  y += 18;
  doc.text(`Balance: ${formatMoney(invoice.balanceDue, currency)}`, 360, y);
  doc.text("Authorized signature", 48, 735);
  const bytes = doc.output("arraybuffer");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`
    }
  });
}
