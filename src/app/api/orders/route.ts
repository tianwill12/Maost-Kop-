import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
const schema = z.object({
 customerName:z.string().trim().min(2).max(100), whatsapp:z.string().trim().min(8).max(20),
 note:z.string().max(500).optional().nullable(), fulfillment:z.enum(["PICKUP","DELIVERY"]),
 pickupTime:z.string().optional().nullable(), deliveryAddress:z.string().max(500).optional().nullable(),
 paymentMethod:z.enum(["QRIS_TRANSFER","CASHIER"]),
 items:z.array(z.object({menuId:z.string(),variant:z.enum(["HOT","ICE"]),quantity:z.number().int().min(1).max(20)})).min(1).max(30)
});
export async function POST(req:NextRequest) {
 try {
  const parsed=schema.safeParse(await req.json());
  if(!parsed.success) return NextResponse.json({error:"Data pesanan tidak valid.",details:parsed.error.flatten()},{status:400});
  const d=parsed.data;
  if(d.fulfillment==="DELIVERY"&&!d.deliveryAddress?.trim()) return NextResponse.json({error:"Alamat delivery wajib diisi."},{status:400});
  if(d.fulfillment==="PICKUP"&&!d.pickupTime) return NextResponse.json({error:"Jam pickup wajib dipilih."},{status:400});
  const ids=[...new Set(d.items.map(i=>i.menuId))];
  const menus=await prisma.menu.findMany({where:{id:{in:ids},available:true}});
  if(menus.length!==ids.length) return NextResponse.json({error:"Salah satu menu tidak tersedia."},{status:409});
  const map=new Map(menus.map(m=>[m.id,m]));
  const items=d.items.map(i=>{const m=map.get(i.menuId)!;return {menuId:m.id,menuName:m.name,variant:i.variant,quantity:i.quantity,unitPrice:m.price,subtotal:m.price*i.quantity};});
  const subtotal=items.reduce((s,i)=>s+i.subtotal,0);
  const orderCode=`MK-${new Date().getFullYear()}${String(Date.now()).slice(-5)}`;
  const order=await prisma.order.create({data:{orderCode,customerName:d.customerName,whatsapp:d.whatsapp,note:d.note||null,fulfillment:d.fulfillment,pickupTime:d.pickupTime||null,deliveryAddress:d.deliveryAddress||null,paymentMethod:d.paymentMethod,subtotal,total:subtotal,items:{create:items}},include:{items:true}});
  return NextResponse.json({ok:true,order:{orderCode:order.orderCode,total:order.total,status:order.status}}, {status:201});
 } catch(e) { console.error(e); return NextResponse.json({error:"Tidak dapat menyimpan pesanan."},{status:500}); }
}