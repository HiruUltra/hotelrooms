import mongoose, { Schema, models, model } from "mongoose";
import { bookingSources, bookingStatuses, paymentStatuses } from "@/lib/constants";

const BookingSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    source: { type: String, enum: bookingSources, default: "Website", index: true },
    customerName: { type: String, required: true, trim: true, index: true },
    customerEmail: { type: String, trim: true, lowercase: true, index: true },
    customerPhone: { type: String, required: true, trim: true, index: true },
    customerAddress: { type: String, required: true },
    identityNumber: { type: String, required: true, index: true },
    checkIn: { type: Date, required: true, index: true },
    checkOut: { type: Date, required: true, index: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    nights: { type: Number, required: true },
    roomRate: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    serviceCharge: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    advancePayment: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: bookingStatuses, default: "Pending", index: true },
    paymentStatus: { type: String, enum: paymentStatuses, default: "Unpaid", index: true },
    paymentMethod: String,
    specialRequests: String,
    internalNotes: String,
    checkedInAt: Date,
    checkedOutAt: Date
  },
  { timestamps: true }
);

BookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
BookingSchema.index({ reference: "text", customerName: "text", customerPhone: "text", customerEmail: "text", identityNumber: "text" });
export type BookingDocument = mongoose.InferSchemaType<typeof BookingSchema> & { _id: mongoose.Types.ObjectId };
export default models.Booking || model("Booking", BookingSchema);
