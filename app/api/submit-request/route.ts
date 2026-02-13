import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 환경 변수 확인 로그
console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗");
console.log(
  "SERVICE_ROLE_KEY:",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓" : "✗"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request:", {
      phone: body.phone_number,
      theme: body.theme,
    });

    const { phone_number, theme, answers, style, genre } = body;

    // 휴대폰 번호 유효성 검사
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json(
        { success: false, error: "올바른 휴대폰 번호 형식이 아닙니다." },
        { status: 400 }
      );
    }

    console.log("Inserting to database...");

    // 노래 요청 생성
    const { data: songRequest, error: requestError } = await supabase
      .from("song_requests")
      .insert({
        phone_number,
        theme,
        answers,
        style,
        genre,
        status: "pending",
      })
      .select()
      .single();

    if (requestError) {
      console.error("Database error:", requestError);
      throw requestError;
    }

    console.log("Insert successful:", songRequest.id);

    return NextResponse.json({
      success: true,
      data: { requestId: songRequest.id },
    });
  } catch (error: any) {
    console.error("Error in submit-request API:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
