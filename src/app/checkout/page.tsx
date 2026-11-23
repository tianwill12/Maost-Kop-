"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GnomeBaristaBackdrop from "@/components/gnome-barista-backdrop";
import { menuImage } from "@/lib/menu-image";

type Menu = { id: string; name: string; price: number; category: string; description?: string | null; imageUrl?: string | null };
type CartItem = { menuId: string; name: string; price: number; variant: "HOT" | "ICE"; quantity: number };
const money = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const card = "rounded-2xl border border-[#3A2A1F] bg-[#1A120D]/75 p-5 backdrop-blur-md md:p-6";
const input = "w-full rounded-xl border border-[#3A2A1F] bg-[#140D09]/80 p-3 text-[#F3E9DC] placeholder:text-[#7D6A5B] outline-none transition focus:border-[#C8924F]";
const pill = (on: boolean) => `rounded-full px-4 py-2 text-sm font-semibold transition ${on ? "bg-[#C8924F] text-[#1A120D]" : "border border-[#3A2A1F] bg-[#140D09]/70 text-[#D9CBB8] hover:border-[#C8924F]"}`;

function Step({ n, title }: { n: number; title: string }) {
  return <h2 className="flex items-center gap-3 text-lg font-bold uppercase tracking-wide">
    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#C8924F] text-sm text-[#1A120D]">{n}</span>{title}
  </h2>;
}

export default function Checkout() {
  const [menus, setMenus] = useState<Menu[]>([]), [cart, setCart] = useState<CartItem[]>([]), [menuLoading, setMenuLoading] = useState(true);
  const [name, setName] = useState(""), [wa, setWa] = useState(""), [note, setNote] = useState("");
  const [fulfillment, setFulfillment] = useState<"PICKUP" | "DELIVERY">("PICKUP"), [pickupTime, setPickupTime] = useState("10:00"), [address, setAddress] = useState("");
  const [payment, setPayment] = useState<"QRIS_TRANSFER" | "CASHIER">("QRIS_TRANSFER"), [loading, setLoading] = useState(false), [error, setError] = useState("");

  useEffect(() => { fetch("/api/menus").then(r => r.json()).then(d => setMenus(d.menus || [])).finally(() => setMenuLoading(false)); }, []);
  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const count = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const qtyOf = (id: string) => cart.filter(i => i.menuId === id).reduce((s, i) => s + i.quantity, 0);

  function add(m: Menu, variant: "HOT" | "ICE") { setCart(old => { const found = old.find(i => i.menuId === m.id && i.variant === variant); return found ? old.map(i => i === found ? { ...i, quantity: i.quantity + 1 } : i) : [...old, { menuId: m.id, name: m.name, price: m.price, variant, quantity: 1 }]; }); }
  function change(index: number, delta: number) { setCart(old => old.map((i, n) => n === index ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0)); }
  async function submit() {
    setError("");
    if (!name.trim() || !wa.trim() || !cart.length || (fulfillment === "DELIVERY" && !address.trim())) { setError("Lengkapi nama, WhatsApp, item pesanan, dan alamat delivery jika dipilih."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerName: name, whatsapp: wa, note, fulfillment, pickupTime: fulfillment === "PICKUP" ? pickupTime : null, deliveryAddress: fulfillment === "DELIVERY" ? address : null, paymentMethod: payment, items: cart.map(i => ({ menuId: i.menuId, variant: i.variant, quantity: i.quantity })) }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Pesanan gagal dibuat");
      location.href = `/order/${d.order.orderCode}`;
    } catch (e) { setError(e instanceof Error ? e.message : "Terjadi kesalahan"); } finally { setLoading(false); }
  }

  return <main className="relative min-h-screen pb-28 text-[#F3E9DC] lg:pb-16">
    <GnomeBaristaBackdrop />
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[#1A120D]/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#1A120D] lg:via-[#1A120D]/85 lg:to-[#1A120D]/20" />

    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Link href="/" className="flex items-center gap-3 text-sm text-[#B9A795] hover:text-[#C8924F]">
        <span>←</span><Image src="/logo-maost.png" alt="Maost Kopi" width={60} height={47} />
      </Link>
      <span className="hidden text-xs uppercase tracking-[.35em] text-[#C8924F] sm:block">Urban Coffee System</span>
    </header>

    <section className="mx-auto max-w-6xl px-5 pb-8 pt-6 md:pb-14 md:pt-10">
      <p className="text-xs font-bold uppercase tracking-[.4em] text-[#C8924F]">Freshly brewed</p>
      <h1 className="mt-3 max-w-xl text-4xl font-extrabold uppercase leading-tight md:text-6xl">Racik pesananmu</h1>
      <p className="mt-4 max-w-md text-[#D9CBB8]">Pilih kopi favorit, isi data, dan pesananmu langsung kami racik di balik jendela Maost Kopi.</p>
    </section>

    <div className="mx-auto grid max-w-6xl gap-6 px-5 lg:grid-cols-[1.25fr_.75fr]">
      <section className="space-y-6">
        <div className={card}>
          <Step n={1} title="Pilih menu" />
          {menuLoading ? <p className="mt-5 text-sm text-[#B9A795]">Memuat menu…</p>
            : menus.length === 0 ? <p className="mt-5 text-sm text-[#B9A795]">Menu belum tersedia.</p>
            : <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {menus.map(m => {
                  const q = qtyOf(m.id);
                  return <article key={m.id} className={`group flex gap-4 rounded-2xl border bg-[#241912]/80 p-3 transition ${q ? "border-[#C8924F]" : "border-[#3A2A1F] hover:border-[#C8924F]/60"}`}>
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image src={menuImage(m.name, m.imageUrl)} alt={m.name} fill unoptimized className="object-cover transition duration-500 group-hover:scale-110" />
                      {q > 0 && <span className="absolute right-1 top-1 grid h-6 min-w-6 place-items-center rounded-full bg-[#C8924F] px-1 text-xs font-bold text-[#1A120D]">{q}</span>}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="truncate font-bold uppercase tracking-wide">{m.name}</h3>
                      {m.description && <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#B9A795]">{m.description}</p>}
                      <p className="mt-1 text-sm font-semibold text-[#E3B57A]">{money(m.price)}</p>
                      <div className="mt-auto flex gap-2 pt-2">
                        <button onClick={() => add(m, "HOT")} className="flex-1 rounded-full border border-[#C8924F]/70 px-2 py-1.5 text-xs font-bold text-[#E3B57A] transition hover:bg-[#C8924F] hover:text-[#1A120D]">+ Hot</button>
                        <button onClick={() => add(m, "ICE")} className="flex-1 rounded-full bg-[#F3E9DC] px-2 py-1.5 text-xs font-bold text-[#1A120D] transition hover:bg-[#C8924F]">+ Ice</button>
                      </div>
                    </div>
                  </article>;
                })}
              </div>}
        </div>

        <div className={card}>
          <Step n={2} title="Data pelanggan" />
          <div className="mt-5 grid gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama lengkap" className={input} />
            <input value={wa} onChange={e => setWa(e.target.value)} inputMode="tel" placeholder="Nomor WhatsApp (contoh 08...)" className={input} />
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan pesanan (opsional), misal: less sugar" rows={2} className={input} />
          </div>
        </div>

        <div className={card}>
          <Step n={3} title="Pengambilan" />
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => setFulfillment("PICKUP")} className={pill(fulfillment === "PICKUP")}>Pickup di Kedai</button>
            <button onClick={() => setFulfillment("DELIVERY")} className={pill(fulfillment === "DELIVERY")}>Delivery</button>
          </div>
          {fulfillment === "PICKUP"
            ? <label className="mt-5 block text-sm text-[#B9A795]">Jam ambil<input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className={`${input} mt-2 max-w-[180px]`} /></label>
            : <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Alamat lengkap dan patokan" rows={3} className={`${input} mt-5`} />}
        </div>

        <div className={card}>
          <Step n={4} title="Pembayaran" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {([["QRIS_TRANSFER", "QRIS / Transfer Bank", "Bayar online"], ["CASHIER", "Bayar di Kasir", "Cash / QRIS di tempat"]] as const).map(([val, label, sub]) =>
              <button key={val} onClick={() => setPayment(val)} className={`rounded-xl border p-4 text-left transition ${payment === val ? "border-[#C8924F] bg-[#C8924F]/15" : "border-[#3A2A1F] bg-[#140D09]/70 hover:border-[#C8924F]/60"}`}>
                <span className="flex items-center gap-2 font-semibold"><span className={`h-3 w-3 rounded-full border-2 ${payment === val ? "border-[#C8924F] bg-[#C8924F]" : "border-[#7D6A5B]"}`} />{label}</span>
                <span className="mt-1 block pl-5 text-xs text-[#B9A795]">{sub}</span>
              </button>)}
          </div>
          {payment === "QRIS_TRANSFER" && <p className="mt-4 rounded-xl border border-[#C8924F]/30 bg-[#C8924F]/10 p-3 text-xs leading-5 text-[#E3B57A]">Instruksi pembayaran otomatis akan tersedia setelah Payment Gateway Midtrans/Xendit dikonfigurasi oleh admin.</p>}
        </div>
      </section>

      <aside id="ringkasan" className="h-fit rounded-2xl border border-[#C8924F]/40 bg-[#140D09]/85 p-6 backdrop-blur-md lg:sticky lg:top-6">
        <h2 className="text-lg font-bold uppercase tracking-wide">Ringkasan pesanan</h2>
        {cart.length === 0
          ? <p className="mt-5 text-sm text-[#B9A795]">Belum ada item. Tambahkan menu terlebih dahulu.</p>
          : <div className="mt-5 space-y-4">
              {cart.map((i, n) => <div key={`${i.menuId}-${i.variant}`} className="flex justify-between gap-3 border-b border-[#3A2A1F] pb-4 text-sm">
                <div>
                  <b className="uppercase tracking-wide">{i.name}</b>
                  <p className="text-xs text-[#B9A795]"><span className={`mr-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${i.variant === "HOT" ? "bg-[#7A3B1E] text-[#F3E9DC]" : "bg-[#2E4A5A] text-[#DCEBF3]"}`}>{i.variant}</span>{money(i.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => change(n, -1)} className="grid h-7 w-7 place-items-center rounded-full border border-[#3A2A1F] hover:border-[#C8924F]">−</button>
                    <span className="w-5 text-center font-semibold">{i.quantity}</span>
                    <button onClick={() => change(n, 1)} className="grid h-7 w-7 place-items-center rounded-full border border-[#3A2A1F] hover:border-[#C8924F]">+</button>
                  </div>
                </div>
                <span className="font-semibold text-[#E3B57A]">{money(i.price * i.quantity)}</span>
              </div>)}
            </div>}
        <div className="mt-5 flex justify-between text-xl font-bold"><span>Total</span><span className="text-[#E3B57A]">{money(total)}</span></div>
        <p className="mt-2 text-xs text-[#B9A795]">Biaya delivery (jika ada) akan dikonfirmasi oleh admin.</p>
        {error && <p className="mt-4 rounded-xl bg-red-900/50 p-3 text-sm text-red-200">{error}</p>}
        <button disabled={loading || !cart.length} onClick={submit} className="mt-6 w-full rounded-full bg-[#C8924F] py-3 font-bold uppercase tracking-wider text-[#1A120D] transition hover:bg-[#F3E9DC] disabled:opacity-40">{loading ? "Memproses..." : "Buat Pesanan"}</button>
      </aside>
    </div>

    {/* Bar ringkas di HP */}
    {count > 0 && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3A2A1F] bg-[#140D09]/95 px-5 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div><p className="text-xs text-[#B9A795]">{count} item</p><p className="text-lg font-bold text-[#E3B57A]">{money(total)}</p></div>
        <a href="#ringkasan" className="rounded-full bg-[#C8924F] px-6 py-3 text-sm font-bold uppercase text-[#1A120D]">Lanjut bayar</a>
      </div>
    </div>}
  </main>;
}
