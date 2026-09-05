import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { availabilitySchema } from "@/lib/validation";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import RoomBlock from "@/models/RoomBlock";

const activeBookingStatuses = ["Pending", "Confirmed", "Checked In"];

export async function findAvailableRooms(input: unknown) {
  const parsed = availabilitySchema.parse(input);
  await connectDb();
  const query: Record<string, unknown> = {
    isActive: true,
    status: { $nin: ["Maintenance", "Inactive"] },
    maxAdults: { $gte: parsed.adults },
    maxChildren: { $gte: parsed.children }
  };
  if (parsed.type) query.type = parsed.type;
  if (parsed.ac !== "Any") query.ac = parsed.ac === "AC";
  if (parsed.roomNumber) query.roomNumber = parsed.roomNumber;
  if (parsed.minPrice || parsed.maxPrice) {
    query.pricePerNight = {};
    if (parsed.minPrice) (query.pricePerNight as Record<string, number>).$gte = parsed.minPrice;
    if (parsed.maxPrice) (query.pricePerNight as Record<string, number>).$lte = parsed.maxPrice;
  }
  const rooms = await Room.find(query).sort({ pricePerNight: 1 }).lean();
  const roomIds = rooms.map((room) => room._id);
  const conflicts = await Booking.find({
    room: { $in: roomIds },
    status: { $in: activeBookingStatuses },
    checkIn: { $lt: parsed.checkOut },
    checkOut: { $gt: parsed.checkIn }
  }).distinct("room");
  const blocks = await RoomBlock.find({
    room: { $in: roomIds },
    startsAt: { $lt: parsed.checkOut },
    endsAt: { $gt: parsed.checkIn }
  }).distinct("room");
  const unavailable = new Set([...conflicts, ...blocks].map(String));
  return rooms.filter((room) => !unavailable.has(String(room._id)));
}

export async function assertRoomAvailable(roomId: string, checkIn: Date, checkOut: Date, adults: number, children: number) {
  const rooms = await findAvailableRooms({ checkIn, checkOut, adults, children });
  const match = rooms.find((room) => String(room._id) === roomId);
  if (!match || !mongoose.Types.ObjectId.isValid(roomId)) throw new Error("This room is no longer available for the selected stay.");
  return match;
}
