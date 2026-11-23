"use client";
import { useState } from "react";
import Image from "next/image";
import CoffeeBackdrop from "@/components/coffee-backdrop";

export default function Login() {
  const [password, setPassword] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true); setError("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (r.ok) location.href = "/admin"; else { setError("Password tidak sesuai."); setLoading(false); }
  }
  return <main className="relative grid min-h-screen place-items-center px-5 text-[#F3E9DC]">
    <CoffeeBackdrop />
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[#1A120D]/70" />
    <div className="w-full max-w-sm rounded-3xl border border-[#3A2A1F] bg-[#140D09]/85 p-8 backdrop-blur-md">
      <Image src="/logo-maost.png" alt="Maost Kopi" width={110} height={86} className="mx-auto" priority />
      <p className="mt-6 text-center text-xs uppercase tracking-[.35em] text-[#C8924F]">Admin</p>
      <h1 className="mt-2 text-center text-3xl font-extrabold uppercase">Masuk Kasir</h1>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} placeholder="Password admin" autoFocus
        className="mt-7 w-full rounded-xl border border-[#3A2A1F] bg-[#1A120D] p-3 text-[#F3E9DC] placeholder:text-[#7D6A5B] outline-none focus:border-[#C8924F]" />
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      <button onClick={go} disabled={loading} className="mt-4 w-full rounded-full bg-[#C8924F] py-3 font-bold uppercase tracking-wider text-[#1A120D] transition hover:bg-[#F3E9DC] disabled:opacity-50">{loading ? "Memeriksa…" : "Login"}</button>
    </div>
  </main>;
}
