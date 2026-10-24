import { NextResponse } from "next/server";
import defaultRabConfig from "@/data/rab-config.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CLOUD_KV_KEY = "c84fpy47";

export async function GET() {
  // Always fetch fresh from cloud KV with zero cache
  try {
    const res = await fetch(
      `https://keyvalue.immanuel.co/api/KeyVal/GetValue/${CLOUD_KV_KEY}/rab_public_access`,
      { cache: "no-store", headers: { "Cache-Control": "no-cache" } }
    );
    if (res.ok) {
      const text = (await res.text()).trim().toLowerCase().replace(/"/g, "");
      if (text === "true" || text === "false") {
        return NextResponse.json(
          { rabPublicAccess: text === "true" },
          { headers: { "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate" } }
        );
      }
    }
  } catch (err) {}

  // Fallback to bundled JSON config
  const fallback =
    typeof defaultRabConfig.rabPublicAccess === "boolean"
      ? defaultRabConfig.rabPublicAccess
      : true;
  return NextResponse.json(
    { rabPublicAccess: fallback },
    { headers: { "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate" } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAccess = Boolean(body.rabPublicAccess);

    // MUST await cloud update so Vercel does not freeze lambda before request completes!
    await fetch(
      `https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${CLOUD_KV_KEY}/rab_public_access/${newAccess}`,
      { method: "POST" }
    );

    return NextResponse.json(
      { success: true, rabPublicAccess: newAccess },
      { headers: { "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
