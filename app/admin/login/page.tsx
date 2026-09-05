import { adminLogin } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/forms/submit-button";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; email?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <form action={adminLogin} className="w-full max-w-md rounded-lg border bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold text-gold">Admin portal</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">Secure login</h1>
        <div className="mt-6 grid gap-4">
          {params.error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">{params.error}</p> : null}
          <label className="grid gap-1 text-sm font-medium">Email<input type="email" name="email" defaultValue={params.email} required /></label>
          <label className="grid gap-1 text-sm font-medium">Password<input type="password" name="password" required /></label>
          <SubmitButton>Enter dashboard</SubmitButton>
        </div>
      </form>
    </main>
  );
}
