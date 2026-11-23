"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import RoasteryBackdrop from "@/components/roastery-backdrop";

type Item = { id: string; menuName: string; variant: string; quantity: number; subtotal: number };
type Order = {
  id: string; orderCode: string; customerName: string; whatsapp: string; note: string | null;
  total: number; status: Status; fulfillment: string; pickupTime: string | null; deliveryAddress: string | null;
  paymentMethod: string; createdAt: string; items: Item[];
};
type Status = "PENDING" | "DIPROSES" | "SIAP_DIAMBIL" | "SELESAI" | "DIBATALKAN";
type Filter = "AKTIF" | "SEMUA" | Status;

const money = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const STATUSES: Status[] = ["PENDING", "DIPROSES", "SIAP_DIAMBIL", "SELESAI", "DIBATALKAN"];
const ACTIVE: Status[] = ["PENDING", "DIPROSES", "SIAP_DIAMBIL"];
const META: Record<Status, { label: string; badge: string; bar: string }> = {
  PENDING: { label: "Pending", badge: "bg-amber-400/15 text-amber-300 border-amber-400/40", bar: "bg-amber-400" },
  DIPROSES: { label: "Diproses", badge: "bg-sky-400/15 text-sky-300 border-sky-400/40", bar: "bg-sky-400" },
  SIAP_DIAMBIL: { label: "Siap diambil", badge: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40", bar: "bg-emerald-400" },
  SELESAI: { label: "Selesai", badge: "bg-stone-400/15 text-stone-300 border-stone-400/30", bar: "bg-stone-500" },
  DIBATALKAN: { label: "Dibatalkan", badge: "bg-red-400/15 text-red-300 border-red-400/40", bar: "bg-red-500" },
};
const NEXT: Partial<Record<Status, { to: Status; label: string }>> = {
  PENDING: { to: "DIPROSES", label: "Proses pesanan" },
  DIPROSES: { to: "SIAP_DIAMBIL", label: "Tandai siap diambil" },
  SIAP_DIAMBIL: { to: "SELESAI", label: "Selesaikan" },
};

function ago(iso: string, now: number) {
  const m = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h} jam lalu` : new Date(iso).toLocaleDateString("id-ID");
}
const waLink = (n: string) => { const d = n.replace(/\D/g, ""); return `https://wa.me/${d.startsWith("0") ? "62" + d.slice(1) : d}`; };
const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.18].forEach(t => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.15, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.15);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.16);
    });
  } catch { /* browser tidak mendukung audio */ }
}

export default function AdminBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Filter>("AKTIF");
  const [loaded, setLoaded] = useState(false), [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [sound, setSound] = useState(false);
  const [now, setNow] = useState(Date.now()), [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const known = useRef<Set<string> | null>(null), soundRef = useRef(false);
  soundRef.current = sound;

  async function load() {
    try {
      const r = await fetch("/api/admin/orders", { cache: "no-store" });
      if (r.status === 401) { location.href = "/admin/login"; return; }
      const d = await r.json(); const list: Order[] = d.orders || [];
      if (known.current) {
        const added = list.filter(o => !known.current!.has(o.id)).map(o => o.id);
        if (added.length) { setFresh(s => new Set([...s, ...added])); if (soundRef.current) beep(); }
      }
      known.current = new Set(list.map(o => o.id));
      setOrders(list); setFailed(false); setUpdatedAt(new Date());
    } catch { setFailed(true); } finally { setLoaded(true); }
  }
  useEffect(() => { load(); const t = setInterval(load, 8000), c = setInterval(() => setNow(Date.now()), 30000); return () => { clearInterval(t); clearInterval(c); }; }, []);

  async function update(id: string, status: Status) {
    if (status === "DIBATALKAN" && !confirm("Batalkan pesanan ini?")) return;
    setBusy(id);
    await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setFresh(s => { const n = new Set(s); n.delete(id); return n; });
    await load(); setBusy(null);
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); location.href = "/admin/login"; }

  const count = (s: Status) => orders.filter(o => o.status === s).length;
  const today = orders.filter(o => isToday(o.createdAt));
  const revenue = today.filter(o => o.status !== "DIBATALKAN").reduce((s, o) => s + o.total, 0);
  const shown = useMemo(() => orders.filter(o => filter === "SEMUA" ? true : filter === "AKTIF" ? ACTIVE.includes(o.status) : o.status === filter)
    .sort((a, b) => filter === "AKTIF" ? ACTIVE.indexOf(a.status) - ACTIVE.indexOf(b.status) || +new Date(a.createdAt) - +new Date(b.createdAt) : 0), [orders, filter]);

  useEffect(() => { const p = count("PENDING"); document.title = p ? `(${p}) Dashboard Kasir · Maost Kopi` : "Dashboard Kasir · Maost Kopi"; });

  const tabs: { key: Filter; label: string; n: number }[] = [
    { key: "AKTIF", label: "Aktif", n: orders.filter(o => ACTIVE.includes(o.status)).length },
    ...STATUSES.map(s => ({ key: s as Filter, label: META[s].label, n: count(s) })),
    { key: "SEMUA", label: "Semua", n: orders.length },
  ];

  return <main className="relative min-h-screen text-[#F3E9DC]">
    <RoasteryBackdrop />
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[#1A120D]/55" />
    <div className="h-1 bg-gradient-to-r from-[#7A4A22] via-[#C8924F] to-[#7A4A22]" />
    <header className="sticky top-0 z-30 border-b border-[#3A2A1F] bg-[#1A120D]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-4">
          <Image src="/logo-maost.png" alt="Maost Kopi" width={64} height={50} priority />
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-wide md:text-2xl">Dashboard Kasir</h1>
            <p className="flex items-center gap-2 text-xs text-[#B9A795]">
              <span className={`h-2 w-2 rounded-full ${failed ? "bg-red-500" : "animate-pulse bg-emerald-400"}`} />
              {failed ? "Koneksi terputus, mencoba lagi…" : `Live · diperbarui ${updatedAt ? updatedAt.toLocaleTimeString("id-ID") : "…"}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setSound(s => !s); if (!sound) beep(); }} className={`rounded-full border px-4 py-2 text-sm transition ${sound ? "border-[#C8924F] bg-[#C8924F]/15 text-[#E3B57A]" : "border-[#3A2A1F] text-[#B9A795] hover:border-[#C8924F]"}`}>
            {sound ? "🔔 Suara aktif" : "🔕 Suara mati"}
          </button>
          <button onClick={logout} className="rounded-full border border-[#3A2A1F] px-4 py-2 text-sm text-[#B9A795] transition hover:border-red-400 hover:text-red-300">Keluar</button>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-7xl px-5 py-6">
      {/* Ringkasan */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Pesanan hari ini", value: String(today.length) },
          { label: "Menunggu", value: String(count("PENDING")), hl: count("PENDING") > 0 },
          { label: "Sedang diproses", value: String(count("DIPROSES")) },
          { label: "Pendapatan hari ini", value: money(revenue) },
        ].map(s => <div key={s.label} className={`rounded-2xl border p-4 ${s.hl ? "border-amber-400/50 bg-amber-400/10" : "border-[#3A2A1F] bg-[#241912]"}`}>
          <p className="text-xs uppercase tracking-[.2em] text-[#B9A795]">{s.label}</p>
          <p className={`mt-2 text-2xl font-extrabold md:text-3xl ${s.hl ? "text-amber-300" : "text-[#F3E9DC]"}`}>{s.value}</p>
        </div>)}
      </div>

      {/* Filter */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map(t => <button key={t.key} onClick={() => setFilter(t.key)} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === t.key ? "bg-[#C8924F] text-[#1A120D]" : "border border-[#3A2A1F] bg-[#241912] text-[#D9CBB8] hover:border-[#C8924F]"}`}>
          {t.label}<span className={`rounded-full px-2 text-xs ${filter === t.key ? "bg-[#1A120D]/20" : "bg-[#3A2A1F]"}`}>{t.n}</span>
        </button>)}
      </div>

      {/* Daftar pesanan */}
      {!loaded ? <p className="mt-10 text-center text-[#B9A795]">Memuat pesanan…</p>
        : shown.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-[#3A2A1F] p-12 text-center text-[#B9A795]">☕ Belum ada pesanan di kategori ini.</div>
        : <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shown.map(o => {
              const m = META[o.status], next = NEXT[o.status], isNew = fresh.has(o.id) && o.status === "PENDING";
              return <article key={o.id} className={`relative overflow-hidden rounded-2xl border bg-[#241912] transition ${isNew ? "border-amber-400 shadow-[0_0_30px_-8px_rgba(251,191,36,.6)]" : "border-[#3A2A1F]"} shadow-lg shadow-black/30 ${o.status === "SELESAI" || o.status === "DIBATALKAN" ? "opacity-70" : ""}`}>
                <div className={`absolute inset-y-0 left-0 w-1.5 ${m.bar}`} />
                <div className="p-5 pl-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-xs text-[#C8924F]">{o.orderCode}{isNew && <span className="animate-pulse rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-[#1A120D]">BARU</span>}</p>
                      <h2 className="mt-1 truncate text-lg font-bold">{o.customerName}</h2>
                      <p className="text-xs text-[#B9A795]">{ago(o.createdAt, now)} · {new Date(o.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${m.badge}`}>{m.label}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[#3A2A1F] px-3 py-1">{o.fulfillment === "PICKUP" ? `🛍 Pickup ${o.pickupTime || ""}` : "🛵 Delivery"}</span>
                    <span className="rounded-full bg-[#3A2A1F] px-3 py-1">{o.paymentMethod === "CASHIER" ? "💵 Bayar di kasir" : "📱 QRIS/Transfer"}</span>
                    <a href={waLink(o.whatsapp)} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300 hover:bg-emerald-500/25">WA {o.whatsapp}</a>
                  </div>
                  {o.fulfillment === "DELIVERY" && <p className="mt-2 text-xs text-[#D9CBB8]">📍 {o.deliveryAddress || "-"}</p>}

                  <ul className="mt-4 space-y-1.5 border-t border-[#3A2A1F] pt-3 text-sm">
                    {o.items.map(i => <li key={i.id} className="flex justify-between gap-3">
                      <span><b className="text-[#E3B57A]">{i.quantity}×</b> {i.menuName} <span className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${i.variant === "HOT" ? "bg-[#7A3B1E]" : "bg-[#2E4A5A]"}`}>{i.variant}</span></span>
                      <span className="shrink-0 text-[#B9A795]">{money(i.subtotal)}</span>
                    </li>)}
                  </ul>
                  {o.note && <p className="mt-3 rounded-lg bg-[#C8924F]/10 p-2 text-xs text-[#E3B57A]">📝 {o.note}</p>}

                  <div className="mt-4 flex items-center justify-between border-t border-[#3A2A1F] pt-3">
                    <span className="text-xs uppercase tracking-widest text-[#B9A795]">Total</span>
                    <span className="text-xl font-extrabold text-[#E3B57A]">{money(o.total)}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {next && <button disabled={busy === o.id} onClick={() => update(o.id, next.to)} className="flex-1 rounded-full bg-[#C8924F] py-2.5 text-sm font-bold text-[#1A120D] transition hover:bg-[#F3E9DC] disabled:opacity-50">{busy === o.id ? "Menyimpan…" : `${next.label} →`}</button>}
                    <select value={o.status} disabled={busy === o.id} onChange={e => update(o.id, e.target.value as Status)} className={`${next ? "w-36" : "flex-1"} rounded-full border border-[#3A2A1F] bg-[#1A120D] px-3 py-2.5 text-xs text-[#D9CBB8]`} aria-label="Ubah status">
                      {STATUSES.map(s => <option key={s} value={s}>{META[s].label}</option>)}
                    </select>
                  </div>
                </div>
              </article>;
            })}
          </div>}
    </div>
  </main>;
}
