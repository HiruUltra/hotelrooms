import { createManualInvoice } from "@/actions/billing-actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { getHotelSettings } from "@/lib/hotel-settings";

export default async function NewManualInvoicePage() {
  const settings = await getHotelSettings();
  return (
    <section>
      <h1 className="font-serif text-4xl font-bold">Manual invoice</h1>
      <p className="mt-2 text-muted-foreground">Create an invoice without an existing booking, useful for counter sales, services, adjustments, or older walk-in records.</p>
      <form action={createManualInvoice} className="mt-6 grid gap-5 rounded-lg border bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">Customer name<input name="customerName" required /></label>
          <label className="grid gap-1 text-sm font-medium">Phone<input name="customerPhone" required /></label>
          <label className="grid gap-1 text-sm font-medium">NIC/passport<input name="identityNumber" /></label>
          <label className="grid gap-1 text-sm font-medium">Customer address<input name="customerAddress" /></label>
          <label className="grid gap-1 text-sm font-medium">Room number<input name="roomNumber" placeholder="Optional" /></label>
          <label className="grid gap-1 text-sm font-medium">Room type<input name="roomType" placeholder="Optional" /></label>
          <label className="grid gap-1 text-sm font-medium">AC/Non-AC<select name="ac"><option value="">Not applicable</option><option>AC</option><option>Non-AC</option></select></label>
          <label className="grid gap-1 text-sm font-medium">Nights<input type="number" name="nights" min="0" defaultValue="0" /></label>
          <label className="grid gap-1 text-sm font-medium">Check-in<input type="datetime-local" name="checkIn" /></label>
          <label className="grid gap-1 text-sm font-medium">Check-out<input type="datetime-local" name="checkOut" /></label>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">Invoice items</h2><span className="text-sm text-muted-foreground">{settings.currency}</span></div>
          <div className="grid gap-3">
            {[0, 1, 2, 3, 4].map((index) => (
              <div className="grid gap-3 md:grid-cols-[1fr_120px_160px]" key={index}>
                <input name="lineDescription" placeholder={index === 0 ? "Room charge, food, laundry, transport..." : "Optional item"} required={index === 0} />
                <input name="lineQuantity" type="number" min="0" step="1" defaultValue={index === 0 ? 1 : 0} />
                <input name="lineUnitPrice" type="number" min="0" step="0.01" defaultValue={index === 0 ? 0 : 0} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-1 text-sm font-medium">Discount<input name="discount" type="number" min="0" step="0.01" defaultValue="0" /></label>
          <label className="grid gap-1 text-sm font-medium">Tax %<input name="taxRate" type="number" min="0" step="0.01" defaultValue={settings.taxPercentage} /></label>
          <label className="grid gap-1 text-sm font-medium">Service %<input name="serviceChargeRate" type="number" min="0" step="0.01" defaultValue={settings.serviceChargePercentage} /></label>
          <label className="grid gap-1 text-sm font-medium">Amount paid<input name="amountPaid" type="number" min="0" step="0.01" defaultValue="0" /></label>
          <label className="grid gap-1 text-sm font-medium">Payment method<input name="paymentMethod" placeholder="Cash, card, bank transfer" /></label>
          <label className="grid gap-1 text-sm font-medium">Status<select name="status" defaultValue="Draft"><option>Draft</option><option>Finalized</option><option>Paid</option><option>Cancelled</option></select></label>
        </div>

        <label className="grid gap-1 text-sm font-medium">Notes<textarea name="notes" rows={3} placeholder="Invoice notes or internal context" /></label>
        <SubmitButton>Create invoice</SubmitButton>
      </form>
    </section>
  );
}
