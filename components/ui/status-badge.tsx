import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Occupied: "bg-blue-50 text-blue-700 ring-blue-200",
  Cleaning: "bg-amber-50 text-amber-700 ring-amber-200",
  Maintenance: "bg-rose-50 text-rose-700 ring-rose-200",
  Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Checked In": "bg-blue-50 text-blue-700 ring-blue-200",
  "Checked Out": "bg-slate-100 text-slate-600 ring-slate-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Unpaid: "bg-rose-50 text-rose-700 ring-rose-200",
  "Partially Paid": "bg-amber-50 text-amber-700 ring-amber-200",
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
  Finalized: "bg-blue-50 text-blue-700 ring-blue-200"
};

export function StatusBadge({ value }: { value: string }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1", colors[value] ?? "bg-muted text-muted-foreground ring-border")}>{value}</span>;
}
