"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db";
import { requireAdmin } from "@/actions/guards";
import { settingsSchema } from "@/lib/validation";
import AuditLog from "@/models/AuditLog";
import HotelSettings from "@/models/HotelSettings";

export async function updateSettings(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid settings.");
  await connectDb();
  const settings = await HotelSettings.findOneAndUpdate({}, parsed.data, { upsert: true, new: true });
  await AuditLog.create({ actor: admin.id, action: "settings.update", entityType: "HotelSettings", entityId: String(settings._id) });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}
