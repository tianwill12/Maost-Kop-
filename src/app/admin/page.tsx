import {redirect} from "next/navigation";import {isAdmin} from "@/lib/auth";import AdminBoard from "./board";
export const dynamic="force-dynamic";
export default async function Admin(){if(!await isAdmin())redirect("/admin/login");return <AdminBoard/>;}