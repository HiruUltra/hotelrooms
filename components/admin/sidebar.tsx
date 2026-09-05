import Link from "next/link";
import { BedDouble, CalendarDays, FileText, Hotel, LayoutDashboard, Receipt, Settings, Users } from "lucide-react";

const links = [
  ["/admin", LayoutDashboard, "Dashboard"],
  ["/admin/rooms", BedDouble, "Rooms"],
  ["/admin/bookings", CalendarDays, "Bookings"],
  ["/admin/calendar", CalendarDays, "Calendar"],
  ["/admin/customers", Users, "Customers"],
  ["/admin/extras", Receipt, "Extras"],
  ["/admin/invoices", FileText, "Invoices"],
  ["/admin/settings", Settings, "Settings"]
] as const;

export function AdminSidebar() {
  return (
    <aside className="border-r bg-white">
      <div className="flex h-16 items-center gap-2 border-b px-5 font-serif text-xl font-bold text-forest">
        <Hotel className="h-5 w-5 text-gold" /> SereneStay
      </div>
      <nav className="grid gap-1 p-3">
        {links.map(([href, Icon, label]) => (
          <Link key={href} href={href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            <Icon className="h-4 w-4 text-gold" /> {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
