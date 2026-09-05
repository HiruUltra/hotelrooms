import { LogOut, UserCircle } from "lucide-react";
import { logoutUser } from "@/actions/auth-actions";
import { requireAdmin } from "@/actions/guards";
import { getHotelSettings } from "@/lib/hotel-settings";

export async function AdminHeader() {
  const [admin, settings] = await Promise.all([requireAdmin(), getHotelSettings()]);

  return (
    <header className="sticky top-0 z-30 border-b bg-ivory/95 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gold">{settings.hotelName}</p>
          <h1 className="truncate text-lg font-bold text-forest">Admin Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm md:flex">
            <UserCircle className="h-4 w-4 text-gold" />
            <span className="max-w-44 truncate font-medium">{admin.email}</span>
          </div>
          <form action={logoutUser}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-forest"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
