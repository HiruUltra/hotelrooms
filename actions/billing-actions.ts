"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/actions/guards";
import { calculateInvoice } from "@/lib/calculations";
import { connectDb } from "@/lib/db";
import { getHotelSettings } from "@/lib/hotel-settings";
import { nextReference } from "@/lib/reference";
import { extraChargeSchema, invoiceSchema } from "@/lib/validation";
import AuditLog from "@/models/AuditLog";
import Booking from "@/models/Booking";
import ExtraCharge from "@/models/ExtraCharge";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";

export async function addExtraCharge(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = extraChargeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid extra charge.");
  await connectDb();
  const charge = await ExtraCharge.create({
    booking: parsed.data.bookingId,
    category: parsed.data.category,
    description: parsed.data.description,
    quantity: parsed.data.quantity,
    unitPrice: parsed.data.unitPrice,
    totalPrice: parsed.data.quantity * parsed.data.unitPrice,
    notes: parsed.data.notes,
    addedBy: admin.id
  });
  await AuditLog.create({ actor: admin.id, action: "charge.create", entityType: "ExtraCharge", entityId: String(charge._id) });
  revalidatePath(`/admin/bookings/${parsed.data.bookingId}`);
}

export async function generateInvoice(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = invoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid invoice.");
  await connectDb();
  const booking = await Booking.findById(parsed.data.bookingId).populate("room").lean();
  if (!booking) throw new Error("Booking not found.");
  const settings = await getHotelSettings();
  const charges = await ExtraCharge.find({ booking: parsed.data.bookingId }).lean();
  const totals = calculateInvoice({
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    roomRate: parsed.data.discount ? booking.roomRate : booking.roomRate,
    charges: charges.map((charge) => ({ description: charge.description, quantity: charge.quantity, unitPrice: charge.unitPrice })),
    discount: parsed.data.discount,
    taxRate: parsed.data.taxRate,
    serviceChargeRate: parsed.data.serviceChargeRate,
    advancePayment: booking.advancePayment,
    amountPaid: parsed.data.amountPaid
  });
  const existing = await Invoice.findOne({ booking: parsed.data.bookingId });
  if (existing?.status === "Finalized") throw new Error("Finalized invoices must be reopened before editing.");
  const invoiceNumber = existing?.invoiceNumber ?? (await nextReference(settings.invoicePrefix));
  const snapshot = { booking, settings, charges, totals };
  const invoice = await Invoice.findOneAndUpdate(
    { booking: parsed.data.bookingId },
    {
      invoiceNumber,
      status: parsed.data.status,
      snapshot,
      discount: totals.discount,
      tax: totals.tax,
      serviceCharge: totals.serviceCharge,
      subtotal: totals.roomSubtotal + totals.extrasTotal,
      totalAmount: totals.total,
      amountPaid: totals.paid,
      balanceDue: totals.balanceDue,
      paymentMethod: parsed.data.paymentMethod,
      notes: parsed.data.notes,
      finalizedAt: parsed.data.status === "Finalized" ? new Date() : undefined
    },
    { upsert: true, new: true }
  );
  if (parsed.data.amountPaid > 0) {
    await Payment.create({ booking: parsed.data.bookingId, invoice: invoice._id, amount: parsed.data.amountPaid, method: parsed.data.paymentMethod, recordedBy: admin.id });
  }
  await AuditLog.create({ actor: admin.id, action: parsed.data.status === "Finalized" ? "invoice.finalize" : "invoice.save", entityType: "Invoice", entityId: String(invoice._id) });
  revalidatePath("/admin/invoices");
}

export async function reopenInvoice(id: string) {
  const admin = await requireAdmin();
  await connectDb();
  await Invoice.findByIdAndUpdate(id, { status: "Draft", reopenedAt: new Date() });
  await AuditLog.create({ actor: admin.id, action: "invoice.reopen", entityType: "Invoice", entityId: id });
  revalidatePath("/admin/invoices");
}

export async function createManualInvoice(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  await connectDb();
  const settings = await getHotelSettings();
  const descriptions = formData.getAll("lineDescription").map(String);
  const quantities = formData.getAll("lineQuantity").map((value) => Number(value || 0));
  const unitPrices = formData.getAll("lineUnitPrice").map((value) => Number(value || 0));
  const charges = descriptions
    .map((description, index) => ({
      category: "Manual",
      description: description.trim(),
      quantity: quantities[index] || 0,
      unitPrice: unitPrices[index] || 0,
      totalPrice: (quantities[index] || 0) * (unitPrices[index] || 0)
    }))
    .filter((line) => line.description && line.quantity > 0 && line.unitPrice >= 0);

  if (charges.length === 0) throw new Error("Add at least one invoice item.");
  const subtotal = charges.reduce((sum, line) => sum + line.totalPrice, 0);
  const discount = Math.min(Number(formData.get("discount") || 0), subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const taxRate = Number(formData.get("taxRate") || settings.taxPercentage || 0);
  const serviceChargeRate = Number(formData.get("serviceChargeRate") || settings.serviceChargePercentage || 0);
  const tax = taxable * (taxRate / 100);
  const serviceCharge = taxable * (serviceChargeRate / 100);
  const totalAmount = Math.max(0, taxable + tax + serviceCharge);
  const amountPaid = Math.max(0, Number(formData.get("amountPaid") || 0));
  const balanceDue = Math.max(0, totalAmount - amountPaid);
  const status = String(formData.get("status") || "Draft");
  const invoiceNumber = await nextReference(settings.invoicePrefix);

  const snapshot = {
    mode: "manual",
    settings,
    booking: {
      reference: "Manual",
      customerName: String(formData.get("customerName") || ""),
      customerPhone: String(formData.get("customerPhone") || ""),
      customerAddress: String(formData.get("customerAddress") || ""),
      identityNumber: String(formData.get("identityNumber") || ""),
      room: {
        roomNumber: String(formData.get("roomNumber") || ""),
        type: String(formData.get("roomType") || ""),
        ac: String(formData.get("ac") || "")
      },
      checkIn: String(formData.get("checkIn") || ""),
      checkOut: String(formData.get("checkOut") || ""),
      nights: Number(formData.get("nights") || 0)
    },
    charges,
    totals: {
      roomSubtotal: 0,
      extrasTotal: subtotal,
      discount,
      taxable,
      tax,
      serviceCharge,
      total: totalAmount,
      paid: amountPaid,
      balanceDue
    }
  };

  const invoice = await Invoice.create({
    invoiceNumber,
    status,
    snapshot,
    discount,
    tax,
    serviceCharge,
    subtotal,
    totalAmount,
    amountPaid,
    balanceDue,
    paymentMethod: String(formData.get("paymentMethod") || ""),
    notes: String(formData.get("notes") || ""),
    finalizedAt: status === "Finalized" || status === "Paid" ? new Date() : undefined
  });

  await AuditLog.create({ actor: admin.id, action: "invoice.manual.create", entityType: "Invoice", entityId: String(invoice._id) });
  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoice._id}`);
}
