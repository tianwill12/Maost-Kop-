import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

/* ====== PENGATURAN YANG MUDAH DIUBAH ====== */
const INSTAGRAM_REEL = "https://www.instagram.com/reel/DIvnN-kTED1/";
const MAPS_LINK = "https://maps.app.goo.gl/Mz6FsUNUngjvWt939";
const MAPS_EMBED = "https://www.google.com/maps?q=2.4692359,99.144949&z=17&output=embed";
const ALAMAT = "Area Toko Betania (lihat pin di peta)";

const NAV = [
  { label: "Kopi", href: "#kopi" },
  { label: "Menu", href: "#menu" },
  { label: "Cerita", href: "#cerita" },
  { label: "Video", href: "#video" },
  { label: "Lokasi", href: "#lokasi" },
];

/* Gambar menu: public/menu/<nama-menu>.svg */
const MENU_IMAGES = new Set([
  "americano", "long-black", "hazelnut-coffee-latte", "caramel-machiato",
  "vanilla-coffee-latte", "coffee-brown-sugar", "maost-mocha", "choco-presso",
]);
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const menuImage = (name: string) => (MENU_IMAGES.has(slug(name)) ? `/menu/${slug(name)}.svg` : "/menu/americano.svg");

/* Palet warna: espresso gelap + karamel */
// latar #1A120D · kartu #241912 · garis #3A2A1F · krem #F3E9DC · karamel #C8924F · teks redup #B9A795

export default async function Home() {
  const menus = await prisma.menu.findMany({ where: { available: true }, orderBy: [{ category: "asc" }, { id: "asc" }] });

  return <main className="min-h-screen bg-[#1A120D] text-[#F3E9DC] selection:bg-[#C8924F] selection:text-[#1A120D]">
    <div className="h-1 bg-gradient-to-r from-[#7A4A22] via-[#C8924F] to-[#7A4A22]" />

    {/* NAVBAR */}
    <header className="sticky top-0 z-50 border-b border-[#3A2A1F] bg-[#1A120D]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="shrink-0">
          <Image src="/logo-maost.png" alt="Maost Kopi" width={72} height={56} priority />
        </Link>
        <ul className="hidden flex-1 items-center justify-center gap-9 md:flex">
          {NAV.map(n => <li key={n.href}><a href={n.href} className="text-xs uppercase tracking-[.35em] text-[#B9A795] transition hover:text-[#C8924F]">{n.label}</a></li>)}
        </ul>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="tracking-[.15em] text-[#B9A795] hover:text-[#F3E9DC]">Admin</Link>
          <Link href="/checkout" className="rounded-full bg-[#C8924F] px-5 py-2 font-bold tracking-wide text-[#1A120D] transition hover:bg-[#F3E9DC]">Pesan</Link>
        </div>
      </nav>
    </header>

    {/* HERO */}
    <section id="kopi" className="relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-full md:w-3/5">
        <Image src="/hero-truck.jpg" alt="Mobil kopi Maost Kopi di malam hari" fill className="object-cover object-center" sizes="(min-width: 768px) 60vw, 100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A120D] via-[#1A120D]/75 to-[#1A120D]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A120D] via-transparent to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20">
        <div className="max-w-xl">
          <Image src="/logo-maost.png" alt="Maost Kopi" width={260} height={203} className="mb-8 h-auto w-48 md:w-64" priority />
          <p className="mb-4 text-xs font-bold uppercase tracking-[.4em] text-[#C8924F]">Urban Coffee System</p>
          <h1 className="text-4xl font-extrabold uppercase leading-tight md:text-6xl">Kopi Kami</h1>
          <p className="mt-6 text-lg leading-9 text-[#D9CBB8]">
            Dari balik jendela mobil kopi kami, setiap cangkir diracik dengan sepenuh hati.
            Biji kopi pilihan, rasa yang jujur, untuk menemani jeda kecil di tengah harimu.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#menu" className="rounded-md bg-[#C8924F] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#1A120D] transition hover:bg-[#F3E9DC]">Lihat Menu »</a>
            <a href="#lokasi" className="rounded-md border-2 border-[#F3E9DC]/70 px-7 py-3 text-sm font-bold uppercase tracking-wider transition hover:border-[#C8924F] hover:text-[#C8924F]">Temukan Kami</a>
          </div>
        </div>
      </div>
    </section>

    {/* MENU */}
    <section id="menu" className="border-t border-[#3A2A1F] bg-[#140D09]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[.4em] text-[#C8924F]">Coffee Series</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase md:text-5xl">Menu Kami</h2>
          <div className="mx-auto mt-5 h-px w-24 bg-[#C8924F]" />
        </div>
        {menus.length === 0
          ? <p className="rounded-2xl border border-[#3A2A1F] bg-[#241912] p-6 text-center text-[#B9A795]">Menu belum tersedia. Jalankan <code>npm run db:seed</code> terlebih dahulu.</p>
          : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {menus.map(m => <article key={m.id} className="group overflow-hidden rounded-2xl border border-[#3A2A1F] bg-[#241912] transition duration-300 hover:-translate-y-1 hover:border-[#C8924F]/60 hover:shadow-[0_10px_40px_-10px_rgba(200,146,79,.35)]">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={menuImage(m.name)} alt={m.name} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[.3em] text-[#C8924F]">{m.category}</p>
                  <h3 className="mt-2 text-lg font-bold uppercase tracking-wide">{m.name}</h3>
                  <p className="mt-1 min-h-10 text-sm leading-6 text-[#B9A795]">{m.description}</p>
                  <p className="mt-4 text-lg font-semibold text-[#E3B57A]">{rupiah(m.price)}</p>
                </div>
              </article>)}
            </div>}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#3A2A1F] bg-gradient-to-r from-[#2B1D14] to-[#3A2619] p-8">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wide">Siap memesan?</h3>
            <p className="mt-2 text-sm text-[#B9A795]">Buka halaman pemesanan untuk mengisi keranjang dan checkout.</p>
          </div>
          <Link href="/checkout" className="rounded-md bg-[#C8924F] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#1A120D] transition hover:bg-[#F3E9DC]">Pesan Sekarang »</Link>
        </div>
      </div>
    </section>

    {/* CERITA */}
    <section id="cerita" className="border-t border-[#3A2A1F]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image src="/cup.jpg" alt="Es kopi Maost Kopi" fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl">
            <Image src="/bar.jpg" alt="Bar Maost Kopi" fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[.4em] text-[#C8924F]">Cerita Kami</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase md:text-4xl">Kopi dari balik jendela</h2>
          <p className="mt-6 text-lg leading-8 text-[#D9CBB8]">
            Maost Kopi lahir dari mobil kopi sederhana dengan lampu kuning hangat dan grinder penuh stiker.
            Kami percaya kopi enak tidak harus rumit, cukup diracik dengan jujur dan disajikan dengan senyum.
          </p>
          <p className="mt-4 leading-8 text-[#B9A795]">Mampir, pesan, dan nikmati jeda kecilmu bersama kami.</p>
        </div>
      </div>
    </section>

    {/* VIDEO */}
    <section id="video" className="border-t border-[#3A2A1F] bg-[#140D09]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[.4em] text-[#C8924F]">Behind the Bar</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase md:text-4xl">Suasana Maost Kopi</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-[#D9CBB8]">Intip proses racik kopi dan suasana bar kami lewat video singkat ini.</p>
          <a href={INSTAGRAM_REEL} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-md border-2 border-[#F3E9DC]/70 px-7 py-3 text-sm font-bold uppercase tracking-wider transition hover:border-[#C8924F] hover:text-[#C8924F]">Buka di Instagram »</a>
        </div>
        <div className="mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl border border-[#3A2A1F] bg-white">
          <iframe src={`${INSTAGRAM_REEL}embed`} title="Video Maost Kopi" className="h-[720px] w-full" loading="lazy" allowFullScreen />
        </div>
      </div>
    </section>

    {/* LOKASI */}
    <section id="lokasi" className="border-t border-[#3A2A1F]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-5 md:items-center">
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[.4em] text-[#C8924F]">Lokasi</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase md:text-4xl">Temukan Kami</h2>
          <p className="mt-5 text-lg leading-8 text-[#D9CBB8]">{ALAMAT}</p>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block rounded-md bg-[#C8924F] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#1A120D] transition hover:bg-[#F3E9DC]">Buka di Google Maps »</a>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#3A2A1F] md:col-span-3">
          <iframe src={MAPS_EMBED} title="Peta lokasi Maost Kopi" className="h-[400px] w-full grayscale-[40%] contrast-[1.05]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>

    {/* FOOTER */}
    <footer id="about" className="border-t border-[#3A2A1F] bg-[#0F0A07]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-14 text-center">
        <Image src="/logo-maost.png" alt="Maost Kopi" width={160} height={125} />
        <p className="text-xs uppercase tracking-[.4em] text-[#B9A795]">Urban Coffee System</p>
        <div className="flex gap-6 text-sm text-[#B9A795]">
          <a href={INSTAGRAM_REEL} target="_blank" rel="noopener noreferrer" className="hover:text-[#C8924F]">Instagram</a>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-[#C8924F]">Google Maps</a>
        </div>
        <p className="text-xs text-[#6F5E50]">© {new Date().getFullYear()} Maost Kopi · Coffee made with care.</p>
      </div>
    </footer>
  </main>;
}
