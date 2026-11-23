import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const menus = await prisma.menu.findMany({ where: { available: true }, orderBy: [{category:"asc"},{name:"asc"}], select: { id:true,name:true,description:true,price:true,category:true,imageUrl:true } });
  return NextResponse.json({ menus });
}