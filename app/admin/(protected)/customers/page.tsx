import { connectDb } from "@/lib/db";
import User from "@/models/User";

export default async function CustomersPage() {
  await connectDb();
  const users = await User.find({ role: "customer" }).sort({ createdAt: -1 }).lean();
  return <section><h1 className="font-serif text-4xl font-bold">Customers</h1><div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-soft"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-muted"><tr><th className="p-3">Name</th><th>Email</th><th>Phone</th><th>NIC/passport</th><th>Joined</th></tr></thead><tbody>{users.map((user: any) => <tr className="border-t" key={String(user._id)}><td className="p-3 font-semibold">{user.name}</td><td>{user.email}</td><td>{user.phone}</td><td>{user.identityNumber}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>;
}
