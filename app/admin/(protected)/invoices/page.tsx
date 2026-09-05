import Link from "next/link";
import { connectDb } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import Invoice from "@/models/Invoice";

export default async function InvoicesPage() {
  await connectDb();
  const invoices = await Invoice.find().populate("booking").sort({ createdAt: -1 }).lean();
  return <section><div className="flex items-center justify-between gap-4"><h1 className="font-serif text-4xl font-bold">Invoices</h1><Link href="/admin/invoices/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">New manual invoice</Link></div><div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-soft"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-muted"><tr><th className="p-3">Invoice</th><th>Booking</th><th>Status</th><th>Total</th><th>Balance</th><th></th></tr></thead><tbody>{invoices.map((invoice: any) => <tr className="border-t" key={String(invoice._id)}><td className="p-3 font-semibold">{invoice.invoiceNumber}</td><td>{invoice.booking?.reference ?? "Manual"}</td><td><StatusBadge value={invoice.status} /></td><td>{formatMoney(invoice.totalAmount)}</td><td>{formatMoney(invoice.balanceDue)}</td><td><Link href={`/admin/invoices/${invoice._id}`} className="font-semibold text-forest">Preview</Link></td></tr>)}</tbody></table></div></section>;
}
