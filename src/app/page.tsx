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
  Video,
  Play,
  Pause,
  Maximize2,
  Repeat,
  Calculator,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff,
  UserCheck,
  LogOut,
  Settings,
  Share2,
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
  { name: "Kursi Sofa VVIP & Meja Kaca", qty: 5, unit: "set", price: 500000 },
  { name: "Konsumsi Tamu & Peserta", qty: 1, unit: "paket", price: 5000000 },
  { name: "Spanduk, Baliho & Photobooth", qty: 1, unit: "paket", price: 2500000 },
  { name: "Genset & Listrik Cadangan", qty: 1, unit: "paket", price: 2000000 },
  { name: "Keamanan, Parkir & Medis K3", qty: 1, unit: "paket", price: 1500000 },
  { name: "Souvenir / Plakat Penghargaan", qty: 1, unit: "paket", price: 2000000 },
];

const DEFAULT_RAB_IDS = new Set(DEFAULT_RAB_LIST.map((item) => item.id));

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
  const [mapZoom, setMapZoom] = useState<number>(1.0);
  const [baseMapWidth, setBaseMapWidth] = useState<number>(360);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [showProcessionRoute, setShowProcessionRoute] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [gitSyncStatus, setGitSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [lastGitSyncTime, setLastGitSyncTime] = useState<string | null>(null);

  // Admin Authorization & Public Access Control State (RAB Only)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [rabPublicAccess, setRabPublicAccess] = useState<boolean>(true);
  const [adminPin, setAdminPin] = useState<string>("10603301");
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginPinInput, setLoginPinInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPinVisible, setShowPinVisible] = useState<boolean>(false);
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [newPinInput, setNewPinInput] = useState<string>("");

  // Video Player state & refs (HP & Desktop)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoCardRef = useRef<HTMLDivElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoLoop, setIsVideoLoop] = useState<boolean>(true);

  // Form Tambah Item Anggaran Baru state
  const addRabSectionRef = useRef<HTMLDivElement | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<number | "">("");
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemUnit, setNewItemUnit] = useState<string>("paket");

  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgViewportRef = useRef<HTMLDivElement | null>(null);
  const tabContentRef = useRef<HTMLDivElement | null>(null);
  const panOriginRef = useRef<{ startX: number; startY: number; scrollLeft: number; scrollTop: number } | null>(null);
  const meteranRef = useRef<HTMLDivElement | null>(null);
  const cad3DRef = useRef<CadSimulator3DRef | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check persisted admin session & URL access query on client mount
  useEffect(() => {
    try {
      const savedAdmin = sessionStorage.getItem("rab_auth_is_admin");
      if (savedAdmin === "true") {
        setIsAdmin(true);
      }
    } catch {}

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("rab") === "locked") {
        setRabPublicAccess(false);
        try {
          localStorage.setItem("rab_public_access", "false");
        } catch {}
      } else if (
        urlParams.get("rab") === "open" ||
        urlParams.get("access") === "public" ||
        urlParams.get("view") === "rab"
      ) {
        setRabPublicAccess(true);
        try {
          localStorage.setItem("rab_public_access", "true");
        } catch {}
      }
    }
  }, []);

  // Measure viewport width so 2D SVG zoom has exact pixel dimensions on both HP and Desktop
  useEffect(() => {
    const updateBaseWidth = () => {
      if (svgViewportRef.current && svgViewportRef.current.clientWidth > 100) {
        const cw = svgViewportRef.current.clientWidth - 20;
        setBaseMapWidth(Math.min(720, Math.max(280, cw)));
      } else if (typeof window !== "undefined") {
        setBaseMapWidth(window.innerWidth < 640 ? Math.max(280, window.innerWidth - 52) : 640);
      }
    };
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
    return () => window.removeEventListener("resize", updateBaseWidth);
  }, [activeTab]);

  // Load saved RAB & Access Settings from server (rab-config.json) or localStorage
  useEffect(() => {
    // Purge outdated demo PIN from previous sessions if any
    try {
      const storedPin = localStorage.getItem("rab_admin_pin");
      if (storedPin === "1987") {
        localStorage.setItem("rab_admin_pin", "10603301");
      }
    } catch {}

    fetch("/api/sync-git")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.rabItems) && data.rabItems.length > 0) {
          setRabItems(data.rabItems);
          setRabDiscount(typeof data.rabDiscount === "number" ? data.rabDiscount : 0);
          localStorage.setItem("rab_data_hut_pgri_v3", JSON.stringify(data.rabItems));
          localStorage.setItem("rab_discount_hut_pgri_v3", String(data.rabDiscount ?? 0));
        }
        if (typeof data?.rabPublicAccess === "boolean") {
          setRabPublicAccess(data.rabPublicAccess);
          localStorage.setItem("rab_public_access", String(data.rabPublicAccess));
        } else {
          setRabPublicAccess(true);
          localStorage.setItem("rab_public_access", "true");
        }
        if (typeof data?.adminPin === "string" && data.adminPin && data.adminPin !== "1987") {
          setAdminPin(data.adminPin);
          localStorage.setItem("rab_admin_pin", data.adminPin);
        } else {
          setAdminPin("10603301");
          localStorage.setItem("rab_admin_pin", "10603301");
        }
      })
      .catch(() => {
        try {
          const savedItems = localStorage.getItem("rab_data_hut_pgri_v3");
          const savedDiscount = localStorage.getItem("rab_discount_hut_pgri_v3");
          const savedAccess = localStorage.getItem("rab_public_access");
          const savedPin = localStorage.getItem("rab_admin_pin");
          if (savedItems) setRabItems(JSON.parse(savedItems));
          if (savedDiscount !== null) setRabDiscount(parseInt(savedDiscount, 10) || 0);
          if (savedAccess !== null) {
            setRabPublicAccess(savedAccess === "true");
          } else {
            setRabPublicAccess(true);
          }
          if (savedPin && savedPin !== "1987") {
            setAdminPin(savedPin);
          } else {
            setAdminPin("10603301");
            localStorage.setItem("rab_admin_pin", "10603301");
          }
        } catch (err) {
          console.warn("Error loading RAB from localStorage:", err);
        }
      });
  }, []);

  // Real-time Cloud KV listener: syncs permission status across all visitor devices within seconds!
  useEffect(() => {
    let isSubscribed = true;
    const fetchAccessFromCloud = () => {
      fetch("https://keyvalue.immanuel.co/api/KeyVal/GetValue/c84fpy47/rab_public_access")
        .then((res) => res.text())
        .then((text) => {
          if (!isSubscribed) return;
          const clean = text.trim().toLowerCase().replace(/"/g, "");
          if (clean === "true") {
            setRabPublicAccess(true);
            try {
              localStorage.setItem("rab_public_access", "true");
            } catch {}
          } else if (clean === "false") {
            setRabPublicAccess(false);
            try {
              localStorage.setItem("rab_public_access", "false");
            } catch {}
          }
        })
        .catch(() => {});
    };

    fetchAccessFromCloud();
    const interval = setInterval(fetchAccessFromCloud, 4000);
    window.addEventListener("focus", fetchAccessFromCloud);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
      window.removeEventListener("focus", fetchAccessFromCloud);
    };
  }, []);

  const triggerGitSync = async (
    items: RabItem[],
    discount: number,
    manual = false,
    publicAccess = rabPublicAccess,
    pin = adminPin
  ) => {
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
          rabPublicAccess: publicAccess,
          adminPin: pin,
          commitMessage: `Update RAB & Desain via Portal Next.js (${new Date().toLocaleString("id-ID")})`,
        }),
      });
      const data = await res.json();
      if (data?.ok || data?.success) {
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
    if (!isAdmin) {
      showToast("🔒 Mode Tamu (Hanya Lihat). Masuk sebagai Admin untuk menyimpan perubahan RAB.");
      setShowLoginModal(true);
      return;
    }
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
      triggerGitSync(items, discount, false, rabPublicAccess, adminPin);
    }, 2000);
  };

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loginPinInput.trim() === adminPin.trim()) {
      setIsAdmin(true);
      try {
        sessionStorage.setItem("rab_auth_is_admin", "true");
      } catch {}
      setShowLoginModal(false);
      setLoginPinInput("");
      setLoginError(null);
      showToast("👑 Mode Admin RAB Aktif! Anda kini memiliki akses penuh untuk edit & tambah item.");
    } else {
      setLoginError("PIN Admin salah. Silakan periksa kembali PIN Anda.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem("rab_auth_is_admin");
    } catch {}
    showToast("🔒 Mode Admin Non-Aktif. RAB kembali ke Mode Tamu (Hanya Lihat / Terkunci).");
  };

  const handleTogglePublicAccess = (newAccess: boolean) => {
    if (!isAdmin) return;
    setRabPublicAccess(newAccess);
    try {
      localStorage.setItem("rab_public_access", String(newAccess));
    } catch {}

    // 🌐 Real-Time Cloud Sync across all visitor devices (phones & desktops)
    fetch(
      `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/c84fpy47/rab_public_access/${newAccess}`,
      { method: "POST" }
    ).catch(() => {});

    triggerGitSync(rabItems, rabDiscount, false, newAccess, adminPin);
    showToast(
      newAccess
        ? "🔓 Izin Publik Diberikan: Pengunjung umum sekarang BISA LANGSUNG MELIHAT RAB tanpa PIN (Mode Read-Only / Hanya Lihat, tidak bisa edit)."
        : "🔒 Izin Publik Dicabut: Menu RAB kini KOSONG & TERKUNCI untuk publik (Wajib PIN Admin)."
    );
  };

  const handleChangePin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newPinInput.trim();
    if (clean.length < 4) {
      showToast("⚠️ PIN Admin minimal 4 digit karakter");
      return;
    }
    setAdminPin(clean);
    try {
      localStorage.setItem("rab_admin_pin", clean);
    } catch {}
    setShowChangePinModal(false);
    setNewPinInput("");
    triggerGitSync(rabItems, rabDiscount, false, rabPublicAccess, clean);
    showToast(`✅ PIN Admin berhasil diubah menjadi: ${clean}`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Calculations for base budget vs additional budget
  const rawSubtotal = rabItems.reduce(
    (acc, it) => acc + (it.qty || 0) * (it.price || 0),
    0
  );
  const baseBudgetSubtotal = rabItems
    .filter((it) => DEFAULT_RAB_IDS.has(it.id))
    .reduce((acc, it) => acc + (it.qty || 0) * (it.price || 0), 0);

  const additionalItems = rabItems.filter((it) => !DEFAULT_RAB_IDS.has(it.id));
  const additionalBudgetTotal = additionalItems.reduce(
    (acc, it) => acc + (it.qty || 0) * (it.price || 0),
    0
  );
  const additionalItemsCount = additionalItems.length;

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

  const scrollToVideoSection = () => {
    setActiveTab("denah");
    setTimeout(() => {
      videoCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
      }
    }, 150);
  };

  const scrollToAddRabSection = () => {
    setActiveTab("rab");
    if (!isAdmin) {
      showToast("🔒 Fitur Tambah & Edit Anggaran khusus Admin Panitia.");
      setShowLoginModal(true);
      return;
    }
    setTimeout(() => {
      addRabSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
      showToast("▶️ Memutar Video Drone Denah Lokasi");
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
      showToast("⏸️ Video Denah Lokasi dijeda");
    }
  };

  const handleFullscreenVideo = () => {
    if (!videoRef.current) return;
    const v: any = videoRef.current;
    if (v.requestFullscreen) {
      v.requestFullscreen();
    } else if (v.webkitEnterFullscreen) {
      // iOS Safari support
      v.webkitEnterFullscreen();
    } else if (v.webkitRequestFullscreen) {
      v.webkitRequestFullscreen();
    }
  };

  // Form Tambah Item Anggaran Handler
  const handleAddNewCustomItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = newItemName.trim();
    if (!trimmedName) {
      showToast("⚠️ Mohon masukkan Nama Item Anggaran");
      return;
    }
    const numPrice = typeof newItemPrice === "number" ? Math.max(0, newItemPrice) : 0;
    const numQty = Math.max(1, newItemQty || 1);
    const unitStr = newItemUnit.trim() || "paket";

    const newItem: RabItem = {
      id: "rab-custom-" + Date.now(),
      name: trimmedName,
      price: numPrice,
      qty: numQty,
      unit: unitStr,
    };

    const updated = [...rabItems, newItem];
    persistRab(updated, rabDiscount);
    const itemSubtotal = numPrice * numQty;
    showToast(`✅ Ditambahkan: "${trimmedName}" (+${formatRupiah(itemSubtotal)})`);

    // Reset form
    setNewItemName("");
    setNewItemPrice("");
    setNewItemQty(1);
    setNewItemUnit("paket");
  };

  const handleApplyPreset = (preset: { name: string; qty: number; unit: string; price: number }) => {
    setNewItemName(preset.name);
    setNewItemPrice(preset.price);
    setNewItemQty(preset.qty);
    setNewItemUnit(preset.unit);
    showToast(`📋 Form terisi preset: ${preset.name}`);
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
  const svgPxWidth = Math.round(baseMapWidth * mapZoom);
  const svgPxHeight = Math.round(svgPxWidth * (1020 / 440));

  const handleSelectMainTab = (tab: "denah" | "render" | "rab") => {
    setActiveTab(tab);
    if (tab === "denah") {
      showToast("📐 Menu 1 Aktif: Denah 2D Skematik & Meteran");
    } else if (tab === "render") {
      showToast("🎬 Menu 2 Aktif: Studio Visual 3D & Simulator CAD");
    } else {
      showToast("💰 Menu 3 Aktif: Rencana Anggaran Biaya (RAB)");
    }
  };

  return (
    <>
      {/* ================= FLOATING TOAST NOTIFICATION ================= */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 border border-emerald-500/50 text-white text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2.5 pointer-events-none no-print">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMsg}</span>
        </div>
      )}

      {/* ================= STICKY GLASSMORPHIC TOP NAVBAR ================= */}
      <div className="sticky top-0 z-40 bg-[#030712]/95 border-b border-slate-800/80 no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs md:text-sm font-black tracking-wide uppercase text-white leading-snug">
              PORTAL PERENCANAAN EKSEKUTIF • HUT PGRI KE-79 & HGN
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
              Kabupaten OKU Timur • Venue: Lapangan SMAN 1 Belitang (22 × 96,15 M)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={scrollToVideoSection}
              className="touch-manipulation px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black bg-cyan-500/20 active:bg-cyan-500/35 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              title="Tonton Video Drone Denah Lokasi di HP"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Video Lokasi</span>
            </button>

            {isAdmin ? (
              <button
                type="button"
                onClick={scrollToAddRabSection}
                className="touch-manipulation px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black bg-amber-500/20 active:bg-amber-500/35 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                title="Buka Menu Tambah Item Anggaran Baru"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+ Anggaran</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setShowLoginModal(true);
                }}
                className="touch-manipulation px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-amber-500/15 active:bg-amber-500/30 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                title="Masuk Sebagai Admin (Untuk Edit & Tambah RAB)"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Login Admin RAB</span>
              </button>
            )}

            <button
              type="button"
              onClick={scrollToMeteranSection}
              className="touch-manipulation px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-slate-800 active:bg-slate-700 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Meteran 96M</span>
            </button>

            <button
              type="button"
              onClick={() => downloadDenahImage("poster")}
              className="touch-manipulation px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-slate-800 active:bg-slate-700 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Unduh 2D</span>
            </button>

            <button
              type="button"
              onClick={handlePrintProposal}
              className="touch-manipulation px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 active:from-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg border border-emerald-400/40 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Cetak PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN WEB CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-6 no-print">
        {/* HERO BANNER WITH DIRECT TOP MENU RIGHT UNDER THE TITLE & DESCRIPTION */}
        <header className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-[#091326] to-emerald-950/40 border border-slate-800/90 p-4 sm:p-6 md:p-7 shadow-2xl">
          <div className="space-y-2 max-w-4xl">
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

          {/* 3 MAIN NAVIGATION MENUS POSITIONED DIRECTLY BELOW DESCRIPTION */}
          <div className="mt-4 pt-4 border-t border-slate-800/90">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Pilih Menu Utama (Ketuk Salah Satu Menu di Bawah Ini):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectMainTab("denah")}
                className={`touch-manipulation w-full px-4 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center justify-between gap-2 cursor-pointer border-2 ${
                  activeTab === "denah"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/70 border-emerald-300"
                    : "bg-slate-900/95 hover:bg-slate-800 active:bg-slate-800 text-slate-200 border-slate-700/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Map className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-emerald-200" />
                  <span className="truncate text-left">1. Denah 2D & Meteran (96,15 M)</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase shrink-0 ${
                    activeTab === "denah"
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {activeTab === "denah" ? "AKTIF" : "BUKA"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMainTab("render")}
                className={`touch-manipulation w-full px-4 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center justify-between gap-2 cursor-pointer border-2 ${
                  activeTab === "render"
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-950/70 border-cyan-300"
                    : "bg-slate-900/95 hover:bg-slate-800 active:bg-slate-800 text-slate-200 border-slate-700/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Box className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-cyan-200" />
                  <span className="truncate text-left">2. Studio Visual 3D & CAD 360°</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase shrink-0 ${
                    activeTab === "render"
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {activeTab === "render" ? "AKTIF" : "BUKA"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMainTab("rab")}
                className={`touch-manipulation w-full px-4 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center justify-between gap-2 cursor-pointer border-2 ${
                  activeTab === "rab"
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-950/70 border-amber-300"
                    : "bg-slate-900/95 hover:bg-slate-800 active:bg-slate-800 text-slate-200 border-slate-700/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-200" />
                  <span className="truncate text-left">
                    3. Rencana Anggaran Biaya (RAB) {!isAdmin && !rabPublicAccess ? "🔒" : ""}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase shrink-0 ${
                    activeTab === "rab"
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {activeTab === "rab" ? "AKTIF" : !isAdmin && !rabPublicAccess ? "KUNCI" : "BUKA"}
                </span>
              </button>
            </div>

            {/* QUICK DIRECT SHORTCUTS FOR VIDEO & ADD BUDGET */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={scrollToVideoSection}
                className="touch-manipulation w-full py-2.5 px-3.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 active:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition flex items-center justify-between gap-2 cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">🎥 Tonton Video Drone Denah Lokasi (HP)</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-900/80 px-2 py-0.5 rounded shrink-0">
                  Full HD
                </span>
              </button>

              <button
                type="button"
                onClick={scrollToAddRabSection}
                className="touch-manipulation w-full py-2.5 px-3.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 active:bg-amber-900 border border-amber-500/40 text-amber-200 text-xs font-bold transition flex items-center justify-between gap-2 cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isAdmin ? (
                    <>
                      <Plus className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">➕ Tambah Item Anggaran (Hitung Otomatis)</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">📋 Rincian Rencana Anggaran Biaya (RAB)</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-900/80 px-2 py-0.5 rounded shrink-0">
                  {isAdmin ? "Mode Admin" : "Hanya Lihat"}
                </span>
              </button>
            </div>
          </div>
        </header>

        <div ref={tabContentRef} />

        {/* ===================================================================== */}
        {/* TAB 1: DENAH 2D SKEMATIK, VIDEO LOKASI & METERAN LAPANGAN             */}
        {/* ===================================================================== */}
        {activeTab === "denah" && (
          <div className="space-y-4 sm:space-y-6">
            {/* 🎥 DEDICATED MOBILE & DESKTOP VIDEO DRONE DENAH LOKASI PLAYER CARD */}
            <div
              ref={videoCardRef}
              className="bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 border-2 border-cyan-500/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 pb-3 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1 border border-cyan-500/40">
                    <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Video Drone Lapangan Asli (HP & Desktop)</span>
                  </div>
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <span>🎬 Video Denah Udara Venue: Lapangan SMAN 1 Belitang</span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                    Diputar langsung di HP tanpa buffering (resolusi tajam Full HD 1080p). Menampilkan bentang lahan 22 × 96,15 meter dari pintu gerbang hingga panggung.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
                  <button
                    type="button"
                    onClick={toggleVideoPlay}
                    className="touch-manipulation px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {isVideoPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Jeda</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Putar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVideoLoop((v) => !v)}
                    className={`touch-manipulation px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                      isVideoLoop
                        ? "bg-slate-800 border-cyan-500/50 text-cyan-300"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                    title="Ulang Otomatis Saat Video Selesai"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Loop: {isVideoLoop ? "Aktif" : "Mati"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFullscreenVideo}
                    className="touch-manipulation px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                    title="Buka Layar Penuh di HP"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Layar Penuh</span>
                  </button>

                  <a
                    href="/video-denah-lokasi.mp4"
                    download="VIDEO_DENAH_LOKASI_HUT_PGRI.mp4"
                    className="touch-manipulation px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1.5"
                    title="Simpan File Video MP4 ke Galeri HP"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unduh MP4</span>
                  </a>
                </div>
              </div>

              {/* VIDEO PLAYER VIEWPORT WITH MOBILE ENHANCEMENTS */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-cyan-500/30 aspect-video shadow-inner max-h-[65vh] flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="/video-denah-lokasi.mp4"
                  poster="/video-denah-poster.jpg"
                  controls
                  playsInline
                  preload="metadata"
                  loop={isVideoLoop}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                  className="w-full h-full object-contain"
                >
                  Browser Anda belum mendukung tag video HTML5.
                </video>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-slate-200 font-semibold">
                    DJI Aerial Survey • SMAN 1 Belitang, Kab. OKU Timur
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[10px]">
                  <span>Durasi: 18 Detik</span>
                  <span>•</span>
                  <span>Kualitas: Full HD 1080p</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-semibold">Siap Diputar di HP</span>
                </div>
              </div>
            </div>
            {/* FULL-WIDTH INTERACTIVE 2D CAD MAP WITH GUARANTEED PIXEL ZOOM */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-sm sm:text-lg md:text-xl font-black text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>Cetak Biru Denah 2D Lapangan SMAN 1 Belitang</span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
                    Ketuk tombol <strong>150% / 200% / 300% / 400%</strong> atau geser slider di bawah untuk memperbesar tulisan di layar HP, lalu geser gambar ke kiri/kanan/atas/bawah.
                  </p>
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full xl:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowProcessionRoute((v) => !v)}
                    className={`touch-manipulation px-2.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                      showProcessionRoute
                        ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Rute VVIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadDenahImage("poster")}
                    className="touch-manipulation px-2.5 sm:px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-lg border border-emerald-400/40 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">PNG HD</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadDenahSvg}
                    className="touch-manipulation px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] sm:text-xs font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>SVG</span>
                  </button>
                </div>
              </div>

              {/* DEDICATED MOBILE & DESKTOP ZOOM CONTROL BAR (100% ACTIVE) */}
              <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 mb-3 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.max(1.0, +(z - 0.5).toFixed(2)))}
                    className="touch-manipulation px-3 py-2 bg-slate-800 active:bg-slate-700 hover:bg-slate-700 rounded-xl text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-700 shrink-0"
                  >
                    <ZoomOut className="w-4 h-4 text-amber-400" />
                    <span>Perkecil (-)</span>
                  </button>

                  <div className="flex-1 flex items-center gap-2 px-1">
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.25"
                      value={mapZoom}
                      onChange={(e) => setMapZoom(parseFloat(e.target.value) || 1)}
                      className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-mono font-black text-emerald-400 min-w-[52px] text-right">
                      {Math.round(mapZoom * 100)}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.min(4.0, +(z + 0.5).toFixed(2)))}
                    className="touch-manipulation px-3 py-2 bg-emerald-600 active:bg-emerald-500 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Perbesar (+)</span>
                  </button>
                </div>

                {/* Preset Zoom Buttons (100% Pas HP up to 400% Super Besar) */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { val: 1.0, label: "100% (Pas)" },
                    { val: 1.5, label: "150%" },
                    { val: 2.0, label: "200%" },
                    { val: 3.0, label: "300%" },
                    { val: 4.0, label: "400%" },
                  ].map((preset) => {
                    const isSelected = Math.abs(mapZoom - preset.val) < 0.1;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setMapZoom(preset.val)}
                        className={`touch-manipulation py-2 px-1 rounded-xl text-[11px] sm:text-xs font-extrabold transition cursor-pointer text-center border ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-400 shadow-md"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SVG Viewport with Exact Pixel Dimensions (Guaranteed to Resize on Every Mobile Browser) */}
              <div className="relative">
                <div
                  ref={svgViewportRef}
                  style={{ WebkitOverflowScrolling: "touch" }}
                  className="w-full bg-slate-950 rounded-2xl p-2 sm:p-4 border border-slate-800/80 overflow-x-auto overflow-y-auto max-h-[72vh] sm:max-h-[860px]"
                >
                  <div
                    style={{
                      width: `${svgPxWidth}px`,
                      height: `${svgPxHeight}px`,
                      minWidth: `${svgPxWidth}px`,
                      minHeight: `${svgPxHeight}px`,
                    }}
                    className="mx-auto block"
                  >
                    <svg
                      ref={svgRef}
                      id="denahSvg"
                      width={svgPxWidth}
                      height={svgPxHeight}
                      viewBox="0 0 440 1020"
                      style={{
                        width: `${svgPxWidth}px`,
                        height: `${svgPxHeight}px`,
                        minWidth: `${svgPxWidth}px`,
                        minHeight: `${svgPxHeight}px`,
                        maxWidth: "none",
                        display: "block",
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                      }}
                      className="select-none drop-shadow-2xl"
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

                {/* Floating Quick Zoom Overlay Buttons (Selalu Muncul di Pojok Kanan Bawah Peta di HP) */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-xl p-1.5 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.max(1.0, +(z - 0.5).toFixed(2)))}
                    className="w-8 h-8 rounded-lg bg-slate-800 active:bg-slate-700 text-amber-400 font-black text-base flex items-center justify-center border border-slate-700 cursor-pointer"
                    title="Perkecil"
                  >
                    −
                  </button>
                  <span className="px-1.5 text-[11px] font-mono font-black text-emerald-400 min-w-[44px] text-center">
                    {Math.round(mapZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.min(4.0, +(z + 0.5).toFixed(2)))}
                    className="w-8 h-8 rounded-lg bg-emerald-600 active:bg-emerald-500 text-white font-black text-base flex items-center justify-center shadow-md cursor-pointer"
                    title="Perbesar"
                  >
                    +
                  </button>
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
        {/* TAB 3: RENCANA ANGGARAN BIAYA (RAB) DENGAN SISTEM OTORISASI ADMIN     */}
        {/* ===================================================================== */}
        {activeTab === "rab" && (
          <div className="space-y-4 sm:space-y-6">
            {/* KONDISI 1: JIKA AKSES PUBLIK DIKUNCI TOTAL OLEH ADMIN & USER BELUM LOGIN */}
            {!isAdmin && !rabPublicAccess ? (
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950/40 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center max-w-2xl mx-auto space-y-5 my-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center shadow-lg">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/40">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Menu RAB Kosong & Terkunci</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Rencana Anggaran Biaya (RAB) Terkunci
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                    Seluruh rincian item penganggaran dikosongkan untuk pengunjung umum demi menjaga privasi dan keamanan dokumen. Menu RAB hanya dapat dibuka jika Admin memberikan izin akses, atau masukkan PIN Admin untuk membuka akses penuh.
                  </p>
                </div>

                {/* INLINE ADMIN PIN LOGIN FORM */}
                <form
                  onSubmit={handleAdminLogin}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-md mx-auto space-y-3.5 shadow-inner text-left"
                >
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      Masukkan PIN Admin:
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">
                      Khusus Admin Panitia
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPinVisible ? "text" : "password"}
                      value={loginPinInput}
                      onChange={(e) => {
                        setLoginPinInput(e.target.value);
                        setLoginError(null);
                      }}
                      placeholder="Ketik PIN Admin..."
                      autoComplete="current-password"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-base sm:text-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPinVisible(!showPinVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      {showPinVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {loginError && (
                    <div className="text-xs text-rose-400 font-semibold bg-rose-950/60 border border-rose-800/80 rounded-lg p-2.5">
                      ⚠️ {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="touch-manipulation w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
                  >
                    <KeyRound className="w-4 h-4 stroke-[3]" />
                    <span>Buka Akses Admin (PIN)</span>
                  </button>
                </form>

                <p className="text-[11px] text-slate-400 pt-1">
                  ℹ️ Catatan: Menu Denah 2D, Video Drone Udara, dan Studio CAD 3D tetap terbuka bebas untuk dilihat umum.
                </p>
              </div>
            ) : (
              <>
                {/* STATUS BAR: ADMIN FULL ACCESS VS GUEST READ-ONLY */}
                {isAdmin ? (
                  <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/70 border-2 border-emerald-500/50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center shrink-0">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-black text-white">
                            👑 MODE ADMIN AKTIF (AKSES PENUH)
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-slate-950">
                            Terotentikasi
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                          Anda memiliki izin penuh untuk <strong>mengedit harga/jumlah</strong>, <strong>menambah item anggaran</strong>, serta mengatur visibilitas publik.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => handleTogglePublicAccess(!rabPublicAccess)}
                        className={`touch-manipulation px-4 py-2 rounded-xl text-xs font-black border transition flex items-center gap-1.5 cursor-pointer shadow-lg ${
                          rabPublicAccess
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300"
                            : "bg-rose-600 hover:bg-rose-500 text-white border-rose-300"
                        }`}
                        title="Klik untuk mengubah status: jika hijau, user lain bisa melihat (Read-Only). Jika merah, user lain terkunci."
                      >
                        {rabPublicAccess ? (
                          <>
                            <Eye className="w-4 h-4 text-white" />
                            <span>🟢 Izin Publik: Boleh Lihat (Read-Only)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-white" />
                            <span>🔴 Izin Publik: Kunci (User Terkunci)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            const url = `${window.location.origin}${window.location.pathname}?rab=open`;
                            navigator.clipboard.writeText(url).then(() => {
                              showToast("📋 Link RAB Boleh Lihat disalin! Siap dibagikan ke pengunjung.");
                            }).catch(() => {
                              showToast("📋 Link: " + url);
                            });
                          }
                        }}
                        className="touch-manipulation px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5 cursor-pointer"
                        title="Salin link terbuka langsung tanpa PIN untuk dibagikan ke pengunjung"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Salin Link Publik</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewPinInput("");
                          setShowChangePinModal(true);
                        }}
                        className="touch-manipulation px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                        title="Ubah PIN Admin"
                      >
                        <Settings className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ubah PIN</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="touch-manipulation px-3.5 py-2 rounded-xl text-xs font-black bg-rose-600/90 hover:bg-rose-500 active:bg-rose-700 text-white transition flex items-center gap-1.5 cursor-pointer shadow-md"
                        title="Kunci kembali & keluar ke Mode Tamu"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Kunci & Keluar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                          <span>👀 Mode Tamu / Publik (Hanya Lihat)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Read-Only (Bebas PIN)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Admin telah mengizinkan Anda melihat seluruh rincian RAB tanpa PIN. Dokumen ini berstatus <strong>Hanya Lihat (Read-Only)</strong> — penambahan atau pengeditan item hanya dapat dilakukan oleh Admin.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginError(null);
                        setShowLoginModal(true);
                      }}
                      className="touch-manipulation w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Login Admin (Edit / Tambah)</span>
                    </button>
                  </div>
                )}

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
                        {isAdmin ? (
                          <>
                            Anda berada dalam <strong>Mode Admin</strong>: dapat mengedit harga, jumlah, maupun mengetik langsung di kolom Total.
                          </>
                        ) : (
                          <>
                            Anda berada dalam <strong>Mode Tamu (Hanya Lihat)</strong>: seluruh angka anggaran terkunci aman dari perubahan yang tidak disengaja.
                          </>
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
                      {isAdmin ? (
                        <button
                          onClick={scrollToAddRabSection}
                          className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-[11px] sm:text-xs font-black rounded-xl shadow-lg border border-amber-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Tambah Item</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setLoginError(null);
                            setShowLoginModal(true);
                          }}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] sm:text-xs font-bold rounded-xl border border-amber-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Masuk Sebagai Admin untuk Menambah Item"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Login Admin</span>
                        </button>
                      )}

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

                      {isAdmin && (
                        <button
                          onClick={resetRabToDefault}
                          className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[11px] sm:text-xs font-medium rounded-xl border border-rose-800/40 transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Kembalikan ke 14 item default (Admin)"
                        >
                          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2 Summary Cards with Base vs Additional Breakdown (Tanpa Potongan EO) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5">
                    <div className="bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                      <span className="text-[11px] sm:text-xs text-slate-400 block font-medium">
                        Subtotal Rincian ({rabItems.length} Item Total)
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5 block">
                        {formatRupiah(rawSubtotal)}
                      </span>
                      <div className="mt-1 space-y-0.5 text-[10px] sm:text-[11px]">
                        <span className="text-slate-400 block">
                          • 14 Item Utama: <strong className="text-slate-200">{formatRupiah(baseBudgetSubtotal)}</strong>
                        </span>
                        {additionalItemsCount > 0 ? (
                          <span className="text-emerald-400 font-bold block">
                            • +{additionalItemsCount} Item Tambahan: <strong>+{formatRupiah(additionalBudgetTotal)}</strong>
                          </span>
                        ) : (
                          <span className="text-slate-500 italic block">
                            • Belum ada item tambahan baru
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-950/80 to-slate-950 p-3.5 sm:p-4 rounded-2xl border border-amber-500/50 shadow-lg">
                      <span className="text-[11px] sm:text-xs text-amber-300 block font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>Total Keseluruhan RAB</span>
                        <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                          Otomatis Terhitung
                        </span>
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

                {/* =============================================================== */}
                {/* ➕ MENU KHUSUS: FORM TAMBAH ITEM ANGGARAN (ADMIN ONLY)           */}
                {/* =============================================================== */}
                <div
                  ref={addRabSectionRef}
                  className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/30 border-2 border-amber-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4"
                >
                  {isAdmin ? (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 border border-amber-500/40">
                            <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Menu Tambah Item Anggaran Baru</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                            <span>➕ Formulir Input Kebutuhan Anggaran Tambahan</span>
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                            Ketik nama item, harga, dan jumlah di bawah ini. Tambahan anggaran akan <strong>otomatis terhitung</strong> ke dalam Subtotal, Grand Total, dan dokumen proposal cetak.
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0">
                          ⚡ Real-Time Auto-Calc
                        </span>
                      </div>

                      {/* QUICK PRESET CHIPS */}
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300/90 block mb-2">
                          ⚡ Pilihan Cepat Kebutuhan EO Populer (Sekali Ketuk untuk Mengisi Form):
                        </span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {OPTIONAL_EO_ITEMS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleApplyPreset(preset)}
                              className="touch-manipulation px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold bg-slate-800/90 hover:bg-amber-950/60 active:bg-amber-900/60 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-amber-200 transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{preset.name}</span>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                ({formatRupiah(preset.price)})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* INPUT FORM FIELDS */}
                      <form onSubmit={handleAddNewCustomItem} className="space-y-3.5 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          {/* Nama Item */}
                          <div className="sm:col-span-5">
                            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-300 font-bold block mb-1">
                              Nama Item Anggaran <span className="text-rose-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={newItemName}
                              onChange={(e) => setNewItemName(e.target.value)}
                              placeholder="Contoh: Konsumsi Tamu VIP & Guru"
                              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white font-semibold text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none transition placeholder:text-slate-500"
                            />
                          </div>

                          {/* Harga Satuan */}
                          <div className="sm:col-span-3">
                            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-300 font-bold block mb-1">
                              Harga Satuan (Rp) <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-slate-400 font-bold text-xs pointer-events-none">
                                Rp
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={
                                  typeof newItemPrice === "number" && newItemPrice > 0
                                    ? newItemPrice.toLocaleString("id-ID")
                                    : ""
                                }
                                placeholder="0"
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/[^0-9]/g, "");
                                  setNewItemPrice(raw ? parseInt(raw, 10) : "");
                                }}
                                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-amber-300 font-bold text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 text-right outline-none transition placeholder:text-slate-500"
                              />
                            </div>
                          </div>

                          {/* Jumlah (Qty) */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-300 font-bold block mb-1 text-center sm:text-left">
                              Jumlah (Qty)
                            </label>
                            <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => setNewItemQty((q) => Math.max(1, q - 1))}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center cursor-pointer shrink-0"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={newItemQty}
                                onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                className="w-full bg-transparent text-center font-bold text-cyan-300 text-xs sm:text-sm outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => setNewItemQty((q) => q + 1)}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center cursor-pointer shrink-0"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Satuan */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-300 font-bold block mb-1">
                              Satuan
                            </label>
                            <input
                              type="text"
                              value={newItemUnit}
                              onChange={(e) => setNewItemUnit(e.target.value)}
                              placeholder="paket / set / buah"
                              className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 text-center outline-none transition"
                            />
                          </div>
                        </div>

                        {/* LIVE AUTOMATIC CALCULATION PREVIEW BOX */}
                        {(() => {
                          const unitVal = typeof newItemPrice === "number" ? Math.max(0, newItemPrice) : 0;
                          const qtyVal = Math.max(1, newItemQty || 1);
                          const previewSubtotal = unitVal * qtyVal;
                          const previewNewGrandTotal = grandTotal + previewSubtotal;

                          return (
                            <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Calculator className="w-4 h-4 text-amber-400 shrink-0" />
                                  <span className="text-xs font-bold text-slate-300">
                                    Kalkulasi Subtotal Item Ini:
                                  </span>
                                  <span className="font-mono font-extrabold text-sm text-emerald-400">
                                    {formatRupiah(previewSubtotal)}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    ({formatRupiah(unitVal)} × {qtyVal} {newItemUnit || "paket"})
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Total Anggaran Berjalan:{" "}
                                  <span className="text-slate-300 font-semibold">{formatRupiah(grandTotal)}</span>
                                  {" ➔ "}
                                  <span className="text-amber-400 font-bold">
                                    Menjadi {formatRupiah(previewNewGrandTotal)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full md:w-auto">
                                <button
                                  type="submit"
                                  className="touch-manipulation w-full md:w-auto px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-950/60 transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
                                >
                                  <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                                  <span>Tambahkan ke Anggaran & Hitung Otomatis</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </form>
                    </>
                  ) : (
                    /* JIKA TAMU: FORM TERKUNCI DENGAN TOMBOL LOGIN ADMIN */
                    <div className="py-4 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Formulir Tambah Anggaran Terkunci untuk Tamu
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                          Untuk menambahkan item kebutuhan baru yang otomatis terhitung ke dalam anggaran, silakan masuk menggunakan PIN Admin.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginError(null);
                          setShowLoginModal(true);
                        }}
                        className="touch-manipulation px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs transition inline-flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 stroke-[3]" />
                        <span>Buka Kunci Admin untuk Menambah Item</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* MOBILE-FRIENDLY CARD VIEW (Tampil Otomatis di Layar HP) */}
                <div className="md:hidden space-y-3">
                  {rabItems.map((item, index) => {
                    const subtotal = (item.qty || 0) * (item.price || 0);
                    const isAdditional = !DEFAULT_RAB_IDS.has(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`bg-slate-900/95 border rounded-2xl p-3.5 shadow-lg space-y-2.5 ${
                          isAdditional ? "border-amber-500/50 bg-amber-950/10" : "border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs shrink-0">
                              No. {index + 1}
                            </span>
                            {isAdditional && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
                                Tambahan Baru
                              </span>
                            )}
                          </div>
                          {isAdmin ? (
                            <button
                              onClick={() => deleteRabItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition cursor-pointer"
                              title="Hapus item (Admin)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="p-1 text-slate-600" title="Terkunci (Hanya Lihat)">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                            Nama Item
                          </label>
                          {isAdmin ? (
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                updateItemField(item.id, "name", e.target.value)
                              }
                              className="w-full bg-slate-950 border border-slate-700/80 focus:border-amber-400 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none"
                            />
                          ) : (
                            <div className="w-full bg-slate-950/60 border border-slate-800/80 text-white font-bold text-xs rounded-xl px-3 py-2 select-all">
                              {item.name}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6">
                            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                              Harga (Rp)
                            </label>
                            {isAdmin ? (
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
                            ) : (
                              <div className="w-full bg-slate-950/60 border border-slate-800/80 text-amber-300 font-bold text-xs rounded-xl px-2.5 py-2 text-right">
                                {formatRupiah(item.price)}
                              </div>
                            )}
                          </div>

                          <div className="col-span-3">
                            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1 text-center">
                              Jumlah
                            </label>
                            {isAdmin ? (
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
                            ) : (
                              <div className="w-full bg-slate-950/60 border border-slate-800/80 text-cyan-300 font-bold text-xs rounded-xl px-2 py-2 text-center">
                                {item.qty}
                              </div>
                            )}
                          </div>

                          <div className="col-span-3">
                            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1 text-center">
                              Satuan
                            </label>
                            {isAdmin ? (
                              <input
                                type="text"
                                value={item.unit}
                                onChange={(e) =>
                                  updateItemField(item.id, "unit", e.target.value)
                                }
                                className="w-full bg-slate-950 border border-slate-700/80 focus:border-indigo-400 text-slate-300 text-xs rounded-xl px-2 py-2 text-center outline-none"
                              />
                            ) : (
                              <div className="w-full bg-slate-950/60 border border-slate-800/80 text-slate-300 text-xs rounded-xl px-2 py-2 text-center">
                                {item.unit}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            Total Item:
                          </span>
                          {isAdmin ? (
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
                          ) : (
                            <div className="text-emerald-300 font-black text-xs bg-slate-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                              {formatRupiah(subtotal)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Bottom Quick Add Button on Mobile */}
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={scrollToAddRabSection}
                        className="touch-manipulation flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>➕ Form Tambah Item Anggaran</span>
                      </button>
                      <button
                        type="button"
                        onClick={addNewRabItem}
                        className="touch-manipulation px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                        title="Tambah Baris Kosong Cepat"
                      >
                        <Plus className="w-4 h-4 text-emerald-400" />
                        <span>Baris Cepat</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setLoginError(null);
                        setShowLoginModal(true);
                      }}
                      className="touch-manipulation w-full py-3 px-4 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer hover:bg-slate-800"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Masuk Sebagai Admin untuk Menambah Item</span>
                    </button>
                  )}

                  {/* Mobile Footer Total Card */}
                  <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-300">
                      <span>14 Item Pokok:</span>
                      <span className="font-semibold text-slate-200">{formatRupiah(baseBudgetSubtotal)}</span>
                    </div>
                    {additionalItemsCount > 0 && (
                      <div className="flex justify-between items-center text-xs text-emerald-400">
                        <span>+{additionalItemsCount} Item Tambahan Baru:</span>
                        <span className="font-bold">+{formatRupiah(additionalBudgetTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm font-black text-amber-400 pt-2 border-t border-slate-800">
                      <span>TOTAL ANGGARAN (OTOMATIS):</span>
                      <span className="text-lg">{formatRupiah(grandTotal)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 italic text-right truncate">
                      &ldquo;{terbilangText}&rdquo;
                    </div>
                  </div>
                </div>

                {/* DESKTOP EXCEL-STYLE RAB TABLE */}
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
                          const isAdditional = !DEFAULT_RAB_IDS.has(item.id);

                          return (
                            <tr
                              key={item.id}
                              className={`hover:bg-slate-800/40 transition ${
                                isAdditional ? "bg-amber-950/10" : ""
                              }`}
                            >
                              <td className="p-3 text-center text-slate-400 font-bold">
                                {index + 1}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  {isAdmin ? (
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) =>
                                        updateItemField(item.id, "name", e.target.value)
                                      }
                                      className={`w-full bg-slate-950/70 border focus:border-amber-400 text-white font-semibold text-xs rounded-xl px-3 py-2 outline-none ${
                                        isAdditional
                                          ? "border-amber-500/60"
                                          : "border-slate-700/70"
                                      }`}
                                    />
                                  ) : (
                                    <span className="font-semibold text-white select-all">
                                      {item.name}
                                    </span>
                                  )}
                                  {isAdditional && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                      Baru
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                {isAdmin ? (
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
                                ) : (
                                  <span className="font-mono font-bold text-amber-300">
                                    {formatRupiah(item.price)}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                {isAdmin ? (
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
                                ) : (
                                  <span className="font-bold text-cyan-300">
                                    {item.qty.toLocaleString("id-ID")}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                {isAdmin ? (
                                  <input
                                    type="text"
                                    value={item.unit}
                                    onChange={(e) =>
                                      updateItemField(item.id, "unit", e.target.value)
                                    }
                                    className="w-20 bg-slate-950/70 border border-slate-700/70 focus:border-indigo-400 text-slate-300 text-xs rounded-xl px-2 py-2 text-center outline-none"
                                  />
                                ) : (
                                  <span className="text-slate-300">{item.unit}</span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                {isAdmin ? (
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
                                ) : (
                                  <span className="font-black text-emerald-300 font-mono">
                                    {formatRupiah(subtotal)}
                                  </span>
                                )}
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
                                {isAdmin ? (
                                  <button
                                    onClick={() => deleteRabItem(item.id)}
                                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition cursor-pointer"
                                    title="Hapus baris (Admin)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="text-slate-600" title="Terkunci">
                                    <Lock className="w-3.5 h-3.5 mx-auto" />
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-900/95 font-semibold border-t border-slate-800 text-xs text-slate-300">
                          <td colSpan={5} className="p-3 text-right uppercase">
                            Subtotal 14 Item Pokok:
                          </td>
                          <td className="p-3 text-right font-bold text-slate-200">
                            {formatRupiah(baseBudgetSubtotal)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                        {additionalItemsCount > 0 && (
                          <tr className="bg-amber-950/20 font-semibold border-t border-slate-800 text-xs text-emerald-300">
                            <td colSpan={5} className="p-3 text-right uppercase">
                              + Tambahan {additionalItemsCount} Item Baru:
                            </td>
                            <td className="p-3 text-right font-black text-emerald-400">
                              +{formatRupiah(additionalBudgetTotal)}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        )}
                        <tr className="bg-slate-900/90 font-semibold border-t border-slate-800 text-xs text-slate-300">
                          <td colSpan={5} className="p-3 text-right uppercase">
                            Subtotal Seluruh Rincian ({rabItems.length} Item):
                          </td>
                          <td className="p-3 text-right font-bold text-slate-200">
                            {formatRupiah(rawSubtotal)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                        <tr className="bg-slate-950 font-bold border-t-2 border-slate-700 text-sm">
                          <td
                            colSpan={5}
                            className="p-4 text-right text-slate-200 uppercase tracking-wide"
                          >
                            Total Keseluruhan Anggaran (RAB Otomatis):
                          </td>
                          <td className="p-4 text-right text-xl font-black text-amber-400">
                            {formatRupiah(grandTotal)}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* DESKTOP TABLE ACTION FOOTER */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-xs text-slate-400">
                      {isAdmin ? (
                        <>💡 Tip: Gunakan <strong className="text-amber-400">&ldquo;➕ Menu Tambah Item Anggaran&rdquo;</strong> di atas untuk memasukkan kebutuhan baru dengan kalkulasi real-time.</>
                      ) : (
                        <>🔒 Anda melihat dalam Mode Tamu. Rincian terlindungi dari perubahan yang tidak berwenang.</>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin ? (
                        <>
                          <button
                            type="button"
                            onClick={scrollToAddRabSection}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                            <span>➕ Form Tambah Item Baru</span>
                          </button>
                          <button
                            type="button"
                            onClick={addNewRabItem}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-emerald-400" />
                            <span>Tambah Baris Cepat</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setLoginError(null);
                            setShowLoginModal(true);
                          }}
                          className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Masuk Sebagai Admin untuk Mengedit</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL LOGIN ADMIN PIN ================= */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Masuk Mode Admin RAB
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Otorisasi Khusus Edit & Tambah Anggaran
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError(null);
                  setLoginPinInput("");
                }}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Masukkan PIN Admin:
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPinVisible ? "text" : "password"}
                    autoFocus
                    value={loginPinInput}
                    onChange={(e) => {
                      setLoginPinInput(e.target.value);
                      setLoginError(null);
                    }}
                    placeholder="Ketik PIN Admin..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white font-mono font-bold text-center tracking-widest text-lg rounded-xl py-3 px-10 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinVisible((v) => !v)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPinVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginError && (
                  <p className="text-xs text-rose-400 font-bold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> <span>{loginError}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  Hanya panitia pelaksana/admin yang berwenang mengubah angka anggaran.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError(null);
                    setLoginPinInput("");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Buka Akses Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL UBAH PIN ADMIN ================= */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Ubah PIN Admin RAB
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ganti PIN keamanan untuk melindungi RAB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePinModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Masukkan PIN Baru (Minimal 4 Karakter):
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Contoh: 2026 atau pgri79"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 text-white font-mono font-bold text-center text-lg rounded-xl py-3 px-4 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  PIN baru akan disimpan otomatis ke konfigurasi cloud repository.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  <span>Simpan PIN Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <PrintProposalBooklet
        rabItems={rabItems}
        rabDiscount={rabDiscount}
        formatRupiah={formatRupiah}
        terbilangRupiah={terbilangRupiah}
        isRabAccessible={isAdmin || rabPublicAccess}
      />
    </>
  );
}
