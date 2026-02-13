# 담음(談音) 프로젝트 구조

## 📁 전체 구조

\`\`\`
dameum-service/
├── 📄 README.md                 # 프로젝트 메인 문서
├── 📄 INSTALLATION.md           # 상세 설치 가이드
├── 📄 QUICKSTART.md             # 5분 빠른 시작
├── 📄 package.json              # 프로젝트 설정 & 의존성
├── 📄 tsconfig.json             # TypeScript 설정
├── 📄 next.config.js            # Next.js 설정
├── 📄 tailwind.config.js        # Tailwind CSS 설정
├── 📄 .env.example              # 환경 변수 예시
├── 📄 .gitignore                # Git 제외 파일
│
├── 📂 app/                      # Next.js 앱 디렉토리
│   ├── 📄 layout.tsx            # 루트 레이아웃
│   ├── 📄 page.tsx              # 홈페이지 (랜딩)
│   ├── 📄 globals.css           # 전역 스타일
│   │
│   ├── 📂 auth/                 # 인증 페이지
│   │   ├── 📂 login/            # 로그인
│   │   │   └── 📄 page.tsx
│   │   └── 📂 signup/           # 회원가입
│   │       └── 📄 page.tsx
│   │
│   ├── 📂 user/                 # 사용자 페이지
│   │   ├── 📄 page.tsx          # 대시보드
│   │   ├── 📂 create/           # 노래 생성 플로우
│   │   │   ├── 📂 theme/        # 1단계: 주제 선택
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📂 questions/    # 2단계: 질문 답변
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📂 style/        # 3단계: 스타일/장르
│   │   │       └── 📄 page.tsx
│   │   └── 📂 song/
│   │       └── 📂 [id]/         # 노래 상세 페이지
│   │           └── 📄 page.tsx
│   │
│   ├── 📂 admin/                # 관리자 페이지
│   │   └── 📄 page.tsx          # 관리자 대시보드
│   │
│   └── 📂 api/                  # API 엔드포인트
│       └── 📂 generate-prompt/  # AI 가사 생성
│           └── 📄 route.ts
│
├── 📂 lib/                      # 공통 라이브러리
│   ├── 📄 supabase.ts           # Supabase 클라이언트
│   └── 📄 types.ts              # TypeScript 타입 정의
│
├── 📂 supabase/                 # Supabase 관련
│   └── 📄 schema.sql            # 데이터베이스 스키마
│
└── 📂 public/                   # 정적 파일 (이미지 등)
\`\`\`

## 🎯 주요 파일 설명

### 설정 파일

| 파일 | 설명 |
|------|------|
| `package.json` | 프로젝트 의존성 및 스크립트 |
| `tsconfig.json` | TypeScript 컴파일 설정 |
| `next.config.js` | Next.js 프레임워크 설정 |
| `tailwind.config.js` | Tailwind CSS 테마 & 색상 |
| `.env.example` | 환경 변수 템플릿 |

### 핵심 라이브러리

| 파일 | 역할 |
|------|------|
| `lib/supabase.ts` | Supabase 클라이언트 초기화 |
| `lib/types.ts` | 모든 TypeScript 타입 정의 |

### 주요 페이지

#### 인증 (`app/auth/`)
- `login/page.tsx` - 이메일/비밀번호 로그인
- `signup/page.tsx` - 회원가입

#### 사용자 (`app/user/`)
- `page.tsx` - 대시보드 (노래 목록)
- `create/theme/page.tsx` - 9가지 주제 선택
- `create/questions/page.tsx` - 주제별 질문 답변 (5-7개)
- `create/style/page.tsx` - 스타일 & 장르 선택
- `song/[id]/page.tsx` - 생성된 노래 확인 (가사, Style Tags)

#### 관리자 (`app/admin/`)
- `page.tsx` - 모든 노래 요청 관리, 복사 기능

### API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/generate-prompt` | POST | Claude API로 가사 생성 |

## 🗄️ 데이터베이스 스키마

### profiles
사용자 프로필
- `id` - 사용자 고유 ID (UUID)
- `email` - 이메일 주소
- `full_name` - 사용자 이름
- `is_admin` - 관리자 여부 (Boolean)

### song_requests
노래 생성 요청
- `id` - 요청 고유 ID (UUID)
- `user_id` - 사용자 ID (FK → profiles)
- `theme` - 선택한 주제
- `answers` - 질문 답변 (JSONB)
- `style` - 선택한 스타일
- `genre` - 선택한 장르
- `status` - 상태 (pending/processing/completed)

### song_prompts
생성된 노래 프롬프트
- `id` - 프롬프트 고유 ID (UUID)
- `request_id` - 요청 ID (FK → song_requests)
- `song_title` - 곡 제목
- `lyrics` - 가사 전문
- `style_tags` - Suno AI용 스타일 태그

## 🎨 디자인 시스템

### 색상 팔레트

#### Primary (주황)
- 50: `#fff8f0`
- 100: `#ffeedd`
- 600: `#f06000` (메인)
- 900: `#7a2c00`

#### Warm (따뜻한 베이지)
- 50: `#fdfbf7`
- 100: `#f9f4ed`
- 600: `#b89968`
- 900: `#5e4a32`

### 폰트
- Display: Noto Serif KR (제목용)
- Body: Noto Sans KR (본문용)

### 애니메이션
- Fade In - 페이지 로드
- Slide Up - 카드 진입
- Float - 장식 요소

## 🔐 보안 고려사항

1. **Row Level Security (RLS)**
   - 사용자는 자신의 데이터만 조회 가능
   - 관리자는 모든 데이터 조회 가능

2. **환경 변수**
   - API 키는 서버 사이드에서만 사용
   - `.env.local` 파일은 Git에 포함 안 됨

3. **인증**
   - Supabase Auth 사용
   - JWT 토큰 기반

## 📊 데이터 흐름

### 사용자 노래 생성
1. 사용자가 주제 선택
2. 질문에 답변 (localStorage에 임시 저장)
3. 스타일 & 장르 선택
4. `song_requests` 테이블에 요청 저장
5. `/api/generate-prompt` 호출 (Claude API)
6. `song_prompts` 테이블에 결과 저장
7. 사용자에게 결과 표시

### 관리자 확인
1. 관리자 로그인
2. `song_requests` + `song_prompts` 조인 쿼리
3. 모든 요청 목록 표시
4. 개별 복사 기능 제공

## 🚀 배포 가이드

### Vercel (권장)
1. GitHub 연동
2. 환경 변수 설정
3. 자동 배포

### 환경 변수 (프로덕션)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `ADMIN_EMAIL`

## 📱 반응형 디자인

- 모바일 우선 (Mobile-first)
- Breakpoints:
  - `md:` 768px 이상 (태블릿)
  - `lg:` 1024px 이상 (데스크톱)

## 🔄 업데이트 계획

향후 추가 가능 기능:
- [ ] 음성 녹음 기능
- [ ] 노래 공유 (SNS)
- [ ] 플레이리스트
- [ ] 결제 시스템
- [ ] 다국어 지원

---

**더 자세한 내용은 각 파일의 주석을 참고하세요!**
