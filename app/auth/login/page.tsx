"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthResponse {
  user: { first_name: string; last_name: string | null; role: string | null };
  tokens: { access_token: string; token_type: string; expires_in: number };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/+$/, "");
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const payload = await response.json().catch(() => null) as AuthResponse | { detail?: string | Array<{ msg?: string }> } | null;
      if (!response.ok) {
        const detail = payload && "detail" in payload ? payload.detail : null;
        const message = typeof detail === "string" ? detail : Array.isArray(detail) ? detail.map((item) => item.msg ?? "Invalid input").join(". ") : `Sign in failed (${response.status}).`;
        throw new Error(message);
      }
      if (!payload || !("tokens" in payload) || !payload.tokens.access_token) {
        throw new Error("The authentication service returned no access token.");
      }
      if (payload.user.role?.toLowerCase() !== "student") {
        throw new Error("This area is for student accounts. Sign in with a student account.");
      }

      const storage = remember ? localStorage : sessionStorage;
      const otherStorage = remember ? sessionStorage : localStorage;
      storage.setItem("accessToken", payload.tokens.access_token);
      storage.setItem("authUser", JSON.stringify(payload.user));
      otherStorage.removeItem("accessToken");
      otherStorage.removeItem("authUser");
      router.replace("/student/placement-drives");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center px-4 py-10 text-slate-100">
    <section className="panel w-full max-w-md p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-400">CampusConnect</p>
      <h1 className="mt-3 text-2xl font-semibold text-white">Student sign in</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">Sign in with your existing placement portal account to manage applications.</p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <label className="block text-sm text-slate-300">Email
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
        </label>
        <label className="block text-sm text-slate-300">Password
          <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400" />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />Remember me on this device</label>
        {error ? <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
      </form>
      <Link href="/student/placement-drives" className="mt-5 inline-block text-sm text-sky-300 hover:text-sky-200">Back to placement drives</Link>
    </section>
  </main>;
}
