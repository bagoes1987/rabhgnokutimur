import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);
const CONFIG_PATH = path.join(process.cwd(), "src", "data", "rab-config.json");

export async function GET() {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal membaca konfigurasi RAB", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rabItems, rabDiscount, rabPublicAccess, adminPin, commitMessage } = body;

    let existingData: any = {};
    try {
      const currentRaw = await fs.readFile(CONFIG_PATH, "utf-8");
      existingData = JSON.parse(currentRaw);
    } catch {}

    const payload = {
      rabItems: Array.isArray(rabItems) ? rabItems : (existingData.rabItems || []),
      rabDiscount: typeof rabDiscount === "number" ? rabDiscount : (existingData.rabDiscount ?? 0),
      rabPublicAccess: typeof rabPublicAccess === "boolean" ? rabPublicAccess : (existingData.rabPublicAccess ?? true),
      adminPin: typeof adminPin === "string" && adminPin.trim() ? adminPin.trim() : (existingData.adminPin || "1987"),
      lastUpdated: new Date().toISOString(),
    };

    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
    await fs.writeFile(CONFIG_PATH, JSON.stringify(payload, null, 2), "utf-8");

    // Check git status and push if there are changes
    const { stdout: statusOut } = await execAsync("git status --porcelain", {
      cwd: process.cwd(),
    });

    if (!statusOut.trim()) {
      return NextResponse.json({
        success: true,
        pushed: false,
        message: "Tidak ada perubahan file baru (GitHub sudah paling mutakhir).",
        timestamp: new Date().toISOString(),
      });
    }

    const msg =
      commitMessage ||
      `Auto-sync update RAB & Desain (${new Date().toLocaleString("id-ID")})`;

    await execAsync("git add .", { cwd: process.cwd() });
    await execAsync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, {
      cwd: process.cwd(),
    });
    await execAsync("git push origin main", { cwd: process.cwd() });

    return NextResponse.json({
      success: true,
      pushed: true,
      message: "Perubahan berhasil di-commit & di-push otomatis ke GitHub!",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Git Auto-Sync Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal melakukan auto-push ke GitHub",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
