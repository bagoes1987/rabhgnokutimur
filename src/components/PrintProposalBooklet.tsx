"use client";

import React from "react";

export interface RabItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
}

interface PrintProposalBookletProps {
  rabItems: RabItem[];
  rabDiscount: number;
  formatRupiah: (num: number) => string;
  terbilangRupiah: (num: number) => string;
}

export default function PrintProposalBooklet({
  rabItems,
  rabDiscount,
  formatRupiah,
  terbilangRupiah,
}: PrintProposalBookletProps) {
  const rawSubtotal = rabItems.reduce(
    (acc, it) => acc + (it.qty || 0) * (it.price || 0),
    0
  );
  const grandTotal = Math.max(0, rawSubtotal - (rabDiscount || 0));
  const terbilangText = terbilangRupiah(grandTotal);

  return (
    <section
      id="printDocument"
      className="print-only max-w-5xl mx-auto text-slate-900 bg-white"
    >
      {/* ================= HALAMAN 1: COVER UTAMA PROPOSAL (SAMPUL EKSEKUTIF EO) ================= */}
      <div className="print-page page-break flex flex-col justify-between p-2">
        <div className="border-4 border-double border-emerald-900/80 rounded-2xl p-6 h-full flex flex-col justify-between bg-gradient-to-b from-emerald-50/50 via-white to-amber-50/40 relative overflow-hidden">
          <div className="text-center pb-4 border-b-2 border-emerald-800/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 text-white text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
              <span>⭐</span> OFFICIAL PROPOSAL & TECHNICAL BLUEPRINT • EVENT
              ORGANIZER <span>⭐</span>
            </div>
            <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">
              PEMERINTAH KABUPATEN OGAN KOMERING ULU TIMUR & PGRI OKU TIMUR
            </div>
          </div>

          <div className="text-center my-auto py-2">
            <span className="text-xs uppercase tracking-widest font-extrabold text-amber-700 block mb-1">
              DOKUMEN PROPOSAL TEKNIS PENGAJUAN
            </span>
            <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase max-w-2xl mx-auto">
              TATA RUANG, RIGGING PANGGUNG, VISUALISASI 3D & RENCANA ANGGARAN
              BIAYA (RAB)
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto my-3 rounded-full"></div>
            <h2 className="text-base font-extrabold text-emerald-900 uppercase tracking-wide">
              PERINGATAN SEMARAK HUT PGRI KE-79 & HARI GURU NASIONAL (HGN)
            </h2>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Lokasi Pelaksanaan: Lapangan Utama SMAN 1 Belitang, Kabupaten OKU
              Timur
            </p>

            <div className="mt-4 mx-auto max-w-xl rounded-xl overflow-hidden border-2 border-slate-300 shadow-md">
              <img
                src="/stage_3d_front.jpg"
                className="w-full h-[62mm] object-cover"
                alt="Cover Stage Render"
              />
              <div className="bg-slate-900 text-white text-[10px] py-1.5 px-3 font-semibold flex justify-between items-center">
                <span>
                  Visualisasi 3D Panggung Rigging Lengkung 8 × 6 Meter &
                  Videotron LED 8 × 3 Meter
                </span>
                <span className="text-amber-400 font-bold">
                  Skala 1:100 CAD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5 max-w-xl mx-auto mt-4 text-left">
              <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">
                  Kapasitas Peserta
                </span>
                <span className="text-sm font-black text-emerald-800">
                  3.000+ Guru
                </span>
                <span className="text-[9px] text-slate-600 block">
                  Napolly BIG-208
                </span>
              </div>
              <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">
                  Dimensi Tapak
                </span>
                <span className="text-sm font-black text-slate-900">
                  22 × 96 Meter
                </span>
                <span className="text-[9px] text-slate-600 block">
                  1 Hamparan Utuh
                </span>
              </div>
              <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">
                  Panggung Utama
                </span>
                <span className="text-sm font-black text-amber-700">
                  8 × 6 Meter
                </span>
                <span className="text-[9px] text-slate-600 block">
                  Truss Lengkung +1,2m
                </span>
              </div>
              <div className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">
                  Total Anggaran
                </span>
                <span className="text-sm font-black text-emerald-800">
                  {formatRupiah(grandTotal)}
                </span>
                <span className="text-[9px] text-slate-600 block">
                  Paket Terpadu EO
                </span>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-300 pt-3 flex justify-between items-end text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Diajukan Kepada Yth:
              </span>
              <div className="font-black text-slate-900 text-sm">
                BUPATI OKU TIMUR & KETUA PGRI KAB. OKU TIMUR
              </div>
              <div className="text-[11px] text-slate-600">
                Melalui Panitia Pelaksana HUT PGRI & HGN Kabupaten OKU Timur
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Disusun Oleh:
              </span>
              <div className="font-black text-emerald-900 text-sm">
                TIM TEKNIS & EVENT ORGANIZER (EO)
              </div>
              <div className="text-[11px] text-slate-600">
                OKU Timur • Tahun Anggaran 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= HALAMAN 2: SURAT PENGANTAR & RINGKASAN EKSEKUTIF EO ================= */}
      <div className="print-page page-break flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-slate-800 pb-2 mb-4 flex justify-between items-center">
            <div>
              <div className="text-sm font-black text-emerald-900 tracking-wide uppercase">
                DIVISI MANAJEMEN PRODUKSI & REKAYASA TATA RUANG ACARA
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Dokumen Penawaran Teknis, Cetak Biru Arsitektural 2D/3D CAD &
                Rencana Anggaran Biaya (RAB)
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-600 font-mono">
              <div>No. Dok: 048/EO-PGRI/OKUT/X/2026</div>
              <div>Sifat: Penting / Eksekutif</div>
            </div>
          </div>

          <div className="mb-4 text-xs leading-relaxed text-slate-800 space-y-2">
            <div className="grid grid-cols-12 gap-1 text-xs mb-2">
              <div className="col-span-2 font-bold">Perihal</div>
              <div className="col-span-10 font-bold text-slate-900">
                : Pengajuan Konsep Teknis Tata Ruang 3.000 Kursi, Visualisasi
                3D CAD & RAB HUT PGRI & HGN
              </div>
              <div className="col-span-2 font-bold">Lampiran</div>
              <div className="col-span-10">
                : 1 (Satu) Berkas Lengkap (7 Halaman Presisi)
              </div>
            </div>

            <p className="text-justify">
              Dengan hormat, sehubungan dengan pelaksanaan puncak acara{" "}
              <strong>
                Peringatan HUT PGRI Ke-79 dan Hari Guru Nasional (HGN) Tingkat
                Kabupaten OKU Timur
              </strong>{" "}
              yang bertempat di <strong>Lapangan SMAN 1 Belitang</strong> dengan
              estimasi kehadiran <strong>3.000 peserta guru</strong>, bersama
              ini kami sampaikan dokumen perencanaan teknis terpadu beserta
              Rencana Anggaran Biaya (RAB) sebesar{" "}
              <strong>{formatRupiah(grandTotal)}</strong> (
              <em>{terbilangText}</em>).
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-50 border-l-4 border-emerald-700 px-3 py-1.5 mb-2.5">
              I. Ringkasan Eksekutif & Parameter Kunci Lapangan
            </h3>
            <table className="w-full text-[11px] border-collapse border border-slate-300">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 w-1/3 border-r border-slate-300">
                    1. Kapasitas & Spesifikasi Kursi
                  </td>
                  <td className="p-2">
                    <strong>3.026 Unit Kursi Plastik Napolly BIG-208</strong>{" "}
                    (dimensi katalog 470 × 530 × 880 mm). Disusun 34 kursi per
                    baris (17 Barat + 17 Timur) × 89 baris memanjang dengan
                    jarak antar baris (<em>seat pitch</em>) 85 cm.
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">
                    2. Kebutuhan Bentang Lapangan
                  </td>
                  <td className="p-2">
                    Lebar tetap <strong>22,00 Meter</strong> × Panjang total{" "}
                    <strong>96,15 Meter (≈ 96 Meter)</strong> dari bibir
                    panggung utara hingga gerbang masuk selatan.
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">
                    3. Panggung Utama & Videotron
                  </td>
                  <td className="p-2">
                    Panggung Rigging Lengkung <strong>8 × 6 Meter</strong>{" "}
                    (elevasi lantai +1,20 M, tinggi atap puncak +7,30 M) +{" "}
                    <strong>Videotron LED P3 Outdoor 8 × 3 Meter</strong>.
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">
                    4. Orientasi VVIP & Paduan Suara
                  </td>
                  <td className="p-2">
                    <strong>Sofa VVIP Bupati & Forkopimda</strong> di baris
                    terdepan menghadap lurus ke Panggung Utama (Utara).{" "}
                    <strong>Sayap Kanan Paduan Suara (6×4 M)</strong> menghadap
                    lurus ke arah 3.000 peserta guru (Selatan).
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">
                    5. Standar Keselamatan K3 & Audio
                  </td>
                  <td className="p-2">
                    Dilengkapi Lorong Sentral Karpet Merah (lebar 2,0 M),{" "}
                    <strong>2 Lorong Silang Evakuasi K3</strong> (lebar 1,5 M di
                    baris 30 & 60), serta{" "}
                    <strong>2 Menara Delay Speaker</strong> di baris 30.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t-2 border-slate-300 pt-3 avoid-break">
          <div className="text-center text-[11px] font-bold uppercase text-slate-700 mb-3">
            LEMBAR PERSETUJUAN & PENGESAHAN KONSEP TATA RUANG ACARA
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/50">
              <div className="text-[10px] text-slate-500 font-semibold mb-12">
                Diajukan Oleh,
              </div>
              <div className="font-bold text-slate-900 underline">
                MANAJEMEN EVENT ORGANIZER
              </div>
              <div className="text-[10px] text-slate-500">
                Project & Technical Director
              </div>
            </div>
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/50">
              <div className="text-[10px] text-slate-500 font-semibold mb-12">
                Diperiksa & Disetujui Oleh,
              </div>
              <div className="font-bold text-slate-900 underline">
                KETUA PGRI KAB. OKU TIMUR
              </div>
              <div className="text-[10px] text-slate-500">
                Ketua Panitia Pelaksana
              </div>
            </div>
            <div className="border border-slate-300 rounded-lg p-3 bg-slate-50/50">
              <div className="text-[10px] text-slate-500 font-semibold mb-12">
                Mengetahui & Mengesahkan,
              </div>
              <div className="font-bold text-slate-900 underline">
                BUPATI OKU TIMUR
              </div>
              <div className="text-[10px] text-slate-500">
                Pemerintah Kab. OKU Timur
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-1.5 mt-4 flex justify-between items-center text-[9px] text-slate-500 font-medium">
            <div>
              Venue: Lapangan SMAN 1 Belitang • 3.000 Kursi Napolly BIG-208 •
              Tapak 22 × 96 M
            </div>
            <div className="font-bold text-slate-700">
              Halaman 2 • Surat Penawaran & Pengesahan EO
            </div>
          </div>
        </div>
      </div>

      {/* ================= HALAMAN 3: CETAK BIRU DENAH 2D SKEMATIK & PATOKAN METERAN (96,15 M) ================= */}
      <div className="print-page page-break flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-emerald-700 pb-2 mb-2 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                BAGIAN I
              </span>
              <h2 className="text-base font-black text-slate-900">
                CETAK BIRU DENAH 2D & PATOKAN METERAN LAPANGAN (96,15 M)
              </h2>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Skala 1:100 Metric CAD
            </span>
          </div>

          <div className="border border-slate-300 rounded-xl p-2 bg-slate-50 mb-2 flex flex-col items-center">
            <div className="w-full max-w-[340px] flex justify-center">
              <img
                src="/site_3d_overview.jpg"
                className="max-h-[58mm] w-auto rounded border border-slate-300 object-contain shadow-sm"
                alt="Denah Masterplan"
              />
            </div>
          </div>

          <div className="border border-slate-300 rounded-xl overflow-hidden bg-white">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex justify-between items-center">
              <span className="font-black text-slate-900 text-[10.5px] uppercase">
                📐 Rincian Pembagian Panjang Lapangan (Patokan Meteran Panitia):
              </span>
              <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Total Bentang: 96,15 Meter
              </span>
            </div>
            <table className="w-full text-left text-[9.5px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase">
                  <th className="p-1.5 text-center w-7 border-r border-slate-200">
                    No
                  </th>
                  <th className="p-1.5 border-r border-slate-200">
                    Zona / Segmen Lapangan
                  </th>
                  <th className="p-1.5 text-center w-16 border-r border-slate-200">
                    Panjang
                  </th>
                  <th className="p-1.5 text-center w-24 border-r border-slate-200">
                    Akumulasi Tarikan
                  </th>
                  <th className="p-1.5">
                    Keterangan Teknis & Standar Penataan Kursi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    1
                  </td>
                  <td className="p-1 font-bold border-r border-slate-200">
                    Panggung Utama (Rigging Truss)
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    6,00 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-50 border-r border-slate-200">
                    0,0 − 6,0 m
                  </td>
                  <td className="p-1">
                    Panggung 8×6 m, elevasi +1,2 m rangka aluminium box truss.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    2
                  </td>
                  <td className="p-1 border-r border-slate-200">
                    Buffer Depan Panggung ke VVIP
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    3,00 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-50 border-r border-slate-200">
                    6,0 − 9,0 m
                  </td>
                  <td className="p-1">
                    Jarak aman pandang VVIP & ruang gerak atraksi tari sambut.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    3
                  </td>
                  <td className="p-1 font-bold border-r border-slate-200">
                    Area Sofa VVIP Bupati & Forkopimda
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    3,50 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-100 border-r border-slate-200">
                    9,0 − 12,5 m
                  </td>
                  <td className="p-1">
                    Sofa mewah putih + meja konsol + sirkulasi VVIP.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    4
                  </td>
                  <td className="p-1 border-r border-slate-200">
                    Buffer VVIP ke Baris Pertama Guru
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    2,00 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-50 border-r border-slate-200">
                    12,5 − 14,5 m
                  </td>
                  <td className="p-1">
                    Jarak privasi & protokol pengamanan forkopimda.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    5
                  </td>
                  <td className="p-1 font-bold border-r border-slate-200">
                    Blok Kursi Guru 1 (Baris 1 s/d 30)
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    25,50 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-50 border-r border-slate-200">
                    14,5 − 40,0 m
                  </td>
                  <td className="p-1">
                    30 baris × 0,85 m: 1.020 kursi Napolly BIG-208.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    6
                  </td>
                  <td className="p-1 font-bold border-r border-slate-200">
                    Lorong Melintang 1 (Cross-Aisle K3)
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    1,50 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-rose-100 border-r border-slate-200">
                    40,0 − 41,5 m
                  </td>
                  <td className="p-1">
                    Wajib K3: Akses medis, toilet & posisi 2 Tower Delay Speaker.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    7
                  </td>
                  <td className="p-1 font-bold border-r border-slate-200">
                    Blok Kursi Guru 2 (Baris 31 s/d 60)
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    25,50 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-50 border-r border-slate-200">
                    41,5 − 67,0 m
                  </td>
                  <td className="p-1">
                    30 baris × 0,85 m: 1.020 kursi, audio dicover Tower Delay.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    8
                  </td>
                  <td className="p-1 font-bold border-r border-slate-200">
                    Lorong Melintang 2 (Cross-Aisle K3)
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    1,50 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-rose-100 border-r border-slate-200">
                    67,0 − 68,5 m
                  </td>
                  <td className="p-1">
                    Jalur silang sirkulasi penyeimbang audiens tengah.
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    9
                  </td>
                  <td className="p-1 font-bold border-r border-slate-200">
                    Blok Kursi Guru 3 (Baris 61 s/d 89)
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    24,65 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-50 border-r border-slate-200">
                    68,5 − 93,15 m
                  </td>
                  <td className="p-1">
                    29 baris × 0,85 m: 986 kursi (tribun Lapangan Atas).
                  </td>
                </tr>
                <tr>
                  <td className="p-1 text-center font-bold border-r border-slate-200">
                    10
                  </td>
                  <td className="p-1 border-r border-slate-200">
                    Jalur Masuk Utama / Gate Belakang
                  </td>
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200">
                    3,00 m
                  </td>
                  <td className="p-1 text-center font-mono font-bold bg-amber-50 border-r border-slate-200">
                    93,15 − 96,15 m
                  </td>
                  <td className="p-1">
                    Tempat registrasi, meja absensi & gerbang Tanjak.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-1.5 mt-2 flex justify-between items-center text-[9px] text-slate-500 font-medium">
          <div>
            Venue: Lapangan SMAN 1 Belitang • 3.000 Kursi Napolly BIG-208 •
            Tapak 22 × 96 M
          </div>
          <div className="font-bold text-slate-700">
            Halaman 3 • Cetak Biru Denah 2D & Patokan Meteran Panitia
          </div>
        </div>
      </div>

      {/* ================= HALAMAN 4: LAMPIRAN I - 4 RENDER ARSITEKTURAL 3D HD ================= */}
      <div className="print-page page-break flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-emerald-700 pb-2 mb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                LAMPIRAN I
              </span>
              <h2 className="text-base font-black text-slate-900">
                VISUALISASI RENDER 3D FOTOREALISTIK PANGGUNG & KAWASAN
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-slate-500">
              4 Sudut Pandang Utama
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 mb-1.5">
                1. Tampak Depan Panggung Utama (Atap Lengkung)
              </div>
              <img
                src="/stage_3d_front.jpg"
                className="w-full h-[62mm] object-cover rounded-lg border border-slate-200"
                alt="Tampak Depan Panggung"
              />
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 mb-1.5">
                2. Tampak Samping 3/4 (Elevasi Stage +1,2 M)
              </div>
              <img
                src="/stage_3d_side.jpg"
                className="w-full h-[62mm] object-cover rounded-lg border border-slate-200"
                alt="Tampak Samping 3/4"
              />
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 mb-1.5">
                3. Tampak Belakang (POV Tribun Lapangan Atas)
              </div>
              <img
                src="/stage_3d_rear.jpg"
                className="w-full h-[62mm] object-cover rounded-lg border border-slate-200"
                alt="Tampak Belakang POV Tribun"
              />
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 mb-1.5">
                4. Masterplan Aerial Drone View (Lapangan Utuh)
              </div>
              <img
                src="/site_3d_overview.jpg"
                className="w-full h-[62mm] object-cover rounded-lg border border-slate-200"
                alt="Masterplan Aerial Drone"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-1.5 mt-3 flex justify-between items-center text-[9px] text-slate-500 font-medium">
          <div>
            Venue: Lapangan SMAN 1 Belitang • 3.000 Kursi Napolly BIG-208 •
            Tapak 22 × 96 M
          </div>
          <div className="font-bold text-slate-700">
            Halaman 4 • Lampiran I: Visualisasi Render 3D Fotorealistik
          </div>
        </div>
      </div>

      {/* ================= HALAMAN 5: LAMPIRAN II-A - BUKTI POV 3D CAD ================= */}
      <div className="print-page page-break flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-emerald-700 pb-2 mb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                LAMPIRAN II-A
              </span>
              <h2 className="text-base font-black text-slate-900">
                BUKTI VERIFIKASI ORIENTASI POV 3D CAD (VVIP, PADUAN SUARA &
                BARIS 89)
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border border-slate-300 rounded-xl p-2.5 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 mb-1">
                👑 POV 1: Kursi Sofa VVIP Bupati & Forkopimda (Menghadap Lurus
                ke Panggung Utama)
              </div>
              <div className="w-full h-[54mm] bg-[#020617] rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                <img
                  id="print3d_vip"
                  className="w-full h-full object-contain"
                  alt="POV Sofa VVIP"
                />
              </div>
            </div>

            <div className="border border-slate-300 rounded-xl p-2.5 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 mb-1">
                🎵 POV 2: Sayap Paduan Suara PGRI (Menghadap Penuh ke 3.000
                Peserta Guru)
              </div>
              <div className="w-full h-[54mm] bg-[#020617] rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                <img
                  id="print3d_choir"
                  className="w-full h-full object-contain"
                  alt="POV Paduan Suara"
                />
              </div>
            </div>

            <div className="border border-slate-300 rounded-xl p-2.5 bg-slate-50">
              <div className="text-xs font-bold text-slate-900 mb-1">
                👥 POV 3: Baris Paling Belakang Ke-89 (Menatap ke Panggung
                Sejauh 85 Meter)
              </div>
              <div className="w-full h-[54mm] bg-[#020617] rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                <img
                  id="print3d_rear"
                  className="w-full h-full object-contain"
                  alt="POV Baris Belakang"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-1.5 mt-3 flex justify-between items-center text-[9px] text-slate-500 font-medium">
          <div>
            Venue: Lapangan SMAN 1 Belitang • 3.000 Kursi Napolly BIG-208 •
            Tapak 22 × 96 M
          </div>
          <div className="font-bold text-slate-700">
            Halaman 5 • Lampiran II-A: Bukti Verifikasi Orientasi POV 3D CAD
          </div>
        </div>
      </div>

      {/* ================= HALAMAN 6: LAMPIRAN II-B - CETAK BIRU REKAYASA CAD & K3 ================= */}
      <div className="print-page page-break flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-emerald-700 pb-2 mb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                LAMPIRAN II-B
              </span>
              <h2 className="text-base font-black text-slate-900">
                CETAK BIRU REKAYASA 3D CAD BLUEPRINT & KESELAMATAN K3
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50">
              <div className="text-[11px] font-bold text-slate-900 mb-1">
                📐 POV 4: Isometrik CAD 3D (22 × 96 M)
              </div>
              <div className="w-full h-[46mm] bg-[#020617] rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  id="print3d_iso"
                  className="w-full h-full object-contain"
                  alt="Isometrik CAD 3D"
                />
              </div>
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50">
              <div className="text-[11px] font-bold text-slate-900 mb-1">
                🎯 POV 5: Tampak Depan Elevasi (8 × 6 M)
              </div>
              <div className="w-full h-[46mm] bg-[#020617] rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  id="print3d_front"
                  className="w-full h-full object-contain"
                  alt="Tampak Depan Elevasi"
                />
              </div>
            </div>
            <div className="border border-slate-300 rounded-xl p-2 bg-slate-50">
              <div className="text-[11px] font-bold text-slate-900 mb-1">
                📐 POV 6: Samping Potongan (Bentang 96 M)
              </div>
              <div className="w-full h-[46mm] bg-[#020617] rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  id="print3d_side"
                  className="w-full h-full object-contain"
                  alt="Tampak Samping Potongan"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-1.5 mt-3 flex justify-between items-center text-[9px] text-slate-500 font-medium">
          <div>
            Venue: Lapangan SMAN 1 Belitang • 3.000 Kursi Napolly BIG-208 •
            Tapak 22 × 96 M
          </div>
          <div className="font-bold text-slate-700">
            Halaman 6 • Lampiran II-B: Cetak Biru Rekayasa 3D CAD & Protokol K3
          </div>
        </div>
      </div>

      {/* ================= HALAMAN 7: LAMPIRAN III - RENCANA ANGGARAN BIAYA (RAB) RESMI ================= */}
      <div className="print-page flex flex-col justify-between">
        <div>
          <div className="border-b-2 border-emerald-700 pb-2 mb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                LAMPIRAN III
              </span>
              <h2 className="text-base font-black text-slate-900">
                RENCANA ANGGARAN BIAYA (RAB) RESMI PELAKSANAAN
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 block">
                HUT PGRI & HARI GURU NASIONAL
              </span>
              <span className="text-[10px] text-slate-500">
                Venue: Lapangan SMAN 1 Belitang • 3.000 Guru
              </span>
            </div>
          </div>

          <table className="w-full text-xs border-collapse border border-slate-300 mb-2">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-left">
                <th className="p-1.5 border-r border-slate-300 text-center w-8">
                  No
                </th>
                <th className="p-1.5 border-r border-slate-300">
                  Nama Item
                </th>
                <th className="p-1.5 border-r border-slate-300 text-right w-28">
                  Harga
                </th>
                <th className="p-1.5 border-r border-slate-300 text-center w-16">
                  Jumlah
                </th>
                <th className="p-1.5 border-r border-slate-300 text-center w-16">
                  Satuan
                </th>
                <th className="p-1.5 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px] text-slate-800">
              {rabItems.map((item, idx) => {
                const sub = (item.qty || 0) * (item.price || 0);
                return (
                  <tr
                    key={item.id}
                    className={idx % 2 === 1 ? "bg-slate-50/60" : ""}
                  >
                    <td className="p-1.5 border-r border-slate-300 text-center font-bold text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 text-right font-medium text-slate-800">
                      {item.price > 0
                        ? "Rp " + item.price.toLocaleString("id-ID")
                        : "Rp -"}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 text-center font-bold text-slate-800">
                      {item.qty.toLocaleString("id-ID")}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 text-center text-slate-600">
                      {item.unit}
                    </td>
                    <td className="p-1.5 text-right font-bold text-slate-900">
                      {sub > 0 ? "Rp " + sub.toLocaleString("id-ID") : "Rp -"}
                    </td>
                  </tr>
                );
              })}
              {rabDiscount > 0 && (
                <>
                  <tr className="bg-slate-100/80 border-t border-slate-300">
                    <td
                      colSpan={5}
                      className="p-2 border-r border-slate-300 text-right font-bold text-slate-700"
                    >
                      Subtotal Rincian Item:
                    </td>
                    <td className="p-2 text-right font-bold text-slate-800">
                      {formatRupiah(rawSubtotal)}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/60">
                    <td
                      colSpan={5}
                      className="p-2 border-r border-slate-300 text-right font-bold text-emerald-800"
                    >
                      Potongan / Pembulatan Paket EO:
                    </td>
                    <td className="p-2 text-right font-bold text-emerald-800">
                      - {formatRupiah(rabDiscount)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-xs">
                <td
                  colSpan={5}
                  className="p-2.5 text-right uppercase text-slate-800 font-extrabold tracking-wide"
                >
                  Grand Total Estimasi Biaya (RAB):
                </td>
                <td className="p-2.5 text-right font-black text-emerald-900 text-sm">
                  {formatRupiah(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 mb-3 text-xs">
            <span className="font-bold text-slate-700 block text-[10px] uppercase">
              Terbilang:
            </span>
            <span className="font-black text-slate-900 text-xs italic block mt-0.5">
              &ldquo;{terbilangText}&rdquo;
            </span>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-3 avoid-break">
          <div className="grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[10px] mb-12">
                Dibuat & Diajukan Oleh:
              </div>
              <div className="font-bold text-slate-900 border-t border-slate-400 pt-1">
                TIM EVENT ORGANIZER
              </div>
              <div className="text-[10px] text-slate-500">
                Finance & Project Coordinator
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] mb-12">
                Disetujui Oleh:
              </div>
              <div className="font-bold text-slate-900 border-t border-slate-400 pt-1">
                KETUA PGRI KAB. OKU TIMUR
              </div>
              <div className="text-[10px] text-slate-500">
                Ketua Panitia Pelaksana HUT PGRI
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-1.5 mt-3 flex justify-between items-center text-[9px] text-slate-500 font-medium">
            <div>
              Venue: Lapangan SMAN 1 Belitang • 3.000 Kursi Napolly BIG-208 •
              Tapak 22 × 96 M
            </div>
            <div className="font-bold text-slate-700">
              Halaman 7 • Lampiran III: Rencana Anggaran Biaya (RAB) Resmi
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
