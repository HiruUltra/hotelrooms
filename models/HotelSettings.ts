import mongoose, { Schema, models, model } from "mongoose";

const HotelSettingsSchema = new Schema(
  {
    hotelName: { type: String, default: "SereneStay Hotel" },
    logoUrl: String,
    address: { type: String, default: "Galle Road, Colombo, Sri Lanka" },
    phone: { type: String, default: "+94 11 234 5678" },
    email: { type: String, default: "hello@serenestay.example" },
    currency: { type: String, default: "LKR" },
    taxPercentage: { type: Number, default: 10, min: 0 },
    serviceChargePercentage: { type: Number, default: 0, min: 0 },
    defaultCheckInTime: { type: String, default: "14:00" },
    defaultCheckOutTime: { type: String, default: "11:00" },
    invoicePrefix: { type: String, default: "INV" },
    bookingPrefix: { type: String, default: "BK" },
    timezone: { type: String, default: "Asia/Colombo" },
    cancellationPolicy: { type: String, default: "Free cancellation up to 48 hours before check-in." },
    invoiceFooterMessage: { type: String, default: "Thank you for choosing SereneStay Hotel." }
  },
  { timestamps: true }
);

export default models.HotelSettings || model("HotelSettings", HotelSettingsSchema);
