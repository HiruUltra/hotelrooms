import { getHotelSettings } from "@/lib/hotel-settings";

export async function Footer() {
  const settings = await getHotelSettings();
  return (
    <footer className="bg-forest text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">{settings.hotelName}</h2>
          <p className="mt-3 text-sm text-white/75">{settings.cancellationPolicy}</p>
        </div>
        <div className="text-sm text-white/80">
          <p>{settings.address}</p>
          <p>{settings.phone}</p>
          <p>{settings.email}</p>
        </div>
        <p className="text-sm text-white/70">{settings.invoiceFooterMessage}</p>
      </div>
    </footer>
  );
}
