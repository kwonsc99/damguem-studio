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

    // 1. 프론트엔드에서 보낸 모든 데이터 추출
    const {
      phone_number,
      theme,
      answers,
      style,
      genre,
      vocalGender, // 추가
      preferredArtist, // 추가
    } = body;

    console.log("Received request:", {
      phone: phone_number,
      theme: theme,
      vocal: vocalGender,
      artist: preferredArtist,
    });

    // 2. 휴대폰 번호 유효성 검사
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json(
        { success: false, error: "올바른 휴대폰 번호 형식이 아닙니다." },
        { status: 400 }
      );
    }

    console.log("Inserting to database...");

    // 3. 노래 요청 생성 (DB 컬럼명에 맞춰 매핑)
    const { data: songRequest, error: requestError } = await supabase
      .from("song_requests")
      .insert({
        phone_number,
        theme,
        answers,
        style,
        genre,
        vocal_gender: vocalGender || "female", // DB 컬럼: vocal_gender
        preferred_artist: preferredArtist || "", // DB 컬럼: preferred_artist
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
