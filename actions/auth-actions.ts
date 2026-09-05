"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { connectDb } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import User from "@/models/User";

export async function registerCustomer(formData: FormData): Promise<void> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid registration details.");
  await connectDb();
  const exists = await User.exists({ email: parsed.data.email.toLowerCase() });
  if (exists) throw new Error("An account already exists for this email.");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await User.create({ ...parsed.data, email: parsed.data.email.toLowerCase(), passwordHash, role: "customer" });
  await signIn("credentials", { email: parsed.data.email, password: parsed.data.password, redirectTo: "/account" });
}

export async function loginUser(formData: FormData): Promise<void> {
  const email = String(formData.get("email"));
  const redirectTo = String(formData.get("redirectTo") || "/account");
  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password")),
      redirectTo
    });
  } catch (error) {
    if ((error as Error).message.includes("NEXT_REDIRECT")) throw error;
    redirect(`/login?error=${encodeURIComponent("Invalid email or password.")}&email=${encodeURIComponent(email)}`);
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}

export async function adminLogin(formData: FormData): Promise<void> {
  const email = String(formData.get("email"));
  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password")),
      redirectTo: "/admin"
    });
  } catch (error) {
    if ((error as Error).message.includes("NEXT_REDIRECT")) throw error;
    redirect(`/admin/login?error=${encodeURIComponent("Invalid admin credentials.")}&email=${encodeURIComponent(email)}`);
  }
  redirect("/admin");
}
