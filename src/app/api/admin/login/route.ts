import {NextRequest,NextResponse} from "next/server";
import {createAdminSession} from "@/lib/auth";
export async function POST(req:NextRequest){const {password}=await req.json();if(!process.env.ADMIN_PASSWORD||password!==process.env.ADMIN_PASSWORD)return NextResponse.json({error:"Unauthorized"},{status:401});await createAdminSession();return NextResponse.json({ok:true});}