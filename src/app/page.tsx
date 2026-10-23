"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Map,
  Box,
  Wallet,
  Ruler,
  Printer,
  Download,
  FileCode,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Layers,
  Award,
  FileSpreadsheet,
  ArrowUpRight,
} from "lucide-react";
import PrintProposalBooklet, { RabItem } from "@/components/PrintProposalBooklet";
import type { CadSimulator3DRef } from "@/components/CadSimulator3D";

const CadSimulator3D = dynamic(() => import("@/components/CadSimulator3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex flex-col items-center justify-center gap-3 text-cyan-400">
      <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold tracking-wider uppercase">
        Memuat Engine 3D CAD WebGL (3.026 Kursi)...
      </span>
    </div>
  ),
});

const DEFAULT_RAB_LIST: RabItem[] = [
  { id: "rab-1", name: "Tenda", price: 450000, qty: 70, unit: "plong" },
  { id: "rab-2", name: "Panggung Utama 6x8", price: 3500000, qty: 1, unit: "paket" },
  { id: "rab-3", name: "Panggung kreasi dan seni ukuran 4x6", price: 2500000, qty: 2, unit: "set" },
  { id: "rab-4", name: "Kursi sarung", price: 4000, qty: 3000, unit: "buah" },
  { id: "rab-5", name: "Taman", price: 3000000, qty: 1, unit: "set" },
  { id: "rab-6", name: "Hambal", price: 1500000, qty: 1, unit: "set" },
  { id: "rab-7", name: "Videotron 3x5m", price: 1000000, qty: 15, unit: "meter" },
  { id: "rab-8", name: "paket lighting dan equipment", price: 6000000, qty: 1, unit: "paket" },
  { id: "rab-9", name: "Sound", price: 5500000, qty: 1, unit: "set" },
  { id: "rab-10", name: "Meja Makan VIP", price: 250000, qty: 8, unit: "set" },
  { id: "rab-11", name: "Blower Kipas", price: 350000, qty: 10, unit: "buah" },
  { id: "rab-12", name: "Disel Kipas + Roll", price: 1000000, qty: 1, unit: "paket" },
  { id: "rab-13", name: "Dokumentasi", price: 5000000, qty: 1, unit: "paket" },
  { id: "rab-14", name: "Band", price: 5000000, qty: 1, unit: "paket" },
];

const OPTIONAL_EO_ITEMS: Omit<RabItem, "id">[] = [
  { name: "Kursi Sofa VVIP & Meja Kaca", qty: 5, unit: "set", price: 0 },
  { name: "Konsumsi Tamu & Peserta", qty: 1, unit: "paket", price: 0 },
];

const METERAN_SEGMENTS = [
  {
    no: 1,
    zone: "Panggung Utama (Rigging Truss)",
    length: "6,00 m",
    accum: "0,0 − 6,0 m",
    desc: "Panggung ukuran 8 × 6 M, elevasi tinggi +1,2 M rangka aluminium box truss.",
    type: "stage",
  },
  {
    no: 2,
    zone: "Buffer Depan Panggung ke VVIP",
    length: "3,00 m",
    accum: "6,0 − 9,0 m",
    desc: "Jarak aman pandang VVIP & ruang gerak atraksi Tari Sambut Sekapur Sirih.",
    type: "buffer",
  },
  {
    no: 3,
    zone: "Area Sofa VVIP Bupati & Forkopimda",
    length: "3,50 m",
    accum: "9,0 − 12,5 m",
    desc: "Sofa kulit putih mewah + meja konsol kaca + jalur sirkulasi protokol pengawalan.",
    type: "vvip",
  },
  {
    no: 4,
    zone: "Buffer VVIP ke Baris Pertama Guru",
    length: "2,00 m",
    accum: "12,5 − 14,5 m",
    desc: "Jarak privasi VVIP, batas barikade steril, dan jalur protokol ajudan.",
    type: "buffer",
  },
  {
    no: 5,
    zone: "Blok Kursi Guru 1 (Baris 1 s/d 30)",
    length: "25,50 m",
    accum: "14,5 − 40,0 m",
    desc: "30 Baris × 0,85 m (Pitch Kursi Nyaman): Kapasitas 1.020 kursi guru (Napolly BIG-208).",
    type: "chairs",
  },
  {
    no: 6,
    zone: "Lorong Melintang 1 (Cross-Aisle K3)",
    length: "1,50 m",
    accum: "40,0 − 41,5 m",
    desc: "Wajib Standar K3: Akses darurat medis, toilet, dan posisi 2 Tower Delay Speaker.",
    type: "k3",
  },
  {
    no: 7,
    zone: "Blok Kursi Guru 2 (Baris 31 s/d 60)",
    length: "25,50 m",
    accum: "41,5 − 67,0 m",
    desc: "30 Baris × 0,85 m: Kapasitas 1.020 kursi guru, audio di-cover penuh oleh Delay Speaker Tower.",
    type: "chairs",
  },
  {
    no: 8,
    zone: "Lorong Melintang 2 (Cross-Aisle K3)",
    length: "1,50 m",
    accum: "67,0 − 68,5 m",
    desc: "Sirkulasi Penyeimbang: Jalur sirkulasi silang audiens tengah untuk mengurai penumpukan massa.",
    type: "k3",
  },
  {
    no: 9,
    zone: "Blok Kursi Guru 3 (Baris 61 s/d 89)",
    length: "24,65 m",
    accum: "68,5 − 93,15 m",
    desc: "29 Baris × 0,85 m: Kapasitas 986 kursi guru (berada di elevasi Lapangan Atas berundak alami).",
    type: "chairs",
  },
  {
    no: 10,
    zone: "Jalur Masuk Utama / Gate Belakang",
    length: "3,00 m",
    accum: "93,15 − 96,15 m",
    desc: "Pintu gerbang budaya Tanjak SMAN 1 Belitang, meja registrasi tamu, absensi, dan holding zone.",
    type: "gate",
  },
];

const STUDIO_RENDERS = {
  front: {
    img: "/stage_3d_front.jpg",
    title: "Tampak Depan Panggung Utama (Atap Tenda Lengkung & VVIP Baris Depan)",
    desc: "Panggung 8×6 M atap lengkung navy-gold dengan rangka aluminium box truss, Videotron LED 8×3 M, sofa VVIP putih mewah di baris terdepan menghadap panggung, dan ribuan guru berseragam Batik PGRI.",
    badge: "1. Tampak Depan Panggung",
    cadAngle: "front",
  },
  side: {
    img: "/stage_3d_side.jpg",
    title: "Tampak Samping 3/4 (Profil Elevasi Stage 1,2 M & Rigging Truss Lengkung)",
    desc: "Memperlihatkan kelengkungan atap kanopi, elevasi stage 1,2 M pandangan bebas, serta Control Room steril di samping kiri panggung dan Paduan Suara di kanan.",
    badge: "2. Tampak Samping (Side Profile)",
    cadAngle: "sideLeft",
  },
  rear: {
    img: "/stage_3d_rear.jpg",
    title: "Tampak Belakang (POV Lapangan Atas / Tribun Guru SMAN 1 Belitang)",
    desc: "Sudut pandang 1.200 guru dari tribun Lapangan Atas yang menatap lurus ke videotron dan panggung utama melewati karpet merah sentral dan 1.800 audiens lapangan bawah tanpa halangan.",
    badge: "3. Tampak Belakang (POV Tribun)",
    cadAngle: "rear",
  },
  full: {
    img: "/site_3d_overview.jpg",
    title: "Masterplan Full 1 Lapangan 22 × 96 M (Aerial Drone CAD View)",
    desc: "Tinjauan tata ruang lengkap Lapangan SMAN 1 Belitang: Panggung utama di ujung utara, karpet merah sentral, barisan 3.000 kursi simetris, Tanjak budaya, dan gerbang utama.",
    badge: "4. Masterplan Aerial Drone",
    cadAngle: "aerial",
  },
};

function formatRupiah(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "Rp 0";
  return "Rp " + Math.floor(num).toLocaleString("id-ID");
}

function terbilangRupiah(angka: number): string {
  if (isNaN(angka) || angka <= 0) return "Nol Rupiah";
  const nVal = Math.floor(Math.abs(angka));
  if (nVal === 0) return "Nol Rupiah";

  const bilangan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  function sebut(n: number): string {
    if (n < 12) return bilangan[n];
    if (n < 20) return sebut(n - 10) + " Belas";
    if (n < 100)
      return (
        sebut(Math.floor(n / 10)) +
        " Puluh" +
        (n % 10 !== 0 ? " " + sebut(n % 10) : "")
      );
    if (n < 200) return "Seratus" + (n - 100 !== 0 ? " " + sebut(n - 100) : "");
    if (n < 1000)
      return (
        sebut(Math.floor(n / 100)) +
        " Ratus" +
        (n % 100 !== 0 ? " " + sebut(n % 100) : "")
      );
    if (n < 2000)
      return "Seribu" + (n - 1000 !== 0 ? " " + sebut(n - 1000) : "");
    if (n < 1000000)
      return (
        sebut(Math.floor(n / 1000)) +
        " Ribu" +
        (n % 1000 !== 0 ? " " + sebut(n % 1000) : "")
      );
    if (n < 1000000000)
      return (
        sebut(Math.floor(n / 1000000)) +
        " Juta" +
        (n % 1000000 !== 0 ? " " + sebut(n % 1000000) : "")
      );
    if (n < 1000000000000)
      return (
        sebut(Math.floor(n / 1000000000)) +
        " Miliar" +
        (n % 1000000000 !== 0 ? " " + sebut(n % 1000000000) : "")
      );
    return "";
  }

  return sebut(nVal).trim() + " Rupiah";
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"denah" | "render" | "rab">("denah");
  const [rabItems, setRabItems] = useState<RabItem[]>(DEFAULT_RAB_LIST);
  const [rabDiscount, setRabDiscount] = useState<number>(0);
  const [studioKey, setStudioKey] = useState<"front" | "side" | "rear" | "full">("front");
  const [external3DAngle, setExternal3DAngle] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(1.25);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [showProcessionRoute, setShowProcessionRoute] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [gitSyncStatus, setGitSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [lastGitSyncTime, setLastGitSyncTime] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgViewportRef = useRef<HTMLDivElement | null>(null);
  const panOriginRef = useRef<{ startX: number; startY: number; scrollLeft: number; scrollTop: number } | null>(null);
  const meteranRef = useRef<HTMLDivElement | null>(null);
  const cad3DRef = useRef<CadSimulator3DRef | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved RAB from server (rab-config.json) or localStorage (v3 = 14 items Rp 99.500.000)
  useEffect(() => {
    fetch("/api/sync-git")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.rabItems) && data.rabItems.length > 0) {
          setRabItems(data.rabItems);
          setRabDiscount(typeof data.rabDiscount === "number" ? data.rabDiscount : 0);
          localStorage.setItem("rab_data_hut_pgri_v3", JSON.stringify(data.rabItems));
          localStorage.setItem("rab_discount_hut_pgri_v3", String(data.rabDiscount ?? 0));
          return;
        }
      })
      .catch(() => {
        try {
          const savedItems = localStorage.getItem("rab_data_hut_pgri_v3");
          const savedDiscount = localStorage.getItem("rab_discount_hut_pgri_v3");
          if (savedItems) {
            setRabItems(JSON.parse(savedItems));
          }
          if (savedDiscount !== null) {
            setRabDiscount(parseInt(savedDiscount, 10) || 0);
          }
        } catch (err) {
          console.warn("Error loading RAB from localStorage:", err);
        }
      });
  }, []);

  const triggerGitSync = async (items: RabItem[], discount: number, manual = false) => {
    setGitSyncStatus("syncing");
    if (manual) {
      showToast("☁️ Menyimpan & melakukan Auto-Push ke GitHub...");
    }
    try {
      const res = await fetch("/api/sync-git", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rabItems: items,
          rabDiscount: discount,
          commitMessage: `Update RAB & Desain via Portal Next.js (${new Date().toLocaleString("id-ID")})`,
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        setGitSyncStatus("synced");
        const nowStr = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setLastGitSyncTime(nowStr);
        if (manual || data.pushed) {
          showToast("✅ Auto-Push GitHub Berhasil! Repository terupdate.");
        }
      } else {
        setGitSyncStatus("error");
      }
    } catch (err) {
      console.warn("Auto-push git error:", err);
      setGitSyncStatus("error");
    }
  };

  const persistRab = (items: RabItem[], discount: number) => {
    setRabItems(items);
    setRabDiscount(discount);
    try {
      localStorage.setItem("rab_data_hut_pgri_v3", JSON.stringify(items));
      localStorage.setItem("rab_discount_hut_pgri_v3", String(discount));
    } catch (err) {
      console.warn("Error saving RAB:", err);
    }

    // Debounced auto-push to GitHub (2 seconds after user finishes typing/editing)
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    setGitSyncStatus("syncing");
    syncTimeoutRef.current = setTimeout(() => {
      triggerGitSync(items, discount, false);
    }, 2000);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const rawSubtotal = rabItems.reduce(
    (acc, it) => acc + (it.qty || 0) * (it.price || 0),
    0
  );
  const grandTotal = Math.max(0, rawSubtotal - (rabDiscount || 0));
  const terbilangText = terbilangRupiah(grandTotal);

  const handlePrintProposal = () => {
    showToast("🖨️ Menyiapkan dokumen proposal EO 7 halaman & capture 3D...");
    if (cad3DRef.current) {
      cad3DRef.current.captureAllPovsForPrint();
    }
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const scrollToMeteranSection = () => {
    setActiveTab("denah");
    setTimeout(() => {
      meteranRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Download 2D SVG Vector
  const downloadDenahSvg = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    showToast("⏳ Menyiapkan file vektor SVG...");
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgEl);
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    svgString = svgString.replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, "&amp;");
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Denah_2D_Vektor_HUT_PGRI_OKU_Timur.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("✅ File Vektor SVG berhasil diunduh!");
  };

  // Download 2D HD PNG (Poster or CAD-only)
  const downloadDenahImage = (mode: "poster" | "cad-only" = "poster") => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    showToast("⏳ Sedang memproses gambar Ultra-HD Denah 2D...");

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgEl);
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    svgString = svgString.replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, "&amp;");
    svgString = svgString
      .replace(/width="[^"]*"/, "")
      .replace(/height="[^"]*"/, "")
      .replace("<svg", '<svg width="440" height="1020"');

    const svgDataUri =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      if (mode === "poster") {
        const canvasWidth = 1800;
        const mapWidth = 1600;
        const mapHeight = Math.round(mapWidth * (1020 / 440));
        const headerHeight = 280;
        const legendHeight = 440;
        const paddingX = (canvasWidth - mapWidth) / 2;
        const canvasHeight = headerHeight + mapHeight + legendHeight + 60;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.fillStyle = "#080c15";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

        ctx.strokeStyle = "#059669";
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(24, 24, canvasWidth - 48, headerHeight - 24);

        ctx.fillStyle = "#064e3b";
        ctx.fillRect(50, 45, 520, 40);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(50, 45, 520, 40);

        ctx.font = "bold 18px sans-serif";
        ctx.fillStyle = "#6ee7b7";
        ctx.fillText("📐 CETAK BIRU REKAYASA TATA LETAK RESMI", 70, 71);

        ctx.fillStyle = "#94a3b8";
        ctx.textAlign = "right";
        ctx.fillText("SKALA 1:100 METRIC CAD • STANDAR K3", canvasWidth - 50, 71);
        ctx.textAlign = "left";

        ctx.font = "900 40px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("DENAH TATA LETAK LAPANGAN (22 × 96 METER)", 50, 140);

        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(
          "Peringatan Semarak HUT PGRI Ke-79 & Hari Guru Nasional (HGN) Kab. OKU Timur",
          50,
          185
        );

        ctx.font = "500 20px sans-serif";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText(
          `📍 Lokasi: Lapangan SMAN 1 Belitang   |   👥 Kapasitas: 3.000 Kursi Guru   |   💰 Total RAB: ${formatRupiah(
            grandTotal
          )}`,
          50,
          230
        );

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(24, headerHeight);
        ctx.lineTo(canvasWidth - 24, headerHeight);
        ctx.stroke();

        ctx.drawImage(img, paddingX, headerHeight + 20, mapWidth, mapHeight);

        const footerY = headerHeight + 20 + mapHeight + 10;
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(24, footerY + 2, canvasWidth - 48, canvasHeight - footerY - 26);

        ctx.font = "bold 22px sans-serif";
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("KETERANGAN SIMBOL & LEGENDA WARNA TATA RUANG:", 50, footerY + 45);

        const legends = [
          { color: "#10b981", label: "Panggung Utama 8 × 6 M (Elevasi +1,2 M)" },
          { color: "#38bdf8", label: "Videotron LED 8 × 3 M (Backdrop HD)" },
          { color: "#ef4444", label: "Lorong Karpet Merah Utama (Lebar 2,5 M)" },
          { color: "#f59e0b", label: "Area Karpet & Sofa VVIP Bupati" },
          { color: "#6366f1", label: "Control Room Mixer & MC (5 × 4 M)" },
          { color: "#22c55e", label: "Panggung Paduan Suara (6 × 4 M Trap 3)" },
          { color: "#b45309", label: "Tanjak Adat & Gerbang Utama SMAN 1" },
          { color: "#0ea5e9", label: "Tribun Lapangan Atas (1.200 Kursi Guru)" },
        ];

        const colWidth = (canvasWidth - 100) / 2;
        legends.forEach((leg, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 50 + col * colWidth;
          const y = footerY + 85 + row * 42;

          ctx.fillStyle = leg.color;
          ctx.fillRect(x, y - 18, 26, 26);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y - 18, 26, 26);

          ctx.font = "bold 18px sans-serif";
          ctx.fillStyle = "#e2e8f0";
          ctx.fillText(leg.label, x + 40, y + 2);
        });
      } else {
        const scale = 4;
        canvas.width = 440 * scale;
        canvas.height = 1020 * scale;
        ctx.fillStyle = "#0b1120";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const filename =
        mode === "poster"
          ? "Denah_2D_Lengkap_HUT_PGRI_OKU_Timur.png"
          : "Denah_2D_CAD_HUT_PGRI_OKU_Timur.png";

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("✅ Gambar Denah 2D HD berhasil diunduh!");
    };
    img.src = svgDataUri;
  };

  // RAB Handlers
  const updateItemField = (
    id: string,
    field: keyof RabItem,
    value: string | number
  ) => {
    const updated = rabItems.map((it) =>
      it.id === id ? { ...it, [field]: value } : it
    );
    persistRab(updated, rabDiscount);
  };

  const handleSubtotalDirectChange = (id: string, rawVal: string) => {
    const clean = rawVal.replace(/[^0-9]/g, "");
    const targetSubtotal = clean ? parseInt(clean, 10) : 0;
    const updated = rabItems.map((it) => {
      if (it.id !== id) return it;
      const qty = it.qty > 0 ? it.qty : 1;
      const newUnitPrice = Math.round(targetSubtotal / qty);
      return { ...it, price: newUnitPrice };
    });
    persistRab(updated, rabDiscount);
  };

  const addNewRabItem = () => {
    const newItem: RabItem = {
      id: "rab-" + Date.now(),
      name: "Item Kebutuhan Baru",
      qty: 1,
      unit: "paket",
      price: 0,
    };
    persistRab([...rabItems, newItem], rabDiscount);
    showToast("✅ Baris item baru ditambahkan");
  };

  const loadOptionalEoItems = () => {
    const existingNames = new Set(rabItems.map((i) => i.name.toLowerCase()));
    const toAdd: RabItem[] = OPTIONAL_EO_ITEMS.filter(
      (o) => !existingNames.has(o.name.toLowerCase())
    ).map((o, idx) => ({
      ...o,
      id: `rab-opt-${Date.now()}-${idx}`,
    }));
    if (toAdd.length === 0) {
      showToast("ℹ️ Semua item tambahan EO sudah ada di dalam tabel.");
      return;
    }
    persistRab([...rabItems, ...toAdd], rabDiscount);
    showToast(`✅ ${toAdd.length} item opsional EO ditambahkan!`);
  };

  const deleteRabItem = (id: string) => {
    const updated = rabItems.filter((it) => it.id !== id);
    persistRab(updated, rabDiscount);
    showToast("🗑️ Item dihapus dari RAB");
  };

  const resetRabToDefault = () => {
    persistRab(DEFAULT_RAB_LIST, 0);
    showToast("🔄 RAB dikembalikan ke 14 item utama (Total Rp 99.500.000)");
  };

  const exportRabToCsv = () => {
    const headers = ["No,Nama Item,Harga (Rp),Jumlah,Satuan,Total (Rp)"];
    const rows = rabItems.map((it, idx) => {
      const sub = (it.qty || 0) * (it.price || 0);
      return `${idx + 1},"${it.name}",${it.price},${it.qty},"${it.unit}",${sub}`;
    });
    if (rabDiscount > 0) {
      rows.push(`,"Subtotal Rincian Item",,,,${rawSubtotal}`);
      rows.push(`,"Potongan / Pembulatan Paket",,,, -${rabDiscount}`);
    }
    rows.push(`,"Total",,,,${grandTotal}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = "RAB_HUT_PGRI_HGN_OKU_Timur.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("📊 File Excel/CSV RAB berhasil diunduh!");
  };

  const currentRender = STUDIO_RENDERS[studioKey];

  return (
    <>
      {/* ================= FLOATING TOAST NOTIFICATION ================= */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 text-white text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2.5 no-print">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMsg}</span>
        </div>
      )}

      {/* ================= STICKY GLASSMORPHIC TOP NAVBAR ================= */}
      <div className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-xl border-b border-slate-800/80 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs md:text-sm font-black tracking-wide uppercase text-white leading-snug">
              PORTAL PERENCANAAN EKSEKUTIF • HUT PGRI KE-79 & HGN
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
              Kabupaten OKU Timur • Venue: Lapangan SMAN 1 Belitang (22 × 96,15 M)
            </p>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={scrollToMeteranSection}
              className="px-2.5 sm:px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Meteran 96M</span>
            </button>

            <button
              onClick={() => downloadDenahImage("poster")}
              className="px-2.5 sm:px-3.5 py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Unduh 2D</span>
            </button>

            <button
              onClick={handlePrintProposal}
              className="px-2.5 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40 transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Cetak PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN WEB CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 no-print">
        {/* HERO BANNER & EXECUTIVE KPI BENTO GRID */}
        <header className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-[#091326] to-emerald-950/40 border border-slate-800/90 p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-slate-800/80">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Masterplan Resmi • PGRI & HGN Kab. OKU Timur</span>
              </div>
              <h1 className="text-lg sm:text-2xl md:text-4xl font-black tracking-tight text-white leading-snug sm:leading-tight">
                Arsitektur Tata Ruang 2D/3D CAD & Rencana Anggaran Biaya (RAB)
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Sistem komando visual dan kalkulasi anggaran presisi untuk{" "}
                <strong className="text-white">3.000 Peserta Guru</strong> di{" "}
                <strong className="text-emerald-400">Lapangan SMAN 1 Belitang</strong>.
                Terintegrasi dengan simulasi 3D nyata, panduan tarikan roll meteran panitia, dan dokumen proposal siap cetak.
              </p>
            </div>

            {/* Quick Action Pill to Open RAB Tab (WITHOUT exposing RAB numbers outside Tab 3) */}
            <div
              onClick={() => setActiveTab("rab")}
              className="bg-slate-950/90 hover:bg-slate-950 border border-emerald-500/40 rounded-2xl p-3.5 sm:p-4 w-full lg:w-auto lg:min-w-[240px] shadow-xl cursor-pointer transition group flex lg:block items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <span>Dokumen & Kalkulasi EO</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-white mt-0.5">
                  Buka Rincian RAB →
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400">
                  Klik untuk melihat & edit anggaran
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-400 lg:hidden shrink-0" />
            </div>
          </div>

          {/* 4 KPI Cards (Purely Technical Venue Metrics - Proportional on Mobile) */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mt-4 sm:mt-6">
            <div className="bg-slate-950/70 backdrop-blur border border-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">
                Total Kapasitas Kursi
              </span>
              <span className="text-base sm:text-xl md:text-2xl font-black text-amber-400 mt-0.5 block">
                3.000+ Guru
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">
                Napolly BIG-208 + Sarung
              </span>
            </div>

            <div className="bg-slate-950/70 backdrop-blur border border-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">
                Tenda & Panggung
              </span>
              <span className="text-base sm:text-xl md:text-2xl font-black text-emerald-400 mt-0.5 block">
                70 Plong & 6×8 M
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">
                + 2 Set Panggung 4×6 M
              </span>
            </div>

            <div className="bg-slate-950/70 backdrop-blur border border-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">
                Bentang Lapangan
              </span>
              <span className="text-base sm:text-xl md:text-2xl font-black text-cyan-400 mt-0.5 block">
                22 × 96,15 M
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">
                89 Baris × 34 Kursi
              </span>
            </div>

            <div className="bg-slate-950/70 backdrop-blur border border-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">
                Multimedia & Tata Ruang
              </span>
              <span className="text-base sm:text-xl md:text-2xl font-black text-indigo-400 mt-0.5 block">
                Videotron 3×5 M
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 block truncate">
                Taman, Sound & Lighting
              </span>
            </div>
          </div>

          {/* Primary Navigation Tabs (Stacked Full-Width on Mobile, Inline on Desktop) */}
          <div className="relative z-10 grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 mt-4 sm:mt-6">
            <button
              onClick={() => setActiveTab("denah")}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center sm:justify-start gap-2 cursor-pointer ${
                activeTab === "denah"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/50"
                  : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <Map className="w-4 h-4 shrink-0" />
              <span>1. Denah 2D Skematik & Meteran (96,15 M)</span>
            </button>

            <button
              onClick={() => setActiveTab("render")}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center sm:justify-start gap-2 cursor-pointer ${
                activeTab === "render"
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/60 border border-cyan-400/50"
                  : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <Box className="w-4 h-4 shrink-0" />
              <span>2. Studio Visual 3D & Simulator CAD 360°</span>
            </button>

            <button
              onClick={() => setActiveTab("rab")}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center sm:justify-start gap-2 cursor-pointer ${
                activeTab === "rab"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-950/60 border border-amber-400/50"
                  : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              <Wallet className="w-4 h-4 shrink-0" />
              <span>3. Rencana Anggaran Biaya (RAB)</span>
            </button>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* TAB 1: DENAH 2D SKEMATIK & PATOKAN METERAN LAPANGAN                   */}
        {/* ===================================================================== */}
        {activeTab === "denah" && (
          <div className="space-y-4 sm:space-y-6">
            {/* FULL-WIDTH INTERACTIVE 2D CAD MAP WITH LARGE ZOOM IN/OUT */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl flex flex-col">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-sm sm:text-lg md:text-xl font-black text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>Cetak Biru Denah 2D Lapangan SMAN 1 Belitang</span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                    Tekan <strong>➕ Zoom In / ➖ Zoom Out</strong> untuk memperbesar tulisan hingga <strong>300%</strong>, lalu geser peta ke kiri/kanan/atas/bawah.
                  </p>
                </div>

                {/* Interactive Zoom Controls & Download Buttons (Proportional on Mobile) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
                  {/* Main Zoom Bar */}
                  <div className="flex items-center justify-between bg-slate-950 border-2 border-emerald-500/40 rounded-xl p-1 shadow-lg">
                    <button
                      onClick={() => setMapZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                      title="Perkecil Denah (Zoom Out)"
                    >
                      <ZoomOut className="w-4 h-4 text-amber-400" />
                      <span>Zoom Out (-)</span>
                    </button>

                    <span className="px-2.5 text-xs font-mono font-black text-emerald-400 min-w-[56px] text-center">
                      {Math.round(mapZoom * 100)}%
                    </span>

                    <button
                      onClick={() => setMapZoom((z) => Math.min(3.0, +(z + 0.25).toFixed(2)))}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                      title="Perbesar Denah (Zoom In)"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Zoom In (+)</span>
                    </button>
                  </div>

                  {/* Quick Zoom Presets */}
                  <div className="grid grid-cols-5 sm:flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
                    {[
                      [0.55, "Pas HP"],
                      [1.0, "100%"],
                      [1.25, "125%"],
                      [1.75, "175%"],
                      [2.5, "250%"],
                    ].map(([val, label]) => (
                      <button
                        key={String(label)}
                        onClick={() => setMapZoom(Number(val))}
                        className={`px-2 py-1.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer text-center ${
                          Math.abs(mapZoom - Number(val)) < 0.08
                            ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-3 sm:flex items-center gap-1.5">
                    <button
                      onClick={() => setShowProcessionRoute((v) => !v)}
                      className={`px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                        showProcessionRoute
                          ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Rute VVIP</span>
                    </button>

                    <button
                      onClick={() => downloadDenahImage("poster")}
                      className="px-2.5 sm:px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-lg border border-emerald-400/40 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">PNG HD</span>
                    </button>

                    <button
                      onClick={downloadDenahSvg}
                      className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>SVG</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SVG Viewport with True Vector Scaling & Touch/Mouse Panning */}
              <div
                ref={svgViewportRef}
                onMouseDown={(e) => {
                  if (!svgViewportRef.current) return;
                  setIsPanning(true);
                  panOriginRef.current = {
                    startX: e.clientX,
                    startY: e.clientY,
                    scrollLeft: svgViewportRef.current.scrollLeft,
                    scrollTop: svgViewportRef.current.scrollTop,
                  };
                }}
                onMouseMove={(e) => {
                  if (!isPanning || !panOriginRef.current || !svgViewportRef.current) return;
                  const dx = e.clientX - panOriginRef.current.startX;
                  const dy = e.clientY - panOriginRef.current.startY;
                  svgViewportRef.current.scrollLeft = panOriginRef.current.scrollLeft - dx;
                  svgViewportRef.current.scrollTop = panOriginRef.current.scrollTop - dy;
                }}
                onMouseUp={() => setIsPanning(false)}
                onMouseLeave={() => setIsPanning(false)}
                onWheel={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const delta = e.deltaY < 0 ? 0.15 : -0.15;
                    setMapZoom((z) => Math.min(3.0, Math.max(0.5, +(z + delta).toFixed(2))));
                  }
                }}
                className={`relative bg-slate-950 rounded-2xl p-2 sm:p-4 md:p-6 border border-slate-800/80 overflow-auto max-h-[75vh] sm:max-h-[860px] touch-pan-x touch-pan-y ${
                  isPanning ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                <div className="min-w-fit flex justify-center mx-auto">
                  <svg
                    ref={svgRef}
                    id="denahSvg"
                    width={Math.round(640 * mapZoom)}
                    height={Math.round(1484 * mapZoom)}
                    viewBox="0 0 440 1020"
                    style={{
                      width: `${Math.round(640 * mapZoom)}px`,
                      height: `${Math.round(1484 * mapZoom)}px`,
                      minWidth: `${Math.round(640 * mapZoom)}px`,
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    }}
                    className="select-none drop-shadow-2xl transition-all duration-150"
                  >
                    <defs>
                      <pattern
                        id="chairGrid"
                        width="10"
                        height="8"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          width="7"
                          height="6"
                          rx="1.5"
                          fill="#334155"
                          opacity="0.65"
                        />
                      </pattern>
                      <pattern
                        id="upperChairGrid"
                        width="10"
                        height="8"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          width="7"
                          height="6"
                          rx="1.5"
                          fill="#38bdf8"
                          opacity="0.3"
                        />
                      </pattern>
                      <linearGradient id="carpetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#991b1b" />
                      </linearGradient>
                      <linearGradient id="ledGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>

                    <line
                      x1="30"
                      y1="35"
                      x2="410"
                      y2="35"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4"
                    />
                    <text
                      x="220"
                      y="26"
                      fill="#94a3b8"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      LEBAR LAPANGAN: 22 METER
                    </text>

                    <line
                      x1="425"
                      y1="50"
                      x2="425"
                      y2="750"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4"
                    />
                    <text
                      x="435"
                      y="400"
                      fill="#94a3b8"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform="rotate(90, 435, 400)"
                    >
                      PANJANG LAPANGAN UTAMA: 60 METER
                    </text>

                    <rect
                      x="30"
                      y="50"
                      width="380"
                      height="700"
                      fill="#0b1120"
                      stroke="#334155"
                      strokeWidth="2"
                      rx="6"
                    />

                    {/* Panggung Utama */}
                    <rect
                      x="150"
                      y="60"
                      width="140"
                      height="75"
                      fill="#1e293b"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      rx="4"
                    />
                    <text
                      x="220"
                      y="90"
                      fill="#34d399"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      PANGGUNG UTAMA
                    </text>
                    <text
                      x="220"
                      y="105"
                      fill="#cbd5e1"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      8 × 6 M (Tinggi 1,2 M)
                    </text>

                    {/* Videotron */}
                    <rect
                      x="155"
                      y="62"
                      width="130"
                      height="13"
                      fill="url(#ledGrad)"
                      stroke="#38bdf8"
                      strokeWidth="1"
                      rx="2"
                    />
                    <text
                      x="220"
                      y="72"
                      fill="#082f49"
                      fontSize="8"
                      fontWeight="extrabold"
                      textAnchor="middle"
                    >
                      VIDEOTRON LED 8 × 3 M
                    </text>

                    {/* Sayap Kiri: Panggung Kreasi / Control Room */}
                    <rect
                      x="40"
                      y="60"
                      width="95"
                      height="58"
                      fill="#1e1b4b"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                      rx="4"
                    />
                    <text
                      x="87"
                      y="82"
                      fill="#c7d2fe"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      PANGGUNG KREASI 1
                    </text>
                    <text
                      x="87"
                      y="95"
                      fill="#818cf8"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      4 × 6 M &amp; Control Room
                    </text>

                    {/* Sayap Kanan: Panggung Kreasi 2 & Paduan Suara */}
                    <rect
                      x="305"
                      y="60"
                      width="95"
                      height="58"
                      fill="#14532d"
                      stroke="#22c55e"
                      strokeWidth="1.5"
                      rx="4"
                    />
                    <text
                      x="352"
                      y="82"
                      fill="#bbf7d0"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      PADUAN SUARA &amp; SENI
                    </text>
                    <text
                      x="352"
                      y="94"
                      fill="#4ade80"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      4 × 6 M (Trap 3 Level)
                    </text>
                    <text
                      x="352"
                      y="107"
                      fill="#86efac"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ⬇ HADAP PESERTA
                    </text>

                    {/* Buffer Area */}
                    <rect
                      x="40"
                      y="145"
                      width="360"
                      height="35"
                      fill="#0f172a"
                      stroke="#475569"
                      strokeDasharray="3"
                      rx="2"
                    />
                    <text
                      x="220"
                      y="167"
                      fill="#64748b"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      SET TAMAN MINI GARDEN, TARI SAMBUT &amp; PERS (BUFFER 3 M)
                    </text>

                    {/* Lorong Utama Karpet Merah */}
                    <rect
                      x="200"
                      y="180"
                      width="40"
                      height="565"
                      fill="url(#carpetGrad)"
                      stroke="#ef4444"
                      strokeWidth="1"
                    />
                    <text
                      x="220"
                      y="450"
                      fill="#fecaca"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform="rotate(90, 220, 450)"
                    >
                      LORONG UTAMA (HAMBAL / RED CARPET LEBAR 2,5 M)
                    </text>

                    {/* VVIP Kiri */}
                    <rect
                      x="50"
                      y="190"
                      width="140"
                      height="40"
                      fill="#78350f"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      rx="4"
                    />
                    <text
                      x="120"
                      y="206"
                      fill="#fde68a"
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      SOFA VVIP BUPATI &amp; FORKOPIMDA
                    </text>
                    <text
                      x="120"
                      y="217"
                      fill="#fcd34d"
                      fontSize="7"
                      textAnchor="middle"
                    >
                      Sofa Mewah + Meja Kaca Bunga
                    </text>
                    <text
                      x="120"
                      y="227"
                      fill="#fef08a"
                      fontSize="7"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ⬆ MENGHADAP KE PANGGUNG
                    </text>

                    {/* VVIP Kanan */}
                    <rect
                      x="250"
                      y="190"
                      width="140"
                      height="40"
                      fill="#78350f"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      rx="4"
                    />
                    <text
                      x="320"
                      y="206"
                      fill="#fde68a"
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      SOFA VVIP KETUA PGRI &amp; KADISDIK
                    </text>
                    <text
                      x="320"
                      y="217"
                      fill="#fcd34d"
                      fontSize="7"
                      textAnchor="middle"
                    >
                      Sofa Mewah + Meja Kaca Bunga
                    </text>
                    <text
                      x="320"
                      y="227"
                      fill="#fef08a"
                      fontSize="7"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ⬆ MENGHADAP KE PANGGUNG
                    </text>

                    {/* VIP Ring 2 */}
                    <rect
                      x="50"
                      y="238"
                      width="140"
                      height="30"
                      fill="#1e293b"
                      stroke="#eab308"
                      strokeWidth="1"
                      rx="2"
                    />
                    <text
                      x="120"
                      y="253"
                      fill="#fef08a"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      VIP PENGURUS PGRI &amp; KABID
                    </text>
                    <text
                      x="120"
                      y="262"
                      fill="#fde047"
                      fontSize="6.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ⬆ HADAP PANGGUNG
                    </text>

                    <rect
                      x="250"
                      y="238"
                      width="140"
                      height="30"
                      fill="#1e293b"
                      stroke="#eab308"
                      strokeWidth="1"
                      rx="2"
                    />
                    <text
                      x="320"
                      y="253"
                      fill="#fef08a"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      VIP KEPALA SEKOLAH &amp; CAMAT
                    </text>
                    <text
                      x="320"
                      y="262"
                      fill="#fde047"
                      fontSize="6.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ⬆ HADAP PANGGUNG
                    </text>

                    {/* Blok Kursi Guru */}
                    <rect
                      x="50"
                      y="275"
                      width="140"
                      height="455"
                      fill="url(#chairGrid)"
                      stroke="#475569"
                      strokeWidth="1"
                      rx="3"
                    />
                    <text
                      x="120"
                      y="520"
                      fill="#e2e8f0"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      BLOK GURU KIRI
                    </text>
                    <text
                      x="120"
                      y="535"
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      ± 900 Kursi Sarung (Korwil Barat)
                    </text>

                    <line
                      x1="40"
                      y1="490"
                      x2="400"
                      y2="490"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4"
                    />
                    <text
                      x="320"
                      y="485"
                      fill="#fbbf24"
                      fontSize="7.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      GANG EVAKUASI K3 / AKSES TOILET (1,5 M)
                    </text>

                    <rect
                      x="250"
                      y="275"
                      width="140"
                      height="455"
                      fill="url(#chairGrid)"
                      stroke="#475569"
                      strokeWidth="1"
                      rx="3"
                    />
                    <text
                      x="320"
                      y="520"
                      fill="#e2e8f0"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      BLOK GURU KANAN
                    </text>
                    <text
                      x="320"
                      y="535"
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      ± 900 Kursi Sarung (Korwil Timur)
                    </text>

                    {/* Jalan Gerbang & Tanjak */}
                    <rect
                      x="20"
                      y="760"
                      width="400"
                      height="55"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="1.5"
                      rx="3"
                    />
                    <text
                      x="220"
                      y="792"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      JALAN GERBANG SMAN 1 BELITANG
                    </text>

                    <polygon
                      points="20,785 45,750 70,785 55,810 35,810"
                      fill="#b45309"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                    <text
                      x="45"
                      y="825"
                      fill="#fef08a"
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      TANJAK
                    </text>

                    <rect
                      x="365"
                      y="765"
                      width="50"
                      height="45"
                      fill="#1e3a8a"
                      stroke="#60a5fa"
                      strokeWidth="2"
                      rx="3"
                    />
                    <text
                      x="390"
                      y="788"
                      fill="#dbeafe"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      GERBANG
                    </text>
                    <text
                      x="390"
                      y="799"
                      fill="#bfdbfe"
                      fontSize="7"
                      textAnchor="middle"
                    >
                      SMAN 1 BLT
                    </text>

                    {showProcessionRoute && (
                      <>
                        <path
                          d="M 390,760 L 390,740 L 220,740 L 220,230"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeDasharray="5"
                        />
                        <text
                          x="270"
                          y="732"
                          fill="#f87171"
                          fontSize="8"
                          fontWeight="bold"
                        >
                          RUTE PROSESI BUPATI
                        </text>
                      </>
                    )}

                    {/* Lapangan Atas */}
                    <rect
                      x="20"
                      y="850"
                      width="400"
                      height="150"
                      fill="#0f172a"
                      stroke="#0ea5e9"
                      strokeWidth="2"
                      rx="6"
                    />
                    <rect
                      x="35"
                      y="860"
                      width="370"
                      height="130"
                      fill="url(#upperChairGrid)"
                      stroke="#38bdf8"
                      strokeDasharray="2"
                      rx="4"
                    />
                    <rect
                      x="110"
                      y="880"
                      width="220"
                      height="42"
                      fill="#0b1120"
                      opacity="0.95"
                      rx="6"
                      stroke="#0284c7"
                    />
                    <text
                      x="220"
                      y="898"
                      fill="#38bdf8"
                      fontSize="11"
                      fontWeight="extrabold"
                      textAnchor="middle"
                    >
                      LAPANGAN ATAS / TRIBUN GURU
                    </text>
                    <text
                      x="220"
                      y="913"
                      fill="#7dd3fc"
                      fontSize="8.5"
                      textAnchor="middle"
                    >
                      Kapasitas: 1.200 Kursi (Elevasi Tinggi / Pandangan Alami)
                    </text>

                    <circle cx="170" cy="850" r="5" fill="#f59e0b" />
                    <text
                      x="170"
                      y="843"
                      fill="#fbbf24"
                      fontSize="7"
                      textAnchor="middle"
                    >
                      Delay Audio
                    </text>
                    <circle cx="270" cy="850" r="5" fill="#f59e0b" />
                    <text
                      x="270"
                      y="843"
                      fill="#fbbf24"
                      fontSize="7"
                      textAnchor="middle"
                    >
                      Delay Audio
                    </text>
                  </svg>
                </div>
              </div>

              {/* Quick Download Action Footer */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-bold">
                      Simpan & Bagikan Gambar Denah 2D:
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Format Ultra-HD (PNG 300 DPI) jernih saat di-zoom, siap dikirim ke grup WhatsApp panitia.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <button
                    onClick={() => downloadDenahImage("poster")}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg border border-emerald-400/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Poster Lengkap (+ Legenda)</span>
                  </button>
                  <button
                    onClick={() => downloadDenahImage("cad-only")}
                    className="flex-1 sm:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>📐 Denah Saja</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DISTRIBUSI ZONASI 3.000 KURSI (4-COLUMN HORIZONTAL CARDS - NO RAB NUMBERS) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Distribusi Zonasi 3.000 Kursi Peserta & Tamu Kehormatan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">
                      Ring 1: Sofa VVIP Mewah
                    </span>
                    <span className="text-slate-400">
                      Bupati, Ketua PGRI, Forkopimda
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-extrabold rounded-lg shrink-0">
                    40 Kursi
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">
                      Ring 2: VIP Undangan Khusus
                    </span>
                    <span className="text-slate-400">
                      Pengurus Cabang, Camat, Kepsek
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-300 font-extrabold rounded-lg shrink-0">
                    160 Kursi
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">
                      Lapangan Utama (Blok 1 & 2)
                    </span>
                    <span className="text-slate-400">
                      Baris 1–60 (Napolly + Sarung)
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold rounded-lg shrink-0">
                    1.800 Kursi
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">
                      Tribun Lapangan Atas (Blok 3)
                    </span>
                    <span className="text-slate-400">
                      Baris 61–89 (Elevasi Berundak)
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 font-extrabold rounded-lg shrink-0">
                    1.026 Kursi
                  </span>
                </div>
              </div>
            </div>

            {/* PANDUAN TEKNIS METERAN LAPANGAN (96,15 METER) */}
            <div
              ref={meteranRef}
              className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
                    <Ruler className="w-3.5 h-3.5" />
                    Panduan Operasional Seksi Perlengkapan & Tata Ruang Lapangan
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    📐 Rincian Pembagian Panjang Lapangan (Bentang 96,15 Meter)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    <strong>Patokan Resmi Tarikan Roll Meteran di Lapangan:</strong>{" "}
                    Diukur dari bibir depan panggung paling utara (titik 0,0 M) lurus ke arah selatan hingga gerbang masuk belakang.
                  </p>
                </div>

                <button
                  onClick={handlePrintProposal}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg border border-emerald-400/40 transition flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Lembar Panduan Lapangan</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 mt-5">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-800">
                      <th className="p-3 text-center w-12">No</th>
                      <th className="p-3 min-w-[220px]">Zona / Segmen Lapangan</th>
                      <th className="p-3 text-center w-28">Panjang</th>
                      <th className="p-3 text-center w-36">Akumulasi Meteran</th>
                      <th className="p-3 min-w-[260px]">
                        Keterangan Teknis & Standar Penataan Kursi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {METERAN_SEGMENTS.map((seg) => (
                      <tr
                        key={seg.no}
                        className={`hover:bg-slate-800/40 transition ${
                          seg.type === "k3"
                            ? "bg-rose-950/20"
                            : seg.type === "vvip"
                            ? "bg-amber-950/15"
                            : ""
                        }`}
                      >
                        <td className="p-3 text-center font-bold text-slate-400">
                          {seg.no}
                        </td>
                        <td className="p-3 font-bold text-white">{seg.zone}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-400">
                          {seg.length}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-amber-300 bg-amber-950/25">
                          {seg.accum}
                        </td>
                        <td className="p-3 text-slate-300">{seg.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-emerald-950 to-slate-950 font-bold border-t-2 border-emerald-500/50 text-xs text-white">
                      <td
                        colSpan={2}
                        className="p-3 text-right uppercase tracking-wider text-emerald-300"
                      >
                        TOTAL PANJANG DIBUTUHKAN (AKUMULASI):
                      </td>
                      <td className="p-3 text-center font-mono text-base font-black text-emerald-400">
                        96,15 M
                      </td>
                      <td className="p-3 text-center font-mono text-sm font-black text-amber-400">
                        ≈ 96 METER
                      </td>
                      <td className="p-3 text-emerald-300">
                        ✓ Kapasitas 3.026 Kursi Napolly Terakomodir 100% Nyaman & Aman Sesuai K3
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: STUDIO VISUAL 3D FOTOREALISTIK & SIMULATOR CAD 3D              */}
        {/* ===================================================================== */}
        {activeTab === "render" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Photorealistic 3D Render Studio */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] sm:text-xs font-bold border border-cyan-500/30 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>Architectural Render Gallery • 4 Sudut Pandang</span>
                  </span>
                  <h2 className="text-base sm:text-xl font-black text-white leading-snug">
                    {currentRender.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    {currentRender.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full md:w-auto">
                  {(
                    [
                      ["front", "1. Tampak Depan"],
                      ["side", "2. Tampak Samping"],
                      ["rear", "3. Tribun Belakang"],
                      ["full", "4. Full Lapangan"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setStudioKey(key);
                        setExternal3DAngle(STUDIO_RENDERS[key].cadAngle);
                      }}
                      className={`px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition cursor-pointer border text-center ${
                        studioKey === key
                          ? "bg-cyan-600 text-white border-cyan-400 shadow-lg"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-[220px] sm:h-[360px] md:h-[460px]">
                <img
                  src={currentRender.img}
                  alt={currentRender.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-slate-950/85 backdrop-blur px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-cyan-500/40 text-[10px] sm:text-xs font-bold text-cyan-300">
                  {currentRender.badge}
                </div>
              </div>
            </div>

            {/* Real-Time Three.js 3D CAD Simulator */}
            <CadSimulator3D
              ref={cad3DRef}
              onPrintRequest={handlePrintProposal}
              externalAngle={external3DAngle}
            />
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: RENCANA ANGGARAN BIAYA (RAB) INTERAKTIF ENTERPRISE             */}
        {/* ===================================================================== */}
        {activeTab === "rab" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Header & Summary Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 sm:pb-5 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 border border-amber-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Kalkulator & Penganggaran EO Interaktif Real-Time</span>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white">
                    Rencana Anggaran Biaya (RAB) Pelaksanaan
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                    Anda dapat mengedit <strong>Harga</strong>,{" "}
                    <strong>Jumlah</strong>, maupun mengetik langsung di kolom{" "}
                    <strong>Total (Rp)</strong>. Semua perubahan otomatis tersimpan.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
                  <button
                    onClick={addNewRabItem}
                    className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-lg border border-emerald-400/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>Tambah Item</span>
                  </button>

                  <button
                    onClick={exportRabToCsv}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Export Excel</span>
                  </button>

                  <button
                    onClick={handlePrintProposal}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 shrink-0" />
                    <span>Cetak RAB</span>
                  </button>

                  <button
                    onClick={resetRabToDefault}
                    className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[11px] sm:text-xs font-medium rounded-xl border border-rose-800/40 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* 3 Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5">
                <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] sm:text-xs text-slate-400 block font-medium">
                    Subtotal Rincian ({rabItems.length} Item)
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5 block">
                    {formatRupiah(rawSubtotal)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-emerald-400 block mt-0.5">
                    14 Komponen Perlengkapan, Multimedia & Hiburan
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] sm:text-xs text-slate-400 block font-medium">
                    Potongan / Pembulatan Paket EO
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">
                    - {formatRupiah(rabDiscount)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5">
                    Opsional (dapat diisi di bawah daftar)
                  </span>
                </div>

                <div className="bg-gradient-to-br from-amber-950/80 to-slate-950 p-3.5 sm:p-4 rounded-2xl border border-amber-500/50 shadow-lg">
                  <span className="text-[11px] sm:text-xs text-amber-300 block font-bold uppercase tracking-wider">
                    Total Rencana Anggaran Biaya (RAB)
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 mt-0.5 block">
                    {formatRupiah(grandTotal)}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-300 italic block mt-0.5 truncate">
                    &ldquo;{terbilangText}&rdquo;
                  </span>
                </div>
              </div>
            </div>

            {/* MOBILE-FRIENDLY CARD VIEW (Tampil Otomatis di Layar HP agar Rapi & Tidak Perlu Geser Kiri-Kanan) */}
            <div className="md:hidden space-y-3">
              {rabItems.map((item, index) => {
                const subtotal = (item.qty || 0) * (item.price || 0);
                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 shadow-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs shrink-0">
                        No. {index + 1}
                      </span>
                      <button
                        onClick={() => deleteRabItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition"
                        title="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        Nama Item
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateItemField(item.id, "name", e.target.value)
                        }
                        className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                          Harga (Rp)
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            item.price > 0
                              ? item.price.toLocaleString("id-ID")
                              : ""
                          }
                          placeholder="0"
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            updateItemField(
                              item.id,
                              "price",
                              raw ? parseInt(raw, 10) : 0
                            );
                          }}
                          className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 text-amber-300 font-bold text-xs rounded-xl px-2.5 py-2 text-right outline-none"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1 text-center">
                          Jumlah
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.qty}
                          onChange={(e) =>
                            updateItemField(
                              item.id,
                              "qty",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 text-cyan-300 font-bold text-xs rounded-xl px-2 py-2 text-center outline-none"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1 text-center">
                          Satuan
                        </label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) =>
                            updateItemField(item.id, "unit", e.target.value)
                          }
                          className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-slate-300 text-xs rounded-xl px-2 py-2 text-center outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Total Item:
                      </span>
                      <div className="relative flex items-center w-44">
                        <span className="absolute left-3 text-emerald-400 font-bold text-xs pointer-events-none">
                          Rp
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={
                            subtotal > 0 ? subtotal.toLocaleString("id-ID") : ""
                          }
                          placeholder="0"
                          onChange={(e) =>
                            handleSubtotalDirectChange(item.id, e.target.value)
                          }
                          className="w-full bg-slate-950 border border-emerald-500/40 focus:border-emerald-400 text-emerald-300 font-black text-xs rounded-xl pl-8 pr-2.5 py-1.5 text-right outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Mobile Footer Total Card */}
              <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Subtotal ({rabItems.length} Item):</span>
                  <span className="font-bold">{formatRupiah(rawSubtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black text-amber-400 pt-2 border-t border-slate-800">
                  <span>TOTAL RAB:</span>
                  <span className="text-lg">{formatRupiah(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* DESKTOP EXCEL-STYLE RAB TABLE (Exact Column Order: No | Nama Item | Harga | Jumlah | Satuan | Total) */}
            <div className="hidden md:block bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-800">
                      <th className="p-3 text-center w-12">No</th>
                      <th className="p-3 min-w-[240px]">Nama Item</th>
                      <th className="p-3 min-w-[170px] text-right">Harga</th>
                      <th className="p-3 text-center w-24">Jumlah</th>
                      <th className="p-3 text-center w-24">Satuan</th>
                      <th className="p-3 min-w-[180px] text-right">Total</th>
                      <th className="p-3 text-center w-24">Porsi</th>
                      <th className="p-3 text-center w-14">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 text-slate-200">
                    {rabItems.map((item, index) => {
                      const subtotal = (item.qty || 0) * (item.price || 0);
                      const pct =
                        rawSubtotal > 0
                          ? Math.round((subtotal / rawSubtotal) * 100)
                          : 0;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-800/40 transition"
                        >
                          <td className="p-3 text-center text-slate-400 font-bold">
                            {index + 1}
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                updateItemField(item.id, "name", e.target.value)
                              }
                              className="w-full bg-slate-950/70 border border-slate-700/70 focus:border-amber-400 text-white font-semibold text-xs rounded-xl px-3 py-2 outline-none"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-slate-400 font-bold text-xs pointer-events-none">
                                Rp
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={
                                  item.price > 0
                                    ? item.price.toLocaleString("id-ID")
                                    : ""
                                }
                                placeholder="0"
                                onChange={(e) => {
                                  const raw = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  updateItemField(
                                    item.id,
                                    "price",
                                    raw ? parseInt(raw, 10) : 0
                                  );
                                }}
                                className="w-full bg-slate-950/70 border border-slate-700/70 focus:border-amber-400 text-amber-300 font-bold text-xs rounded-xl pl-9 pr-3 py-2 text-right outline-none"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.qty}
                              onChange={(e) =>
                                updateItemField(
                                  item.id,
                                  "qty",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-20 bg-slate-950/70 border border-slate-700/70 focus:border-cyan-400 text-cyan-300 font-bold text-xs rounded-xl px-2 py-2 text-center outline-none"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) =>
                                updateItemField(item.id, "unit", e.target.value)
                              }
                              className="w-20 bg-slate-950/70 border border-slate-700/70 focus:border-indigo-400 text-slate-300 text-xs rounded-xl px-2 py-2 text-center outline-none"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-emerald-400 font-bold text-xs pointer-events-none">
                                Rp
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={
                                  subtotal > 0
                                    ? subtotal.toLocaleString("id-ID")
                                    : ""
                                }
                                placeholder="0"
                                onChange={(e) =>
                                  handleSubtotalDirectChange(
                                    item.id,
                                    e.target.value
                                  )
                                }
                                className="w-full bg-slate-950/90 border border-emerald-500/30 focus:border-emerald-400 text-emerald-300 font-black text-xs rounded-xl pl-9 pr-3 py-2 text-right outline-none"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-mono text-slate-400">
                                {pct}%
                              </span>
                              <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => deleteRabItem(item.id)}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition cursor-pointer"
                              title="Hapus baris"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900/90 font-semibold border-t border-slate-800 text-xs text-slate-300">
                      <td colSpan={5} className="p-3 text-right uppercase">
                        Subtotal Rincian Item:
                      </td>
                      <td className="p-3 text-right font-bold text-slate-200">
                        {formatRupiah(rawSubtotal)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                    <tr className="bg-slate-900/90 font-semibold border-t border-slate-800 text-xs text-emerald-300">
                      <td colSpan={5} className="p-3 text-right uppercase">
                        Potongan / Pembulatan Paket EO (Diskon):
                      </td>
                      <td className="p-3 text-right">
                        <div className="relative flex items-center justify-end">
                          <span className="text-emerald-400 font-bold text-xs mr-1.5">
                            - Rp
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={
                              rabDiscount > 0
                                ? rabDiscount.toLocaleString("id-ID")
                                : "0"
                            }
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, "");
                              persistRab(
                                rabItems,
                                raw ? parseInt(raw, 10) : 0
                              );
                            }}
                            className="w-32 bg-slate-950 border border-emerald-500/40 focus:border-emerald-400 text-emerald-300 font-bold text-xs rounded-lg px-2.5 py-1.5 text-right outline-none"
                          />
                        </div>
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                    <tr className="bg-slate-950 font-bold border-t-2 border-slate-700 text-sm">
                      <td
                        colSpan={5}
                        className="p-4 text-right text-slate-200 uppercase tracking-wide"
                      >
                        Total Rencana Anggaran Biaya (RAB):
                      </td>
                      <td className="p-4 text-right text-xl font-black text-amber-400">
                        {formatRupiah(grandTotal)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 7-PAGE PRINT PROPOSAL BOOKLET ================= */}
      <PrintProposalBooklet
        rabItems={rabItems}
        rabDiscount={rabDiscount}
        formatRupiah={formatRupiah}
        terbilangRupiah={terbilangRupiah}
      />
    </>
  );
}
