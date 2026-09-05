import { requireUser } from "@/actions/guards";
import { updateProfile } from "@/actions/profile-actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export default async function ProfilePage() {
  const user = await requireUser();
  await connectDb();
  const profile = await User.findById(user.id).lean();
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-5xl font-bold">Profile</h1>
      <form action={updateProfile} className="mt-8 grid gap-4 rounded-lg border bg-white p-5 shadow-soft">
        <label className="grid gap-1 text-sm font-medium">Name<input name="name" defaultValue={profile?.name ?? user.name ?? ""} required /></label>
        <label className="grid gap-1 text-sm font-medium">Email<input defaultValue={user.email ?? ""} disabled /></label>
        <label className="grid gap-1 text-sm font-medium">Phone<input name="phone" defaultValue={profile?.phone ?? ""} /></label>
        <label className="grid gap-1 text-sm font-medium">NIC/passport<input name="identityNumber" defaultValue={profile?.identityNumber ?? ""} /></label>
        <label className="grid gap-1 text-sm font-medium">Address<textarea name="address" defaultValue={profile?.address ?? ""} /></label>
        <SubmitButton>Update profile</SubmitButton>
      </form>
    </main>
  );
}
