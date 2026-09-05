import Link from "next/link";
import { CalendarDays, Coffee, Dumbbell, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RoomCard } from "@/components/room-card";
import { connectDb } from "@/lib/db";
import { getHotelSettings } from "@/lib/hotel-settings";
import Room from "@/models/Room";

export default async function Home() {
  const settings = await getHotelSettings();
  await connectDb().catch(() => null);
  const rooms = await Room.find({ isActive: true }).limit(3).sort({ pricePerNight: 1 }).lean().catch(() => []);
  return (
    <main>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/85 via-forest/55 to-transparent" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-8 px-4 py-16 text-white">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold">Boutique comfort in Colombo</p>
            <h1 className="font-serif text-5xl font-bold leading-tight md:text-7xl">{settings.hotelName}</h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">Warm hospitality, calm rooms, thoughtful service, and invoices your front desk can trust.</p>
          </div>
          <form action="/search" className="grid max-w-5xl gap-3 rounded-lg bg-white p-4 text-foreground shadow-soft md:grid-cols-5">
            <label className="grid gap-1 text-sm font-medium">Check-in<input name="checkIn" type="date" required /></label>
            <label className="grid gap-1 text-sm font-medium">Check-out<input name="checkOut" type="date" required /></label>
            <label className="grid gap-1 text-sm font-medium">Guests<input name="adults" type="number" min="1" defaultValue="2" required /></label>
            <label className="grid gap-1 text-sm font-medium">Room type<select name="type"><option value="">Any</option><option>Standard</option><option>Deluxe</option><option>Family</option><option>Suite</option></select></label>
            <button className="mt-auto flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"><CalendarDays className="h-4 w-4" /> Search</button>
          </form>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-gold">Featured rooms</p><h2 className="font-serif text-4xl font-bold">Designed for slow mornings</h2></div>
          <Link href="/rooms" className="rounded-md border px-4 py-2 text-sm font-semibold">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">{rooms.map((room: any) => <RoomCard key={String(room._id)} room={room} currency={settings.currency} />)}</div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-3">
          {[[Wifi, "Fast Wi-Fi"], [Coffee, "Breakfast & cafe"], [Dumbbell, "Wellness room"], [Sparkles, "Daily cleaning"], [ShieldCheck, "Secure billing"], [CalendarDays, "Flexible booking"]].map(([Icon, label]: any) => (
            <Card key={label} className="shadow-none"><Icon className="mb-4 h-6 w-6 text-gold" /><h3 className="font-serif text-2xl font-bold">{label}</h3><p className="mt-2 text-sm text-muted-foreground">A polished experience for guests and front desk teams.</p></Card>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3">
        {["Immaculate rooms and genuinely kind staff.", "The invoice and checkout process was effortless.", "Quiet, elegant, and perfectly located."].map((review) => (
          <blockquote key={review} className="rounded-lg border bg-white p-6 shadow-soft text-muted-foreground">“{review}”<footer className="mt-4 font-semibold text-foreground">Verified guest</footer></blockquote>
        ))}
      </section>
    </main>
  );
}
