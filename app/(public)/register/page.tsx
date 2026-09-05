import Link from "next/link";
import { registerCustomer } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/forms/submit-button";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-5xl font-bold">Create account</h1>
      <form action={registerCustomer} className="mt-8 grid gap-4 rounded-lg border bg-white p-5 shadow-soft md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">Full name<input name="name" required /></label>
        <label className="grid gap-1 text-sm font-medium">Email<input type="email" name="email" required /></label>
        <label className="grid gap-1 text-sm font-medium">Phone<input name="phone" required /></label>
        <label className="grid gap-1 text-sm font-medium">Password<input type="password" name="password" minLength={8} required /></label>
        <label className="grid gap-1 text-sm font-medium">NIC/passport<input name="identityNumber" /></label>
        <label className="grid gap-1 text-sm font-medium">Address<input name="address" /></label>
        <div className="md:col-span-2"><SubmitButton>Register</SubmitButton></div>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">Already registered? <Link className="font-semibold text-forest" href="/login">Login</Link></p>
    </main>
  );
}
