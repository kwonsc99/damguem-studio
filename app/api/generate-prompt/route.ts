import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Theme, Genre } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const GENRE_RULES: Record<string, string> = {
  발라드:
    "- 어미 처리: '-네요', '-군요', '-어', '-요' 등 부드럽고 여운이 남는 종결어미 사용.\n" +
    "- 서사: 1인칭 시점의 세밀한 심리 묘사와 독백 중심. 문학적이고 섬세한 단어 선택.",
  트로트:
    "- 리듬: 4/4박자의 뽕짝 리듬감이 가사에서 느껴지도록 '어절'의 길이를 일정하게 맞춤.\n" +
    "- 특징: '꺾기'가 들어갈 구간에 감탄사나 반복 어구를 배치.\n" +
    "- 정서: '정', '눈물', '님' 등 직설적이고 통속적인 감정 단어 활용.",
  포크:
    "- 키워드: '바람', '길', '나무', '노을' 등 자연과 아날로그 감성의 오브제 활용.\n" +
    "- 스타일: 기교 없는 담백한 구어체. 통기타 반주에 어울리는 소박하고 진솔한 이야기.",
  "클래식/가곡":
    "- 문체: 우아하고 격조 높은 문어체. '-오', '-리라', '-도다' 같은 고전적 어미 활용.\n" +
    "- 서사: 대자연이나 숭고한 정신에 비유한 웅장한 가사. 비속어나 신조어 절대 금지.",
  팝:
    "- 훅(Hook): 'Tell me', 'Tonight', '다시' 등 짧고 명확한 영단어를 섞어 세련된 느낌 강조.\n" +
    "- 스타일: 트렌디하고 일상적인 표현. 후렴구에서 가사가 쉽고 중독적으로 반복됨.",
  록:
    "- 에너지: 강렬한 동사(터지다, 달리다, 외치다)를 사용하여 폭발적인 에너지 전달.\n" +
    "- 특징: 뜨거운 열정이나 깊은 고독을 날카롭고 거친 단어로 묘사.",
  재즈:
    "- 분위기: '도시의 밤', '커피', '안개' 등 도회적인 무드의 단어 사용.\n" +
    "- 스타일: 문장의 길이를 변칙적으로 배치하여 엇박의 리듬감(싱코페이션) 표현.",
  힙합:
    "- 라임: 각 행 끝의 각운을 명확하게 맞춤 (예: -했지/-갔지/-맞지).\n" +
    "- 특징: 본인의 서사를 자랑하거나 솔직한 성찰을 담은 비유적 표현(펀치라인) 활용.",
};

export async function generateSongPrompt(data: {
  theme: Theme;
  answers: Record<string, string>;
  style: string;
  genre: Genre;
  vocalGender: "male" | "female";
  preferredArtist: string;
}) {
  const { theme, answers, style, genre, vocalGender, preferredArtist } = data;

  // 장르별 규칙 추출
  const genreSpecificGuide =
    GENRE_RULES[genre] ||
    "- 리듬감: 각 행의 글자 수를 일정하게 맞추어 안정적인 리듬 형성.";

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.8,
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
  
  # Role
  당신은 사람의 기억을 음악으로 번역하는 대한민국 최고의 스타 작사가이자 프로듀서입니다.
  사용자의 사연을 바탕으로, '진짜 아티스트'의 노래처럼 느껴지는 고퀄리티 가사를 작성하세요.
  
  ---
  
  
  # 1. Input Context
  - 주제: ${theme}
  - 희망 장르: ${genre}
  - 희망 분위기: ${style}
  - 사용자 인터뷰 답변:
  ${Object.entries(answers)
    .map(([q, a]) => `질문: ${q}\n답변: ${a}`)
    .join("\n")}

  # 2. Vocal Persona & Style Guide
  - 성별: ${vocalGender === "female" ? "여성 보컬" : "남성 보컬"}
  - 보컬 스타일 타겟: "${preferredArtist}" 
    (직접적인 이름은 언급하지 마세요. 이 아티스트의 발성 특징, 감정 전달 방식, 음색의 질감을 분석하여 가사 어투와 styleTags에 녹여내세요.)
  
  ---
  
  # 3. Creative Mission
  
  사용자의 짧은 답변 속에서 사용자의 감정이나 경험을 추론하여,
  "AI가 만든 노래"가 아니라 "누군가의 인생에서 실제로 존재했을 법한 노래"처럼 느껴져야 합니다.
  
  ---
  
  # 4.Writing Principles
  
  ## 1. Emotional Interpretation (가장 중요)
  - 답변을 그대로 반복하지 마세요.
  - 말하지 않은 감정까지 추론하여 표현하세요.
  - 과장된 문장보다 진짜 사람이 쓸 법한 언어를 사용하세요.
  - 사용자가 선택한 희망 장르와 희망 분위기를 고려하세요.
  - 일상적인 단어를 사용한 일기 같은 문체, 동화 같은 비유를 활용하세요.
  
  ## 2. Cinematic Expansion
  - 계절, 빛, 온도, 공기, 소리, 냄새 등 감각적 요소를 적극 활용하세요.
  - 장면이 눈앞에 그려지도록 작성하세요.
  
  ## 3. Personal Authenticity
  - 흔한 위로 문장, 일반적인 사랑 노래 표현을 피하세요.
  - 반드시 개인적인 디테일이 느껴지도록 만드세요.
  
  ## 4. Story Structure (엄격 준수)
  아래 구조를 반드시 지키세요:
  
  [Intro(Instrumental)] 
  [Verse 1]
  [Pre-Chorus]
  [Chorus]
  [Interlude(Instrumental)] 
  [Verse 2]
  [Pre-Chorus]
  [Chorus]
  [Bridge]
  [Chorus]
  [Outro]
  
  각 섹션 제목을 []로 표기합니다.
  
  모든 가사 줄 끝에는 반드시 \n 을 포함하세요.
  
  ## 5. Musical Alignment
  - 선택된 장르(${genre})와 분위기(${style})가
    리듬, 단어 선택, 감정 밀도에 자연스럽게 반영되어야 합니다.

  
  ## 6. Lyrics structure
  라임(Rhyme) 가이드: 각 행의 끝을 특정 모음(예: ㅏ/ㅗ)이나 일관된 어미(-하네요/-해요)로 맞춰 운율을 형성할 것.
  훅(Hook)의 변주: Chorus의 마지막 줄은 앞의 반복을 깨뜨리는 가사로 배치하여 드라마틱한 효과를 줄 것.
  음절 수 맞춤: AI가 노래하기 편하도록 각 행의 음절 수를 일정하게(예: 8~10자 / 8~10자) 조절할 것.

  ## 7. Genre-Specific Lyrics Rules (엄격 준수)
  ${genreSpecificGuide}
  
  ---
  
  # Musical Style Tags (Suno AI)
  
  - 영어로 작성
  - 반드시 포함:
    - 선택 장르 기반 태그
    - 감정/분위기 태그
    - 보컬 스타일 태그
    - 악기 구성 태그
    - BPM 태그
    - 가이드: "${preferredArtist}"의 느낌을 영문 형용사로 변환하여 포함할 것 (예: airy, husky, soulful, powerful).
  
  ---
  
  # Output Format (STRICT)
  
  반드시 아래 JSON 형식만 출력하세요:
  
  {
    "songTitle": "...",
    "lyrics": "...",
    "style_tags": "tag1, tag2, tag3"
  }
  
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 1. 응답 텍스트에서 불필요한 마크다운 코드 블록(```json) 제거
    const cleanedText = text.replace(/```json|```/g, "").trim();

    // 2. 만약 응답이 비어있으면 에러 처리
    if (!cleanedText) {
      throw new Error("Empty response from Gemini");
    }

    // 3. JSON 파싱
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini API Error:", error);

    // 에러 발생 시 사용자에게 보여줄 최소한의 폴백 데이터
    return {
      songTitle: `${theme}의 이야기`,
      lyrics: `[Verse 1]\n우리의 소중한 기억이\n노래가 되어 흐르네요\n잠시만 기다려주면\n아름다운 곡이 완성될 거예요`,
      styleTags: `korean, ${genre}, emotional`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. 클라이언트가 보낸 데이터에서 새로운 필드들을 꺼냅니다.
    const {
      requestId,
      theme,
      answers,
      style,
      genre,
      vocalGender, // 추가됨
      preferredArtist, // 추가됨
    } = body;

    // 2. generateSongPrompt 호출 시 모든 인자를 전달합니다.
    // 타입 오류를 방지하기 위해 vocalGender가 없을 경우 기본값('female')을 설정해주는 것이 안전합니다.
    const songData = await generateSongPrompt({
      theme,
      answers,
      style,
      genre,
      vocalGender: vocalGender || "female",
      preferredArtist: preferredArtist || "",
    });

    // 3. DB 저장 로직 (기존과 동일)
    const { error: insertError } = await supabase.from("song_prompts").insert({
      request_id: requestId,
      song_title: songData.songTitle,
      lyrics: songData.lyrics,
      style_tags: songData.styleTags,
    });

    if (insertError) throw insertError;

    // 4. 요청 상태 업데이트 (기존과 동일)
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
