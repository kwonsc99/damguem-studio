# 담음(談音) 빠른 시작 가이드 🚀

## 5분 만에 시작하기

### 1️⃣ 필수 준비물
- [ ] Node.js 18 이상 설치
- [ ] Supabase 계정 (무료)
- [ ] Anthropic API 키 (유료, 소량 사용은 저렴)

### 2️⃣ Supabase 설정 (2분)

1. https://supabase.com 접속 → 로그인
2. "New Project" → 프로젝트명 입력 → 생성
3. Settings → API에서 다음 복사:
   - `Project URL`
   - `anon public` key
   - `service_role` key

4. SQL Editor → New query → `supabase/schema.sql` 내용 붙여넣기 → Run

### 3️⃣ Anthropic API 키 발급 (1분)

1. https://console.anthropic.com 접속
2. API Keys → Create Key → 복사

### 4️⃣ 프로젝트 설정 (1분)

\`\`\`bash
# 패키지 설치
npm install

# 환경 변수 파일 생성
cp .env.example .env.local
\`\`\`

`.env.local` 파일에 위에서 복사한 값 입력:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_key
SUPABASE_SERVICE_ROLE_KEY=여기에_service_role_key
ANTHROPIC_API_KEY=여기에_Anthropic_API_key
ADMIN_EMAIL=admin@dameum.com
\`\`\`

### 5️⃣ 실행 (1분)

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 `http://localhost:3000` 접속!

### 6️⃣ 관리자 계정 만들기

1. 웹사이트에서 `admin@dameum.com`으로 회원가입
2. Supabase 대시보드 → Table Editor → profiles → 해당 계정의 `is_admin` → `true`로 변경

## 완료! 🎉

이제 다음을 할 수 있습니다:
- ✅ 사용자로 노래 생성
- ✅ 관리자 페이지에서 모든 노래 확인
- ✅ Suno AI로 실제 음악 생성

## 다음 단계

자세한 설명은 다음 문서를 참고하세요:
- `INSTALLATION.md` - 상세 설치 가이드
- `README.md` - 프로젝트 전체 문서

## 문제 해결

### 포트 3000이 사용 중이라면?
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### 데이터베이스 연결 안 됨?
- `.env.local` 파일의 URL과 키 재확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### AI 생성 안 됨?
- Anthropic API 키 확인
- API 크레딧 잔액 확인 (console.anthropic.com)

---

**도움이 필요하신가요?** GitHub Issues에 질문을 남겨주세요!
