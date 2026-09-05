"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireAdmin } from "@/actions/guards";
import { assertRoomAvailable } from "@/lib/availability";
import { calculateInvoice } from "@/lib/calculations";
import { connectDb } from "@/lib/db";
import { getHotelSettings } from "@/lib/hotel-settings";
import { nextReference } from "@/lib/reference";
import { bookingSchema, bookingStatusSchema } from "@/lib/validation";
import AuditLog from "@/models/AuditLog";
import Booking from "@/models/Booking";
import Room from "@/models/Room";

export async function createBooking(formData: FormData): Promise<void> {
  const session = await auth();
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid booking details.");
  await connectDb();
  const room = await assertRoomAvailable(parsed.data.roomId, parsed.data.checkIn, parsed.data.checkOut, parsed.data.adults, parsed.data.children);
  const settings = await getHotelSettings();
  const totals = calculateInvoice({
    checkIn: parsed.data.checkIn,
    checkOut: parsed.data.checkOut,
    roomRate: room.pricePerNight,
    taxRate: settings.taxPercentage,
    serviceChargeRate: settings.serviceChargePercentage,
    advancePayment: parsed.data.advancePayment
  });
  const reference = await nextReference(settings.bookingPrefix);
  const booking = await Booking.create({
    reference,
    user: parsed.data.userId || session?.user?.id,
    room: room._id,
    source: parsed.data.source,
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone,
    customerAddress: parsed.data.customerAddress,
    identityNumber: parsed.data.identityNumber,
    checkIn: parsed.data.checkIn,
    checkOut: parsed.data.checkOut,
    adults: parsed.data.adults,
    children: parsed.data.children,
    nights: totals.nights,
    roomRate: room.pricePerNight,
    subtotal: totals.roomSubtotal,
    tax: totals.tax,
    serviceCharge: totals.serviceCharge,
    totalAmount: totals.total,
    advancePayment: parsed.data.advancePayment,
    paymentStatus: parsed.data.advancePayment > 0 ? "Partially Paid" : "Unpaid",
    paymentMethod: parsed.data.paymentMethod,
    specialRequests: parsed.data.specialRequests,
    internalNotes: parsed.data.internalNotes,
    status: parsed.data.source === "Website" ? "Pending" : "Confirmed"
  });
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/account/bookings");
  redirect(`/booking/success?ref=${booking.reference}`);
}

export async function adminCreateBooking(formData: FormData): Promise<void> {
  await requireAdmin();
  return createBooking(formData);
}

export async function updateBookingStatus(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = bookingStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid booking update.");
  await connectDb();
  const update: Record<string, unknown> = {};
  if (parsed.data.status) update.status = parsed.data.status;
  if (parsed.data.paymentStatus) update.paymentStatus = parsed.data.paymentStatus;
  if (parsed.data.internalNotes) update.internalNotes = parsed.data.internalNotes;
  if (parsed.data.status === "Checked In") update.checkedInAt = new Date();
  if (parsed.data.status === "Checked Out") update.checkedOutAt = new Date();
  const booking = await Booking.findByIdAndUpdate(parsed.data.bookingId, update, { new: true });
  if (booking && parsed.data.status === "Checked In") await Room.findByIdAndUpdate(booking.room, { status: "Occupied" });
  if (booking && parsed.data.status === "Checked Out") await Room.findByIdAndUpdate(booking.room, { status: "Cleaning" });
  await AuditLog.create({ actor: admin.id, action: `booking.${parsed.data.status ?? "update"}`, entityType: "Booking", entityId: parsed.data.bookingId });
  revalidatePath("/admin/bookings");
}
