# 담음(談音) 설치 가이드

이 가이드는 담음 서비스를 처음부터 설정하는 방법을 자세히 설명합니다.

## 1단계: Supabase 프로젝트 설정

### 1.1 Supabase 계정 생성 및 프로젝트 만들기

1. [Supabase](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub, Google 등으로 로그인
4. "New Project" 클릭
5. 프로젝트 정보 입력:
   - Name: dameum (또는 원하는 이름)
   - Database Password: 안전한 비밀번호 생성
   - Region: Northeast Asia (Seoul) 선택
   - Pricing Plan: Free 선택
6. "Create new project" 클릭 (약 2분 소요)

### 1.2 API 키 확인

프로젝트 생성 후:
1. 좌측 메뉴 > "Settings" > "API" 클릭
2. 다음 값들을 복사해두세요:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY) ⚠️ 절대 노출 금지

### 1.3 데이터베이스 스키마 설정

1. 좌측 메뉴 > "SQL Editor" 클릭
2. "+ New query" 클릭
3. 프로젝트의 `supabase/schema.sql` 파일 내용 전체 복사
4. SQL Editor에 붙여넣기
5. "Run" 버튼 클릭 (우측 하단)
6. 성공 메시지 확인: "Success. No rows returned"

### 1.4 이메일 인증 비활성화 (개발용)

개발 중에는 이메일 인증을 건너뛸 수 있습니다:

1. 좌측 메뉴 > "Authentication" > "Providers" 클릭
2. "Email" 섹션 찾기
3. "Confirm email" 토글을 OFF로 설정
4. "Save" 클릭

⚠️ **프로덕션에서는 반드시 이메일 인증을 활성화하세요!**

## 2단계: Anthropic API 키 발급

### 2.1 Anthropic Console 접속

1. [Anthropic Console](https://console.anthropic.com) 접속
2. 계정 생성 또는 로그인
3. 결제 정보 등록 (필요시)

### 2.2 API 키 생성

1. 좌측 메뉴 > "API Keys" 클릭
2. "Create Key" 클릭
3. 키 이름 입력 (예: dameum-dev)
4. API 키 복사 및 안전하게 보관
   - **형식:** `sk-ant-api03-...`
   - ⚠️ 이 키는 다시 볼 수 없으니 반드시 저장하세요!

### 2.3 API 크레딧 확인

1. 우측 상단 > "Billing" 클릭
2. 크레딧 잔액 확인
3. 필요시 크레딧 충전

💡 **비용 예상:** Claude Sonnet 3.5는 1M 토큰당 약 $3입니다. 노래 1곡당 약 2000-3000 토큰 사용.

## 3단계: 프로젝트 설정

### 3.1 프로젝트 복사

\`\`\`bash
# 프로젝트 디렉토리로 이동
cd dameum-service

# 패키지 설치
npm install
\`\`\`

### 3.2 환경 변수 설정

1. `.env.example` 파일을 `.env.local`로 복사:

\`\`\`bash
cp .env.example .env.local
\`\`\`

2. `.env.local` 파일을 열어서 실제 값으로 변경:

\`\`\`env
# Supabase 설정 (1단계에서 복사한 값)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI API 설정 (2단계에서 복사한 값)
ANTHROPIC_API_KEY=sk-ant-api03-...

# 관리자 이메일
ADMIN_EMAIL=admin@dameum.com
\`\`\`

⚠️ **중요:**
- `.env.local` 파일은 절대 Git에 커밋하지 마세요!
- `SUPABASE_SERVICE_ROLE_KEY`와 `ANTHROPIC_API_KEY`는 서버에서만 사용됩니다.

## 4단계: 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 `http://localhost:3000` 접속

## 5단계: 첫 번째 관리자 계정 생성

### 5.1 회원가입

1. 브라우저에서 "시작하기" 또는 "회원가입" 클릭
2. `.env.local`의 `ADMIN_EMAIL`과 동일한 이메일로 가입
3. 비밀번호 설정 (최소 6자)

### 5.2 관리자 권한 부여

1. Supabase 대시보드 > "Table Editor" 클릭
2. "profiles" 테이블 선택
3. 방금 가입한 계정 찾기
4. `is_admin` 컬럼을 `false`에서 `true`로 변경
5. "Save" 클릭

### 5.3 관리자 페이지 접속

1. 로그아웃
2. 다시 로그인
3. 자동으로 관리자 페이지(`/admin`)로 이동

## 6단계: 테스트

### 6.1 사용자 플로우 테스트

1. 새 계정으로 회원가입 (일반 사용자)
2. "새 노래 만들기" 클릭
3. 주제 선택 (예: "나의 청춘")
4. 모든 질문에 답변
5. 스타일과 장르 선택
6. "노래 만들기" 클릭
7. 생성된 가사 확인

### 6.2 관리자 플로우 테스트

1. 관리자 계정으로 로그인
2. 대시보드에서 방금 생성된 노래 확인
3. 곡 제목, 가사, Style Tags 복사 테스트

## 7단계: Suno AI 연동 테스트

1. [Suno AI](https://suno.com) 접속 및 로그인
2. 담음에서 생성한 노래 정보 복사:
   - 가사 → Suno의 "Lyrics" 필드
   - Style Tags → Suno의 "Style of Music" 필드
3. "Create" 클릭
4. 생성된 음악 확인

## 문제 해결

### 에러: "Invalid API key"

- Anthropic API 키가 올바른지 확인
- API 키 형식: `sk-ant-api03-...`
- 키에 공백이나 줄바꿈이 없는지 확인

### 에러: "Failed to connect to Supabase"

- `NEXT_PUBLIC_SUPABASE_URL`이 올바른지 확인
- URL 끝에 슬래시(/)가 없어야 함
- 인터넷 연결 확인

### 에러: "User not authenticated"

- Supabase의 이메일 인증 설정 확인
- 브라우저 쿠키 삭제 후 재시도

### 노래 생성이 안 됨

1. 브라우저 개발자 도구 (F12) 열기
2. Console 탭에서 에러 메시지 확인
3. Network 탭에서 API 호출 확인
4. Anthropic API 크레딧 잔액 확인

## 다음 단계

### 프로덕션 배포

1. **환경 변수 설정**
   - Vercel/Netlify에서 동일한 환경 변수 설정
   - 이메일 인증 활성화

2. **도메인 연결**
   - 커스텀 도메인 구매
   - DNS 설정

3. **모니터링 설정**
   - Supabase 대시보드에서 사용량 모니터링
   - Anthropic Console에서 API 사용량 확인

### 기능 확장

- 음성 녹음 기능 추가
- 노래 공유 기능
- 플레이리스트 기능
- 결제 시스템 (프리미엄 기능)

## 지원

문제가 발생하면 GitHub Issues에 등록해주세요.
