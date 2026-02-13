import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateSongPrompt(data: {
  theme: string;
  answers: Record<string, string>;
  style: string;
  genre: string;
}) {
  const { theme, answers, style, genre } = data;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash", // pro 대신 flash를 사용하세요.
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.9,
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          songTitle: { type: SchemaType.STRING },
          lyrics: { type: SchemaType.STRING },
          styleTags: { type: SchemaType.STRING },
        },
        required: ["songTitle", "lyrics", "styleTags"],
      },
    },
  });

  const prompt = `
# Task: 사용자의 삶이 녹아 있는 고품질 가사와 음악 생성용 스타일 태그 생성
# [Input 데이터]
- 주제: ${theme}
- 사용자 답변 내역:
${Object.entries(answers)
  .map(([q, a]) => `질문: ${q}\n답변: ${a}`)
  .join("\n")}
- 희망 장르: ${genre}
- 희망 분위기: ${style}

# Role: 5070 세대 공감 전문 서정 시인 및 작사가

당신은 대한민국 5070 세대의 삶과 애환, 사랑과 그리움을 깊이 있게 이해하는 전문 작사가입니다. 사용자가 제공한 짧은 단어와 문장을 바탕으로, 한 편의 수필 같은 서정적인 가사를 작성합니다.

# Guidelines:
1. **Target Audience**: 5070 세대가 공감할 수 있는 단어와 구어체(-했지요, -구려, -네요)를 사용하세요.
2. **Literary Expansion**: 사용자의 짧은 답변을 그대로 쓰지 마세요. 당시의 계절감, 온도, 공기의 냄새, 시각적 이미지를 동원하여 문학적으로 확장하세요. 또한 희망 장르와 희망 분위기를 고려한 가사를 작성하세요.
3. **Storytelling (기승전결)**: 가사 구조(Verse 1- Chorus - Verse 2 - Bridge - Chorus - Outro)를 엄격히 지키며, 실제 생성물에도 []안에 표기합니다. 사용자의 경험이 하나의 완성된 이야기로 흐르도록 배치하세요.

# Musical Style Tag Rules:
- Suno AI용 영문 태그 (korean + 장르 필수 포함).
반드시 정해진 JSON 형식으로만 답변하세요.`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      songTitle: `${theme}의 노래`,
      lyrics: `[Verse 1]\n추억이 담긴 노래가 곧 완성됩니다.`,
      styleTags: `korean ${genre.toLowerCase()}, emotional`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ✅ [핵심 수정] body에서 requestId를 꺼내옵니다.
    const { requestId, theme, answers, style, genre } = body;

    // AI 가사 생성 요청
    const songData = await generateSongPrompt({ theme, answers, style, genre });

    // 3. DB 저장 (requestId 변수 사용 가능)
    const { error: insertError } = await supabase.from("song_prompts").insert({
      request_id: requestId,
      song_title: songData.songTitle,
      lyrics: songData.lyrics,
      style_tags: songData.styleTags,
    });

    if (insertError) throw insertError;

    // 4. 요청 상태 업데이트
    const { error: updateError } = await supabase
      .from("song_requests")
      .update({ status: "completed" })
      .eq("id", requestId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, data: songData });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
