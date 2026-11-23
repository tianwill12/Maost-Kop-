import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";
export const dynamic="force-dynamic";
export default async function OrderReceipt({params}:{params:Promise<{code:string}>}) {
 const {code}=await params; const order=await prisma.order.findUnique({where:{orderCode:code},include:{items:true}});
 if(!order) notFound();
 const wa=process.env.NEXT_PUBLIC_WHATSAPP_ADMIN||"";
 const lines=order.items.map(i=>`- ${i.menuName} (${i.variant}) x${i.quantity}: ${rupiah(i.subtotal)}`).join("%0A");
 const msg=encodeURIComponent(`Halo Maost kop/, saya ingin konfirmasi pesanan ${order.orderCode}.%0A${order.items.map(i=>`- ${i.menuName} (${i.variant}) x${i.quantity}: ${rupiah(i.subtotal)}`).join("\n")}%0ATotal: ${rupiah(order.total)}%0AMetode: ${order.paymentMethod==="CASHIER"?"Bayar di Kasir":"QRIS/Transfer"}`);
 const href=`https://wa.me/${wa.replace(/\D/g,"")}?text=${msg}`;
 return <main className="mx-auto min-h-screen max-w-xl px-5 py-12"><div className="rounded-3xl bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#A66A32]">Order received</p><h1 className="mt-3 text-3xl font-semibold">Terima kasih!</h1><p className="mt-2 text-stone-500">Pesananmu sudah tersimpan di Maost kop/.</p><div className="my-7 rounded-2xl bg-[#F2ECE4] p-5"><p className="text-xs text-stone-500">Nomor pesanan</p><p className="mt-1 text-2xl font-bold">{order.orderCode}</p><p className="mt-4 text-xs text-stone-500">Status</p><p className="font-semibold">{order.status}</p></div><h2 className="font-semibold">Rincian pesanan</h2><div className="mt-3 space-y-3">{order.items.map(i=><div key={i.id} className="flex justify-between gap-3 text-sm"><span>{i.menuName} · {i.variant} × {i.quantity}</span><b>{rupiah(i.subtotal)}</b></div>)}</div><div className="mt-5 border-t pt-4"><div className="flex justify-between text-lg font-bold"><span>Total</span><span>{rupiah(order.total)}</span></div><p className="mt-2 text-sm text-stone-500">Pembayaran: {order.paymentMethod==="CASHIER"?"Bayar di Kasir (Cash/QRIS On-Site)":"QRIS / Transfer Bank"}</p></div>{wa&&<a href={href} target="_blank" rel="noreferrer" className="mt-7 block rounded-full bg-[#1C1917] py-3 text-center font-semibold text-white">Konfirmasi via WhatsApp</a>}<Link href="/" className="mt-4 block text-center text-sm text-stone-500">Kembali ke beranda</Link></div></main>;
}