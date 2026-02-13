# 담음(談音) - 당신의 이야기로 만드는 노래

당신의 소중한 추억과 감정을 AI가 노래 가사와 음악 스타일로 변환해주는 서비스입니다.

## 주요 기능

### 사용자 기능
- 🎵 9가지 주제 선택 (부모님, 자녀, 나의 청춘 등)
- 📝 주제별 맞춤 질문에 답변
- 🎨 분위기와 장르 선택
- 🤖 AI가 생성한 가사와 Suno AI용 프롬프트 제공
- 💾 생성된 노래 관리 및 다운로드

### 관리자 기능
- 📊 전체 노래 요청 대시보드
- 👥 사용자별 요청 현황
- 📋 곡 제목, 가사, Style Tags 개별 복사 기능

## 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Framer Motion** - 애니메이션
- **Lucide React** - 아이콘

### Backend
- **Supabase** - 데이터베이스 & 인증
  - PostgreSQL
  - Row Level Security
  - 실시간 기능
- **Claude API (Anthropic)** - AI 가사 생성

## 설치 및 실행

### 1. 사전 요구사항
- Node.js 18 이상
- Supabase 계정
- Anthropic API 키

### 2. 프로젝트 설치

\`\`\`bash
# 패키지 설치
npm install
\`\`\`

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

\`\`\`env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI API 설정 (Claude API)
ANTHROPIC_API_KEY=your_anthropic_api_key

# 관리자 이메일 (초기 설정)
ADMIN_EMAIL=admin@dameum.com
\`\`\`

### 4. Supabase 설정

#### 4.1 프로젝트 생성
1. [Supabase](https://supabase.com)에 접속하여 새 프로젝트 생성
2. 프로젝트 URL과 API 키를 `.env.local`에 입력

#### 4.2 데이터베이스 스키마 적용
1. Supabase 대시보드 > SQL Editor로 이동
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행

#### 4.3 관리자 계정 설정
첫 번째 관리자를 수동으로 설정해야 합니다:

\`\`\`sql
-- 회원가입 후 해당 이메일의 is_admin을 true로 변경
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@dameum.com';
\`\`\`

### 5. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 `http://localhost:3000` 접속

### 6. 빌드 및 배포

\`\`\`bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
\`\`\`

## 디렉토리 구조

\`\`\`
dameum-service/
├── app/
│   ├── api/
│   │   └── generate-prompt/    # AI 가사 생성 API
│   ├── admin/                   # 관리자 페이지
│   ├── auth/                    # 인증 (로그인/회원가입)
│   ├── user/                    # 사용자 페이지
│   │   └── create/              # 노래 생성 플로우
│   │       ├── theme/           # 주제 선택
│   │       ├── questions/       # 질문 답변
│   │       └── style/           # 스타일/장르 선택
│   ├── globals.css              # 전역 스타일
│   ├── layout.tsx               # 루트 레이아웃
│   └── page.tsx                 # 홈페이지
├── lib/
│   ├── supabase.ts              # Supabase 클라이언트
│   └── types.ts                 # TypeScript 타입 정의
├── supabase/
│   └── schema.sql               # 데이터베이스 스키마
└── public/                      # 정적 파일
\`\`\`

## 데이터베이스 스키마

### profiles
사용자 프로필 정보
- id (UUID, PK)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- is_admin (BOOLEAN)

### song_requests
노래 생성 요청
- id (UUID, PK)
- user_id (UUID, FK)
- theme (TEXT)
- answers (JSONB)
- style (TEXT)
- genre (TEXT)
- status (TEXT)

### song_prompts
생성된 노래 프롬프트
- id (UUID, PK)
- request_id (UUID, FK)
- song_title (TEXT)
- lyrics (TEXT)
- style_tags (TEXT)

## 주요 페이지 플로우

### 사용자 플로우
1. 회원가입/로그인
2. 주제 선택 (9가지 중 1개)
3. 질문 답변 (주제별 5-7개 질문)
4. 스타일 & 장르 선택
5. AI 가사 생성
6. 결과 확인 및 다운로드

### 관리자 플로우
1. 관리자 로그인
2. 대시보드에서 모든 요청 확인
3. 곡 제목, 가사, Style Tags 개별 복사
4. 사용자 통계 확인

## API 엔드포인트

### POST /api/generate-prompt
노래 가사 및 스타일 태그 생성

**Request Body:**
\`\`\`json
{
  "requestId": "uuid",
  "theme": "주제명",
  "answers": { "질문": "답변" },
  "style": "분위기",
  "genre": "장르"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "songTitle": "곡 제목",
    "lyrics": "가사 전문",
    "styleTags": "korean ballad, emotional, ..."
  }
}
\`\`\`

## AI 프롬프트 생성 로직

1. 사용자의 답변을 Claude API에 전달
2. 5070 세대 친화적인 구어체 가사 생성
3. 선택한 장르와 분위기에 맞는 구조 적용
4. Suno AI에서 바로 사용 가능한 Style Tags 생성

## 모바일 반응형

- 모든 페이지는 모바일 우선으로 디자인됨
- Tailwind CSS의 반응형 유틸리티 활용
- 터치 친화적인 UI/UX

## 배포

### Vercel 배포 (추천)
1. GitHub에 프로젝트 푸시
2. Vercel에서 프로젝트 임포트
3. 환경 변수 설정
4. 자동 배포

### 기타 플랫폼
- Netlify
- Railway
- AWS Amplify

## 라이선스

MIT License

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.
