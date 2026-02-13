import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    console.log("Checking admin for user:", userId);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    console.log("Profile result:", profile, "Error:", error);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { isAdmin: false, error: error.message },
        { status: 200 }
      );
    }

    return NextResponse.json({
      isAdmin: profile?.is_admin === true,
    });
  } catch (error: any) {
    console.error("Check admin error:", error);
    return NextResponse.json(
      { isAdmin: false, error: error.message },
      { status: 500 }
    );
  }
}
