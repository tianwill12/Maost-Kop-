/* Gambar menu: pakai imageUrl dari database jika ada,
   kalau tidak, pakai ilustrasi di public/menu/<nama-menu>.svg */
const MENU_IMAGES = new Set([
  "americano", "long-black", "hazelnut-coffee-latte", "caramel-machiato",
  "vanilla-coffee-latte", "coffee-brown-sugar", "maost-mocha", "choco-presso",
]);

export const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function menuImage(name: string, imageUrl?: string | null) {
  if (imageUrl) return imageUrl;
  const s = slug(name);
  return MENU_IMAGES.has(s) ? `/menu/${s}.svg` : "/menu/americano.svg";
}
