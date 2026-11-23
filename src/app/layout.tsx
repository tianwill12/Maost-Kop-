import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Maost kop/ — Coffee & Stories", description: "Pesan kopi favoritmu dari Maost kop/" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}