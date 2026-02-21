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
  Filter,
  ChevronDown,
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

// Interface 보완: 사용자의 답변 내역(answers) 추가
interface RequestWithPrompt {
  id: string;
  phone_number: string;
  theme: string;
  genre: string;
  style: string;
  answers: Record<string, string>; // 유저 답변 추가
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
      if (result.success) {
        setRequests(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (
    text: string,
    requestId: string,
    field: string
  ) => {
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
      console.error(error);
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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-warm-100 sticky top-0 z-30">
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
            className="p-2 text-warm-500 hover:bg-warm-50 rounded-full transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "전체 요청",
              count: requests.length,
              color: "bg-primary-500",
              icon: FileText,
            },
            {
              label: "대기 중",
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
                <p className="text-xs text-warm-500 font-medium">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-warm-900">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 및 필터 바 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-300" />
            <input
              type="text"
              placeholder="전화번호 또는 테마 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm">
            {["all", "pending", "sent"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === s
                    ? "bg-warm-900 text-white"
                    : "text-warm-400 hover:text-warm-600"
                }`}
              >
                {s === "all" ? "전체" : s === "pending" ? "대기" : "완료"}
              </button>
            ))}
          </div>
        </div>

        {/* 리스트 섹션 */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <Music className="w-8 h-8 mx-auto animate-spin text-primary-200" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-warm-200 text-warm-400">
              요청 데이터가 없습니다.
            </div>
          ) : (
            filteredRequests.map((request) => (
              <motion.div
                layout
                key={request.id}
                className={`bg-white rounded-[2rem] border transition-all ${
                  expandedId === request.id
                    ? "border-primary-200 shadow-md"
                    : "border-warm-100 shadow-sm"
                }`}
              >
                {/* 헤더 부분 (항상 노출) */}
                <div
                  className="p-5 md:p-6 cursor-pointer flex items-center justify-between"
                  onClick={() =>
                    setExpandedId(expandedId === request.id ? null : request.id)
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        request.status === "sent"
                          ? "bg-green-500"
                          : "bg-yellow-500 animate-pulse"
                      }`}
                    />
                    <div>
                      <h3 className="font-bold text-warm-900 flex items-center gap-2">
                        {request.theme}
                        <span className="text-xs font-normal text-warm-400">
                          | {request.genre}
                        </span>
                      </h3>
                      <p className="text-sm text-warm-500 mt-0.5">
                        {request.phone_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden md:block text-xs text-warm-300">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                    <div
                      className={`p-2 rounded-full transition-transform ${
                        expandedId === request.id
                          ? "rotate-180 text-primary-500"
                          : "text-warm-300"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* 상세 부분 (확장 시 노출) */}
                <AnimatePresence>
                  {expandedId === request.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-warm-50"
                    >
                      <div className="p-6 md:p-8 space-y-8">
                        {/* 1. AI 생성 결과 */}
                        {request.prompt ? (
                          <section className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 text-primary-600">
                              <Sparkles className="w-4 h-4" />
                              <h4 className="text-sm font-bold uppercase tracking-wider">
                                AI Generated
                              </h4>
                            </div>

                            {/* 제목 & 태그 */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-white border border-warm-100 p-5 rounded-2xl group">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold text-warm-300 uppercase">
                                    Song Title
                                  </span>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        request.prompt!.song_title,
                                        request.id,
                                        "title"
                                      )
                                    }
                                    className="text-primary-500 hover:scale-110 transition-transform"
                                  >
                                    {copiedStates[request.id]?.title ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                                <p className="font-bold text-lg text-warm-900">
                                  {request.prompt.song_title}
                                </p>
                              </div>
                              <div className="bg-white border border-warm-100 p-5 rounded-2xl">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-bold text-warm-300 uppercase">
                                    Style Tags
                                  </span>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        request.prompt!.style_tags,
                                        request.id,
                                        "tags"
                                      )
                                    }
                                    className="text-primary-500 hover:scale-110 transition-transform"
                                  >
                                    {copiedStates[request.id]?.tags ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                                <p className="text-sm text-warm-600 font-mono">
                                  {request.prompt.style_tags}
                                </p>
                              </div>
                            </div>

                            {/* 가사 */}
                            <div className="bg-warm-900 text-warm-100 p-6 md:p-8 rounded-[2rem] relative group">
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    request.prompt!.lyrics.replace(
                                      /<br\s*\/?>/gi,
                                      "\n"
                                    ),
                                    request.id,
                                    "lyrics"
                                  )
                                }
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                              >
                                {copiedStates[request.id]?.lyrics ? (
                                  <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Copy className="w-5 h-5" />
                                )}
                              </button>
                              <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-loose opacity-90">
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
                            {/* 1. 유저 답변 내역 */}
                            <section>
                              <div className="flex items-center gap-2 mb-4 text-primary-600">
                                <User className="w-4 h-4" />
                                <h4 className="text-sm font-bold uppercase tracking-wider">
                                  User Story
                                </h4>
                              </div>
                              <div className="grid gap-3">
                                {Object.entries(request.answers || {}).map(
                                  ([q, a], i) => (
                                    <div
                                      key={i}
                                      className="bg-warm-50/50 p-4 rounded-2xl"
                                    >
                                      <p className="text-[11px] text-warm-400 mb-1">
                                        Q. {q}
                                      </p>
                                      <p className="text-sm text-warm-800 leading-relaxed font-medium">
                                        {a}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </section>

                            {/* 전송 버튼 */}
                            <div className="flex flex-col md:flex-row gap-3 pt-4">
                              {request.status !== "sent" ? (
                                <button
                                  onClick={() => markAsSent(request.id)}
                                  className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                                >
                                  <Send className="w-4 h-4" /> 전송 완료로 표시
                                </button>
                              ) : (
                                <div className="flex-1 py-4 bg-warm-50 text-warm-400 rounded-2xl font-bold flex items-center justify-center gap-2 border border-warm-100">
                                  <Check className="w-4 h-4" /> 전송 완료 (
                                  {new Date(request.sent_at!).toLocaleString()})
                                </div>
                              )}
                            </div>
                          </section>
                        ) : (
                          <div className="py-12 text-center bg-warm-50 rounded-3xl text-warm-400 text-sm">
                            가사 생성 중이거나 오류가 발생했습니다.
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
    </div>
  );
}
