import Link from "next/link";
import { requireUser } from "@/actions/guards";
import { Card } from "@/components/ui/card";

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-5xl font-bold">My account</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Card><p className="text-sm text-muted-foreground">Guest</p><h2 className="mt-2 text-2xl font-bold">{user.name}</h2><p className="text-sm">{user.email}</p></Card>
        <Link href="/account/bookings" className="rounded-lg border bg-white p-5 shadow-soft"><h2 className="text-xl font-bold">Bookings</h2><p className="mt-2 text-sm text-muted-foreground">Upcoming, past, cancelled, invoices.</p></Link>
        <Link href="/account/profile" className="rounded-lg border bg-white p-5 shadow-soft"><h2 className="text-xl font-bold">Profile</h2><p className="mt-2 text-sm text-muted-foreground">Update your guest information.</p></Link>
      </div>
    </main>
  );
}
