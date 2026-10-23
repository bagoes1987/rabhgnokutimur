import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Executive Event Portal • HUT PGRI Ke-79 & HGN Kab. OKU Timur | SMAN 1 Belitang",
  description:
    "Sistem Perencanaan Teknis Arsitektural 2D/3D CAD & Rencana Anggaran Biaya (RAB) Peringatan HUT PGRI Ke-79 & Hari Guru Nasional (HGN) Kabupaten OKU Timur di Lapangan SMAN 1 Belitang (3.000 Kursi).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
