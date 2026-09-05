import bcrypt from "bcryptjs";
import { loadEnvConfig } from "@next/env";
import { connectDb } from "@/lib/db";
import { calculateInvoice } from "@/lib/calculations";
import { fallbackRoomImages } from "@/lib/constants";
import { env } from "@/lib/env";
import { nextReference } from "@/lib/reference";
import Booking from "@/models/Booking";
import ExtraCharge from "@/models/ExtraCharge";
import ExtraItem from "@/models/ExtraItem";
import HotelSettings from "@/models/HotelSettings";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";
import Room from "@/models/Room";
import User from "@/models/User";

loadEnvConfig(process.cwd());

async function main() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed.");
  await connectDb();
  await Promise.all([Booking.deleteMany({}), ExtraCharge.deleteMany({}), ExtraItem.deleteMany({}), Invoice.deleteMany({}), Payment.deleteMany({}), Room.deleteMany({}), User.deleteMany({ role: { $ne: "admin" } })]);
  await HotelSettings.findOneAndUpdate({}, {}, { upsert: true, setDefaultsOnInsert: true });
  const adminHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await User.findOneAndUpdate({ email: env.ADMIN_EMAIL.toLowerCase() }, { name: "Hotel Admin", email: env.ADMIN_EMAIL.toLowerCase(), passwordHash: adminHash, role: "admin", phone: "+94000000000" }, { upsert: true });
  const customerHash = await bcrypt.hash("Customer123!", 12);
  const customers = await User.insertMany([
    { name: "Amaya Fernando", email: "amaya@example.com", passwordHash: customerHash, role: "customer", phone: "+94771234567", address: "Colombo", identityNumber: "NIC10001" },
    { name: "Nimal Perera", email: "nimal@example.com", passwordHash: customerHash, role: "customer", phone: "+94779876543", address: "Kandy", identityNumber: "NIC10002" }
  ]);
  const rooms = await Room.insertMany(Array.from({ length: 10 }).map((_, index) => ({
    roomNumber: String(101 + index),
    name: ["Ivory Garden", "Ceylon Suite", "Palm Deluxe", "Harbor Family"][index % 4],
    type: ["Standard", "Deluxe", "Family", "Suite"][index % 4],
    ac: index % 3 !== 0,
    pricePerNight: 9500 + index * 1750,
    maxAdults: index % 4 === 2 ? 4 : 2,
    maxChildren: index % 4 === 2 ? 2 : 1,
    bedType: index % 2 ? "Queen" : "King",
    floorNumber: Math.floor(index / 3) + 1,
    roomSize: `${30 + index * 3} sqm`,
    description: "A refined boutique room with soft linens, warm timber details, excellent lighting, and a quiet atmosphere.",
    amenities: ["Wi-Fi", "Breakfast", "Rain shower", "Tea service"],
    images: [fallbackRoomImages[index % fallbackRoomImages.length]],
    status: index === 7 ? "Cleaning" : "Available",
    isActive: true
  })));
  await ExtraItem.insertMany([
    { category: "Food", description: "Sri Lankan breakfast", defaultPrice: 1800 },
    { category: "Drinks", description: "Fresh king coconut", defaultPrice: 650 },
    { category: "Laundry", description: "Laundry bundle", defaultPrice: 2200 },
    { category: "Transport", description: "Airport transfer", defaultPrice: 8500 }
  ]);
  const now = new Date();
  const checkIn = new Date(now.getTime() + 86400000);
  const checkOut = new Date(now.getTime() + 3 * 86400000);
  const totals = calculateInvoice({ checkIn, checkOut, roomRate: rooms[0].pricePerNight, taxRate: 10, advancePayment: 5000 });
  const booking = await Booking.create({
    reference: await nextReference("BK"),
    user: customers[0]._id,
    room: rooms[0]._id,
    source: "Website",
    customerName: customers[0].name,
    customerEmail: customers[0].email,
    customerPhone: customers[0].phone,
    customerAddress: customers[0].address,
    identityNumber: customers[0].identityNumber,
    checkIn,
    checkOut,
    adults: 2,
    children: 0,
    nights: totals.nights,
    roomRate: rooms[0].pricePerNight,
    subtotal: totals.roomSubtotal,
    tax: totals.tax,
    serviceCharge: totals.serviceCharge,
    totalAmount: totals.total,
    advancePayment: 5000,
    status: "Confirmed",
    paymentStatus: "Partially Paid",
    paymentMethod: "Cash"
  });
  const charge = await ExtraCharge.create({ booking: booking._id, category: "Food", description: "Dinner", quantity: 2, unitPrice: 2500, totalPrice: 5000 });
  const invoiceTotals = calculateInvoice({ checkIn, checkOut, roomRate: rooms[0].pricePerNight, charges: [{ description: charge.description, quantity: 2, unitPrice: 2500 }], taxRate: 10, advancePayment: 5000 });
  await Invoice.create({ invoiceNumber: await nextReference("INV"), booking: booking._id, status: "Draft", snapshot: { booking, settings: await HotelSettings.findOne().lean(), charges: [charge], totals: invoiceTotals }, subtotal: invoiceTotals.roomSubtotal + invoiceTotals.extrasTotal, tax: invoiceTotals.tax, serviceCharge: invoiceTotals.serviceCharge, totalAmount: invoiceTotals.total, amountPaid: invoiceTotals.paid, balanceDue: invoiceTotals.balanceDue });
  console.log("Seed complete. Customer password: Customer123!");
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
