"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/actions/guards";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function updateProfile(formData: FormData): Promise<void> {
  const user = await requireUser();
  await connectDb();
  await User.findByIdAndUpdate(user.id, {
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    address: String(formData.get("address") || ""),
    identityNumber: String(formData.get("identityNumber") || "")
  }, { runValidators: true });
  revalidatePath("/account");
  revalidatePath("/account/profile");
}
