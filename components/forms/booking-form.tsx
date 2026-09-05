import { createBooking, adminCreateBooking } from "@/actions/booking-actions";
import { bookingSources } from "@/lib/constants";
import { formatMoney, nightsBetween } from "@/lib/utils";
import { SubmitButton } from "@/components/forms/submit-button";

export function BookingForm({ room, admin = false }: { room: any; admin?: boolean }) {
  const action = admin ? adminCreateBooking : createBooking;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const next = new Date();
  next.setDate(next.getDate() + 2);
  return (
    <form action={action} className="grid gap-4 rounded-lg border bg-white p-5 shadow-soft md:grid-cols-2">
      <input type="hidden" name="roomId" value={String(room._id)} />
      <label className="grid gap-1 text-sm font-medium">Check-in<input type="date" name="checkIn" defaultValue={tomorrow.toISOString().slice(0, 10)} min={new Date().toISOString().slice(0, 10)} required /></label>
      <label className="grid gap-1 text-sm font-medium">Check-out<input type="date" name="checkOut" defaultValue={next.toISOString().slice(0, 10)} min={tomorrow.toISOString().slice(0, 10)} required /></label>
      <label className="grid gap-1 text-sm font-medium">Adults<input type="number" name="adults" defaultValue={1} min={1} max={room.maxAdults} required /></label>
      <label className="grid gap-1 text-sm font-medium">Children<input type="number" name="children" defaultValue={0} min={0} max={room.maxChildren} required /></label>
      {admin ? <label className="grid gap-1 text-sm font-medium">Source<select name="source" defaultValue="Walk-in">{bookingSources.map((source) => <option key={source}>{source}</option>)}</select></label> : <input type="hidden" name="source" value="Website" />}
      <label className="grid gap-1 text-sm font-medium">Full name<input name="customerName" required /></label>
      <label className="grid gap-1 text-sm font-medium">Email<input type="email" name="customerEmail" /></label>
      <label className="grid gap-1 text-sm font-medium">Phone<input name="customerPhone" required /></label>
      <label className="grid gap-1 text-sm font-medium">NIC/passport<input name="identityNumber" required /></label>
      <label className="grid gap-1 text-sm font-medium">Advance payment<input type="number" name="advancePayment" defaultValue={0} min={0} /></label>
      <label className="grid gap-1 text-sm font-medium">Payment method<input name="paymentMethod" placeholder="Cash, card, bank transfer" /></label>
      <label className="grid gap-1 text-sm font-medium md:col-span-2">Address<textarea name="customerAddress" rows={2} required /></label>
      <label className="grid gap-1 text-sm font-medium md:col-span-2">Special requests<textarea name="specialRequests" rows={3} /></label>
      {admin ? <label className="grid gap-1 text-sm font-medium md:col-span-2">Internal notes<textarea name="internalNotes" rows={3} /></label> : null}
      <div className="rounded-md bg-muted p-4 text-sm md:col-span-2">
        <strong>Estimate:</strong> {formatMoney(room.pricePerNight)} per night. Capacity {room.maxAdults} adults and {room.maxChildren} children.
      </div>
      <div className="md:col-span-2"><SubmitButton>{admin ? "Create booking" : "Confirm booking"}</SubmitButton></div>
    </form>
  );
}
