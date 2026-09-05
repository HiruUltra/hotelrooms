"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/actions/guards";
import { connectDb } from "@/lib/db";
import { roomSchema } from "@/lib/validation";
import AuditLog from "@/models/AuditLog";
import Booking from "@/models/Booking";
import Room from "@/models/Room";

function parseRoomForm(formData: FormData) {
  const amenities = String(formData.get("amenities") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const images = String(formData.get("images") || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  return roomSchema.safeParse({ ...Object.fromEntries(formData), amenities, images });
}

export async function saveRoom(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = parseRoomForm(formData);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid room details.");
  await connectDb();
  const id = String(formData.get("id") || "");
  const room = id ? await Room.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true }) : await Room.create(parsed.data);
  await AuditLog.create({ actor: admin.id, action: id ? "room.update" : "room.create", entityType: "Room", entityId: String(room._id) });
  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
}

export async function deactivateRoom(id: string) {
  const admin = await requireAdmin();
  await connectDb();
  const hasHistory = await Booking.exists({ room: id });
  if (hasHistory) {
    await Room.findByIdAndUpdate(id, { isActive: false, status: "Inactive" });
  } else {
    await Room.findByIdAndDelete(id);
  }
  await AuditLog.create({ actor: admin.id, action: hasHistory ? "room.deactivate" : "room.delete", entityType: "Room", entityId: id });
  revalidatePath("/admin/rooms");
}
