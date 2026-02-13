-- 데이터베이스 스키마
-- Supabase에서 실행할 SQL

-- 관리자 프로필 테이블 (관리자만 사용)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 노래 생성 요청 테이블 (휴대폰 번호 기반)
CREATE TABLE song_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL, -- 휴대폰 번호 (010-1234-5678)
  theme TEXT NOT NULL, -- '부모님', '자녀', '나의 청춘' 등
  answers JSONB NOT NULL, -- 질문에 대한 답변들
  style TEXT NOT NULL, -- 선택한 스타일
  genre TEXT NOT NULL, -- 선택한 장르
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'sent'
  sent_at TIMESTAMP WITH TIME ZONE, -- 노래 전송 시간
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 생성된 노래 프롬프트 테이블
CREATE TABLE song_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES song_requests(id) ON DELETE CASCADE NOT NULL,
  song_title TEXT NOT NULL,
  lyrics TEXT NOT NULL,
  style_tags TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_prompts ENABLE ROW LEVEL SECURITY;

-- 프로필 정책 (관리자만 조회)
CREATE POLICY "관리자는 자신의 프로필을 조회할 수 있음" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "관리자는 자신의 프로필을 업데이트할 수 있음" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 노래 요청 정책 (익명 사용자가 생성, 관리자가 조회/수정)
CREATE POLICY "누구나 요청을 생성할 수 있음" ON song_requests
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "관리자는 모든 요청을 조회할 수 있음" ON song_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "관리자는 모든 요청을 수정할 수 있음" ON song_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- 노래 프롬프트 정책
CREATE POLICY "관리자는 모든 프롬프트를 조회할 수 있음" ON song_prompts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

CREATE POLICY "시스템이 프롬프트를 생성할 수 있음" ON song_prompts
  FOR INSERT WITH CHECK (TRUE);

-- 트리거: 관리자 프로필 자동 생성 (선택적)
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    TRUE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거: 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_song_requests_updated_at
  BEFORE UPDATE ON song_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성
CREATE INDEX idx_song_requests_phone_number ON song_requests(phone_number);
CREATE INDEX idx_song_requests_created_at ON song_requests(created_at DESC);
CREATE INDEX idx_song_requests_status ON song_requests(status);
CREATE INDEX idx_song_prompts_request_id ON song_prompts(request_id);

-- 관리자 계정 생성 가이드
-- 1. Supabase Dashboard > Authentication > Users > Add user
-- 2. 이메일과 비밀번호 입력
-- 3. 자동으로 profiles 테이블에 is_admin=TRUE로 생성됨
