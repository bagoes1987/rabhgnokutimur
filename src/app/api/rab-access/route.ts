import { NextResponse } from "next/server";
import defaultRabConfig from "@/data/rab-config.json";

declare global {
  var __rabPublicAccess: boolean | undefined;
}

const CLOUD_KV_KEY = "c84fpy47";

export async function GET() {
  // 1. If in-memory is already set, return it immediately
  if (typeof globalThis.__rabPublicAccess === "boolean") {
    return NextResponse.json({ rabPublicAccess: globalThis.__rabPublicAccess });
  }

  // 2. Fetch from cloud KV
  try {
    const res = await fetch(
      `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${CLOUD_KV_KEY}/rab_public_access`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const text = (await res.text()).trim().toLowerCase().replace(/"/g, "");
      if (text === "true" || text === "false") {
        globalThis.__rabPublicAccess = text === "true";
        return NextResponse.json({ rabPublicAccess: globalThis.__rabPublicAccess });
      }
    }
  } catch (err) {}

  // 3. Fallback to bundled JSON config
  const fallback =
    typeof defaultRabConfig.rabPublicAccess === "boolean"
      ? defaultRabConfig.rabPublicAccess
      : true;
  globalThis.__rabPublicAccess = fallback;
  return NextResponse.json({ rabPublicAccess: fallback });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAccess = Boolean(body.rabPublicAccess);
    globalThis.__rabPublicAccess = newAccess;

    // Update cloud KV in background
    fetch(
      `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${CLOUD_KV_KEY}/rab_public_access/${newAccess}`,
      { method: "POST" }
    ).catch(() => {});

    return NextResponse.json({ success: true, rabPublicAccess: newAccess });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
