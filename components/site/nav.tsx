import Link from "next/link";
import { auth } from "@/auth";
import { getHotelSettings } from "@/lib/hotel-settings";
import { Hotel, LogIn, Menu } from "lucide-react";

export async function SiteNav() {
  const [session, settings] = await Promise.all([auth().catch(() => null), getHotelSettings()]);
  return (
    <header className="sticky top-0 z-40 border-b bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-forest">
          <Hotel className="h-6 w-6 text-gold" /> {settings.hotelName}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/rooms">Rooms</Link>
          <Link href="/search">Availability</Link>
          <Link href="/account">Account</Link>
          {session?.user?.role === "admin" ? <Link href="/admin">Admin</Link> : null}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold">
            <LogIn className="h-4 w-4" /> Login
          </Link>
          <Link href="/search" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Book Now</Link>
        </div>
        <Menu className="h-6 w-6 md:hidden" />
      </div>
    </header>
  );
}
