import Link from "next/link";
import { loginUser } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/forms/submit-button";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; email?: string }> }) {
  const params = await searchParams;
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-5xl font-bold">Welcome back</h1>
      <form action={loginUser} className="mt-8 grid gap-4 rounded-lg border bg-white p-5 shadow-soft">
        <input type="hidden" name="redirectTo" value="/account" />
        {params.error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">{params.error}</p> : null}
        <label className="grid gap-1 text-sm font-medium">Email<input type="email" name="email" defaultValue={params.email} required /></label>
        <label className="grid gap-1 text-sm font-medium">Password<input type="password" name="password" required /></label>
        <SubmitButton>Login</SubmitButton>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">New guest? <Link className="font-semibold text-forest" href="/register">Create an account</Link></p>
    </main>
  );
}
