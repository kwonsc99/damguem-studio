import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

console.log("🔧 Initializing admin requests API...");
console.log(
  "📍 SUPABASE_URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗"
);
console.log(
  "🔑 SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓" : "✗"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";
export const revalidate = 0; // 추가: 캐시를 강제로 비활성화
export async function GET() {
  console.log("📥 GET /api/admin/requests called");

  try {
    console.log("🔍 Querying database...");

    const { data: requestsData, error } = await supabase
      .from("song_requests")
      .select(
        `
        *,
        prompt:song_prompts(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Database error:", error);
      throw error;
    }

    console.log("✅ Query successful, rows:", requestsData?.length || 0);

    const formatted =
      requestsData?.map((req) => ({
        ...req,
        prompt:
          Array.isArray(req.prompt) && req.prompt.length > 0
            ? req.prompt[0]
            : null,
      })) || [];

    console.log("📦 Returning formatted data");

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("💥 Error fetching requests:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
