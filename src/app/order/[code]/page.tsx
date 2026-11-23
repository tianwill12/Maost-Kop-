import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
import CoffeeBackdrop from "@/components/coffee-backdrop";
import AutoRefresh from "./auto-refresh";

export const dynamic = "force-dynamic";

const STEPS = [
  { key: "PENDING", label: "Diterima" },
  { key: "DIPROSES", label: "Diracik" },
  { key: "SIAP_DIAMBIL", label: "Siap diambil" },
  { key: "SELESAI", label: "Selesai" },
];

export default async function OrderReceipt({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const order = await prisma.order.findUnique({ where: { orderCode: code }, include: { items: true } });
  if (!order) notFound();

  const wa = process.env.NEXT_PUBLIC_WHATSAPP_ADMIN || "";
  const waNumber = (() => { const d = wa.replace(/\D/g, ""); return d.startsWith("0") ? "62" + d.slice(1) : d; })();
  const msg = [
    `Halo Maost Kopi, saya ingin konfirmasi pesanan ${order.orderCode}.`,
    ...order.items.map(i => `- ${i.menuName} (${i.variant}) x${i.quantity}: ${rupiah(i.subtotal)}`),
    `Total: ${rupiah(order.total)}`,
    `Metode: ${order.paymentMethod === "CASHIER" ? "Bayar di Kasir" : "QRIS/Transfer"}`,
  ].join("\n");
  const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

  const cancelled = order.status === "DIBATALKAN";
  const stepIndex = STEPS.findIndex(s => s.key === order.status);
  const active = !cancelled && order.status !== "SELESAI";

  return <main className="relative min-h-screen px-5 py-10 text-[#F3E9DC]">
    <CoffeeBackdrop />
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[#1A120D]/75" />
    <AutoRefresh active={active} />

    <div className="mx-auto max-w-xl rounded-3xl border border-[#3A2A1F] bg-[#140D09]/85 p-7 backdrop-blur-md">
      <Image src="/logo-maost.png" alt="Maost Kopi" width={90} height={70} />
      <p className="mt-6 text-xs font-bold uppercase tracking-[.35em] text-[#C8924F]">Order received</p>
      <h1 className="mt-2 text-3xl font-extrabold uppercase">Terima kasih!</h1>
      <p className="mt-2 text-[#D9CBB8]">Pesananmu sudah kami terima. Halaman ini otomatis menampilkan status terbaru.</p>

      <div className="my-7 rounded-2xl border border-[#3A2A1F] bg-[#241912] p-5">
        <p className="text-xs uppercase tracking-widest text-[#B9A795]">Nomor pesanan</p>
        <p className="mt-1 text-2xl font-extrabold text-[#E3B57A]">{order.orderCode}</p>
        {cancelled
          ? <p className="mt-5 rounded-xl bg-red-500/15 p-3 text-sm font-semibold text-red-300">Pesanan ini dibatalkan. Hubungi kami lewat WhatsApp jika ada pertanyaan.</p>
          : <ol className="mt-6 grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => <li key={s.key} className="text-center">
                <div className={`mx-auto h-2 rounded-full ${i <= stepIndex ? "bg-[#C8924F]" : "bg-[#3A2A1F]"} ${i === stepIndex && active ? "animate-pulse" : ""}`} />
                <p className={`mt-2 text-[11px] ${i <= stepIndex ? "font-semibold text-[#F3E9DC]" : "text-[#7D6A5B]"}`}>{s.label}</p>
              </li>)}
            </ol>}
      </div>

      <h2 className="font-bold uppercase tracking-wide">Rincian pesanan</h2>
      <div className="mt-3 space-y-3">
        {order.items.map(i => <div key={i.id} className="flex justify-between gap-3 text-sm">
          <span>{i.menuName} · {i.variant} × {i.quantity}</span><b className="text-[#E3B57A]">{rupiah(i.subtotal)}</b>
        </div>)}
      </div>
      <div className="mt-5 border-t border-[#3A2A1F] pt-4">
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#E3B57A]">{rupiah(order.total)}</span></div>
        <p className="mt-2 text-sm text-[#B9A795]">Pembayaran: {order.paymentMethod === "CASHIER" ? "Bayar di Kasir (Cash/QRIS On-Site)" : "QRIS / Transfer Bank"}</p>
      </div>
      {wa && <a href={href} target="_blank" rel="noreferrer" className="mt-7 block rounded-full bg-[#C8924F] py-3 text-center font-bold uppercase tracking-wider text-[#1A120D] transition hover:bg-[#F3E9DC]">Konfirmasi via WhatsApp</a>}
      <Link href="/" className="mt-4 block text-center text-sm text-[#B9A795] hover:text-[#C8924F]">Kembali ke beranda</Link>
    </div>
  </main>;
}
