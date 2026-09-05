import Link from "next/link";

export default async function BookingSuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold text-gold">Booking received</p>
      <h1 className="mt-2 font-serif text-5xl font-bold">Your stay request is in</h1>
      <p className="mt-4 text-muted-foreground">Reference: <strong>{ref}</strong>. The hotel team can now confirm it from the admin dashboard.</p>
      <Link className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground" href="/account/bookings">View my bookings</Link>
    </main>
  );
}
