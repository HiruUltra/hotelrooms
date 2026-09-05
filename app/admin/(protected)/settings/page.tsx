import { updateSettings } from "@/actions/hotel-actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { getHotelSettings } from "@/lib/hotel-settings";

export default async function SettingsPage() {
  const settings = await getHotelSettings();
  return (
    <section>
      <h1 className="font-serif text-4xl font-bold">Hotel settings</h1>
      <form action={updateSettings} className="mt-6 grid gap-4 rounded-lg border bg-white p-5 shadow-soft md:grid-cols-2">
        {["hotelName", "logoUrl", "address", "phone", "email", "currency", "taxPercentage", "serviceChargePercentage", "defaultCheckInTime", "defaultCheckOutTime", "invoicePrefix", "bookingPrefix", "timezone"].map((name) => <label key={name} className="grid gap-1 text-sm font-medium">{name}<input name={name} defaultValue={(settings as any)[name]} /></label>)}
        <label className="grid gap-1 text-sm font-medium md:col-span-2">Cancellation policy<textarea name="cancellationPolicy" defaultValue={(settings as any).cancellationPolicy} /></label>
        <label className="grid gap-1 text-sm font-medium md:col-span-2">Invoice footer<textarea name="invoiceFooterMessage" defaultValue={(settings as any).invoiceFooterMessage} /></label>
        <div className="md:col-span-2"><SubmitButton>Save settings</SubmitButton></div>
      </form>
    </section>
  );
}
