import { RoomCard } from "@/components/room-card";
import { findAvailableRooms } from "@/lib/availability";
import { getHotelSettings } from "@/lib/hotel-settings";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const settings = await getHotelSettings();
  const hasDates = params.checkIn && params.checkOut;
  const rooms = hasDates
    ? await findAvailableRooms({ ...params, adults: Number(params.adults || 1), children: Number(params.children || 0), ac: params.ac || "Any", type: params.type || undefined }).catch(() => [])
    : [];
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-serif text-5xl font-bold">Find a room</h1>
      <form className="mt-8 grid gap-3 rounded-lg border bg-white p-5 shadow-soft md:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium">Check-in<input name="checkIn" type="date" defaultValue={params.checkIn} required /></label>
        <label className="grid gap-1 text-sm font-medium">Check-out<input name="checkOut" type="date" defaultValue={params.checkOut} required /></label>
        <label className="grid gap-1 text-sm font-medium">Adults<input name="adults" type="number" min="1" defaultValue={params.adults || 2} /></label>
        <label className="grid gap-1 text-sm font-medium">Children<input name="children" type="number" min="0" defaultValue={params.children || 0} /></label>
        <label className="grid gap-1 text-sm font-medium">Type<select name="type" defaultValue={params.type || ""}><option value="">Any</option><option>Standard</option><option>Deluxe</option><option>Family</option><option>Suite</option></select></label>
        <label className="grid gap-1 text-sm font-medium">AC<select name="ac" defaultValue={params.ac || "Any"}><option>Any</option><option>AC</option><option>Non-AC</option></select></label>
        <label className="grid gap-1 text-sm font-medium">Min price<input name="minPrice" type="number" defaultValue={params.minPrice} /></label>
        <label className="grid gap-1 text-sm font-medium">Max price<input name="maxPrice" type="number" defaultValue={params.maxPrice} /></label>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:col-span-4">Search availability</button>
      </form>
      <div className="mt-8 grid gap-6 md:grid-cols-3">{rooms.map((room: any) => <RoomCard key={String(room._id)} room={room} currency={settings.currency} />)}</div>
      {hasDates && rooms.length === 0 ? <p className="mt-8 rounded-lg border bg-white p-8 text-center text-muted-foreground">No matching rooms are available for those dates.</p> : null}
    </main>
  );
}
