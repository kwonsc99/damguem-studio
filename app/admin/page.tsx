"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Music,
  LogOut,
  Copy,
  Check,
  Phone,
  FileText,
  Send,
  Search,
  ChevronDown,
  User,
  Sparkles,
  Mic2,
  Heart,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

// 데이터 인터페이스 정의
interface RequestWithPrompt {
  id: string;
  phone_number: string;
  theme: string;
  genre: string;
  style: string;
  vocal_gender: string;
  preferred_artist: string;
  answers: Record<string, string>;
  status: string;
  sent_at: string | null;
  created_at: string;
  prompt: {
    song_title: string;
    lyrics: string;
    style_tags: string;
  } | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestWithPrompt[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestWithPrompt[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<
    Record<string, Record<string, boolean>>
  >({});

  useEffect(() => {
    checkAdmin();
    fetchAllRequests();
  }, []);

  // 검색 및 필터링 로직
  useEffect(() => {
    let filtered = requests;
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.phone_number.includes(searchTerm) || r.theme.includes(searchTerm)
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((r) =>
        filterStatus === "sent" ? r.status === "sent" : r.status !== "sent"
      );
    }
    setFilteredRequests(filtered);
  }, [searchTerm, filterStatus, requests]);

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/admin/login");
      return;
    }
    try {
      const response = await fetch("/api/check-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const result = await response.json();
      if (!result.isAdmin) {
        await supabase.auth.signOut();
        router.push("/");
      }
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests");
      const result = await response.json();
      if (result.success) setRequests(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (
    e: React.MouseEvent,
    text: string,
    requestId: string,
    field: string
  ) => {
    e.stopPropagation(); // 부모 요소인 아코디언의 클릭 이벤트 전파 방지
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({
        ...prev,
        [requestId]: { ...prev[requestId], [field]: true },
      }));
      setTimeout(
        () =>
          setCopiedStates((prev) => ({
            ...prev,
            [requestId]: { ...prev[requestId], [field]: false },
          })),
        1500
      );
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const markAsSent = async (requestId: string) => {
    if (!confirm("전송 완료로 표시할까요?")) return;
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      if (response.ok) fetchAllRequests();
    } catch (error) {
      alert("업데이트 실패");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* Global Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-warm-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-warm-900 tracking-tight">
              담음 관리자
            </h1>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
            className="p-2 text-warm-400 hover:text-warm-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "전체 요청",
              count: requests.length,
              color: "bg-primary-500",
              icon: FileText,
            },
            {
              label: "전송 대기",
              count: requests.filter((r) => r.status !== "sent").length,
              color: "bg-yellow-500",
              icon: Phone,
            },
            {
              label: "전송 완료",
              count: requests.filter((r) => r.status === "sent").length,
              color: "bg-green-500",
              icon: Check,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-3xl shadow-sm border border-warm-100 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center text-white`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-warm-400 font-bold uppercase">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-warm-900">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-300" />
            <input
              type="text"
              placeholder="전화번호 또는 테마 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl shadow-sm">
            {["all", "pending", "sent"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === s
                    ? "bg-warm-900 text-white shadow-md"
                    : "text-warm-400 hover:bg-warm-50"
                }`}
              >
                {s === "all" ? "전체" : s === "pending" ? "대기" : "완료"}
              </button>
            ))}
          </div>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <Music className="w-8 h-8 mx-auto animate-spin text-primary-200" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-warm-200 text-warm-400">
              <p className="font-medium">해당되는 요청 데이터가 없습니다.</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <motion.div
                layout
                key={request.id}
                className={`bg-white rounded-[2rem] border transition-all overflow-hidden ${
                  expandedId === request.id
                    ? "border-primary-200 shadow-xl ring-4 ring-primary-50/50"
                    : "border-warm-100 shadow-sm"
                }`}
              >
                {/* Accordion Header */}
                <div
                  className="p-5 md:p-6 cursor-pointer flex items-center justify-between"
                  onClick={() =>
                    setExpandedId(expandedId === request.id ? null : request.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        request.status === "sent"
                          ? "bg-green-500"
                          : "bg-yellow-500 animate-pulse"
                      }`}
                    />
                    <div>
                      <h3 className="font-bold text-warm-900 flex items-center gap-2">
                        {request.theme}
                        <span className="text-[10px] px-2 py-0.5 bg-warm-100 text-warm-600 rounded-md font-bold uppercase">
                          {request.genre}
                        </span>
                      </h3>
                      <p className="text-sm font-medium text-warm-500 mt-0.5">
                        {request.phone_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end text-[10px] text-warm-300 font-bold uppercase">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        expandedId === request.id
                          ? "rotate-180 text-primary-500"
                          : "text-warm-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Accordion Content */}
                <AnimatePresence>
                  {expandedId === request.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-warm-50 bg-white"
                    >
                      <div className="p-5 md:p-8 space-y-10">
                        {/* 1. Production Guide (제작 필수 정보) */}
                        <section className="bg-primary-50/50 rounded-3xl p-6 border border-primary-100">
                          <div className="flex items-center gap-2 mb-5 text-primary-700">
                            <Mic2 className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest">
                              Production Guide
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">
                                보컬 성별
                              </p>
                              <p className="font-bold text-warm-900 text-lg">
                                {request.vocal_gender === "female"
                                  ? "여성 보컬 👩"
                                  : "남성 보컬 👨"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">
                                선호 아티스트/스타일
                              </p>
                              <p className="font-bold text-warm-900 text-lg">
                                {request.preferred_artist || "지정 없음"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">
                                분위기 스타일
                              </p>
                              <p className="font-bold text-warm-900 text-lg">
                                {request.style}
                              </p>
                            </div>
                          </div>
                        </section>

                        {/* 2. User Story (답변 내역) */}
                        <section>
                          <div className="flex items-center gap-2 mb-4 text-warm-400">
                            <Heart className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-widest">
                              User Story
                            </h4>
                          </div>
                          <div className="grid gap-3">
                            {Object.entries(request.answers || {}).map(
                              ([q, a], i) => (
                                <div
                                  key={i}
                                  className="bg-warm-50/30 p-4 rounded-2xl border border-warm-100/50"
                                >
                                  <p className="text-[10px] text-warm-400 font-bold mb-1">
                                    Q. {q}
                                  </p>
                                  <p className="text-sm text-warm-800 font-medium leading-relaxed">
                                    {a}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </section>

                        {/* 3. AI Result (생략 불가) */}
                        {request.prompt ? (
                          <section className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 text-warm-400">
                              <Sparkles className="w-4 h-4" />
                              <h4 className="text-xs font-black uppercase tracking-widest">
                                AI Result
                              </h4>
                            </div>

                            {/* 제목 및 태그 복사 영역 */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-white border border-warm-100 p-5 rounded-2xl shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-[10px] font-bold text-warm-300 uppercase">
                                    Song Title
                                  </span>
                                  <button
                                    onClick={(e) =>
                                      copyToClipboard(
                                        e,
                                        request.prompt!.song_title,
                                        request.id,
                                        "title"
                                      )
                                    }
                                    className="p-2.5 text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 active:scale-90 transition-all"
                                  >
                                    {copiedStates[request.id]?.title ? (
                                      <Check className="w-5 h-5" />
                                    ) : (
                                      <Copy className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                                <p className="font-bold text-warm-900 text-lg">
                                  {request.prompt.song_title}
                                </p>
                              </div>
                              <div className="bg-white border border-warm-100 p-5 rounded-2xl shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-[10px] font-bold text-warm-300 uppercase">
                                    Style Tags
                                  </span>
                                  <button
                                    onClick={(e) =>
                                      copyToClipboard(
                                        e,
                                        request.prompt!.style_tags,
                                        request.id,
                                        "tags"
                                      )
                                    }
                                    className="p-2.5 text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 active:scale-90 transition-all"
                                  >
                                    {copiedStates[request.id]?.tags ? (
                                      <Check className="w-5 h-5" />
                                    ) : (
                                      <Copy className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                                <p className="text-xs text-warm-600 font-mono break-all leading-relaxed">
                                  {request.prompt.style_tags}
                                </p>
                              </div>
                            </div>

                            {/* 가사 박스 (모바일 최적화) */}
                            <div className="rounded-[2.5rem] overflow-hidden border border-warm-800 bg-warm-900 shadow-2xl">
                              <div className="flex items-center justify-between px-6 py-5 bg-white/5 border-b border-white/10">
                                <span className="text-xs font-black text-warm-400 tracking-[0.2em]">
                                  LYRICS
                                </span>
                                <button
                                  onClick={(e) =>
                                    copyToClipboard(
                                      e,
                                      request.prompt!.lyrics.replace(
                                        /<br\s*\/?>/gi,
                                        "\n"
                                      ),
                                      request.id,
                                      "lyrics"
                                    )
                                  }
                                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
                                    copiedStates[request.id]?.lyrics
                                      ? "bg-green-500 text-white scale-105"
                                      : "bg-primary-500 text-white"
                                  }`}
                                >
                                  {copiedStates[request.id]?.lyrics ? (
                                    <>
                                      <Check className="w-4 h-4" /> 복사 완료!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" /> 가사 전체
                                      복사
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="p-8 md:p-10 max-h-[500px] overflow-y-auto custom-scrollbar">
                                <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-[2.2] text-warm-100 opacity-90 tracking-wide">
                                  {request.prompt.lyrics
                                    .split(/<br\s*\/?>/gi)
                                    .map((line, i) => (
                                      <span key={i}>
                                        {line}
                                        <br />
                                      </span>
                                    ))}
                                </pre>
                              </div>
                            </div>

                            {/* 최종 전송 버튼 */}
                            <div className="pt-6">
                              {request.status !== "sent" ? (
                                <button
                                  onClick={() => markAsSent(request.id)}
                                  className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-700 shadow-xl shadow-green-100 transition-all active:scale-[0.98]"
                                >
                                  <Send className="w-5 h-5" /> 카카오톡 전송
                                  완료로 표시
                                </button>
                              ) : (
                                <div className="w-full py-5 bg-warm-50 text-warm-400 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 border border-warm-100">
                                  <Check className="w-5 h-5" /> 전송 완료됨 (
                                  {new Date(request.sent_at!).toLocaleString(
                                    "ko-KR"
                                  )}
                                  )
                                </div>
                              )}
                            </div>
                          </section>
                        ) : (
                          <div className="py-20 text-center bg-warm-50 rounded-3xl border border-warm-100 text-warm-400 text-sm font-medium">
                            가사 데이터가 존재하지 않거나 생성 중입니다.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* 모바일 하단 여백 가이드 */}
      <div className="h-10" />
    </div>
  );
}
