import { connectDb } from "@/lib/db";
import HotelSettings from "@/models/HotelSettings";

export async function getHotelSettings() {
  await connectDb();
  const existing = await HotelSettings.findOne().lean();
  return existing ?? {
    hotelName: "SereneStay Hotel",
    logoUrl: "",
    address: "Galle Road, Colombo, Sri Lanka",
    phone: "+94 11 234 5678",
    email: "hello@serenestay.example",
    currency: "LKR",
    taxPercentage: 10,
    serviceChargePercentage: 0,
    defaultCheckInTime: "14:00",
    defaultCheckOutTime: "11:00",
    invoicePrefix: "INV",
    bookingPrefix: "BK",
    timezone: "Asia/Colombo",
    cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
    invoiceFooterMessage: "Thank you for choosing SereneStay Hotel."
  };
}
