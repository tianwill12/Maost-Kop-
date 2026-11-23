"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* Memuat ulang status pesanan setiap 10 detik selama pesanan belum selesai. */
export default function AutoRefresh({ active }: { active: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => router.refresh(), 10000);
    return () => clearInterval(t);
  }, [active, router]);
  return null;
}
