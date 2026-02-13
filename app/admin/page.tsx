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
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface RequestWithPrompt {
  id: string;
  phone_number: string;
  theme: string;
  genre: string;
  style: string;
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
  const [loading, setLoading] = useState(true);
  const [copiedStates, setCopiedStates] = useState<
    Record<string, Record<string, boolean>>
  >({});

  useEffect(() => {
    checkAdmin();
    fetchAllRequests();
  }, []);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();
      console.log("Admin check in dashboard:", result);

      if (!result.isAdmin) {
        await supabase.auth.signOut();
        router.push("/");
      }
    } catch (error) {
      console.error("Admin check failed:", error);
      router.push("/admin/login");
    }
  };

  const fetchAllRequests = async () => {
    console.log("🔍 Fetching requests from API...");

    try {
      const response = await fetch("/api/admin/requests");
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const result = await response.json();
      console.log("📦 Result:", result);
      console.log("📊 Requests count:", result.data?.length || 0);

      if (result.success) {
        setRequests(result.data);
        console.log("✅ Requests set successfully");
      } else {
        console.error("❌ Error:", result.error);
      }
    } catch (error) {
      console.error("💥 Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
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

      setTimeout(() => {
        setCopiedStates((prev) => ({
          ...prev,
          [requestId]: { ...prev[requestId], [field]: false },
        }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const markAsSent = async (requestId: string) => {
    try {
      const response = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update status");
      }

      // 목록 새로고침
      fetchAllRequests();
      alert("전송 완료로 표시되었습니다.");
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert("상태 업데이트에 실패했습니다.");
    }
  };

  const isCopied = (requestId: string, field: string) => {
    return copiedStates[requestId]?.[field] || false;
  };

  const getStatusBadge = (status: string, sentAt: string | null) => {
    if (status === "sent") {
      return (
        <div className="text-xs">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <Check className="w-3 h-3" />
            전송 완료
          </span>
          {sentAt && (
            <div className="text-warm-600 mt-1">
              {new Date(sentAt).toLocaleString("ko-KR")}
            </div>
          )}
        </div>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
        <Phone className="w-3 h-3" />
        전송 대기
      </span>
    );
  };
  console.log("🎨 Rendering with:", {
    loading,
    requestsLength: requests.length,
    requests: requests,
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-warm-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="w-7 h-7 text-primary-600" />
            <h1 className="text-xl md:text-2xl font-display font-bold text-primary-900">
              담음 관리자
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-warm-700 hover:text-warm-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">로그아웃</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-warm-600">전체 요청</p>
                <p className="text-2xl font-bold text-primary-900">
                  {requests.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-warm-600">전송 완료</p>
                <p className="text-2xl font-bold text-primary-900">
                  {requests.filter((r) => r.status === "sent").length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-warm-600">전송 대기</p>
                <p className="text-2xl font-bold text-primary-900">
                  {requests.filter((r) => r.status !== "sent").length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Requests List */}
        <div>
          <h2 className="text-2xl font-display font-bold text-primary-900 mb-6">
            노래 요청 목록
          </h2>

          {loading ? (
            <div className="text-center py-12 text-warm-600">
              <Music className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              불러오는 중...
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center">
              <Music className="w-16 h-16 mx-auto mb-4 text-warm-400" />
              <p className="text-warm-700">아직 요청이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg"
                >
                  {/* Request Info */}
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-display font-bold text-primary-900 mb-2">
                          {request.theme}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="px-3 py-1 bg-primary-100 text-primary-900 rounded-full">
                            {request.genre}
                          </span>
                          <span className="px-3 py-1 bg-warm-100 text-warm-900 rounded-full">
                            {request.style}
                          </span>
                          {getStatusBadge(request.status, request.sent_at)}
                        </div>
                      </div>
                      <div className="text-sm text-warm-600">
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {request.phone_number}
                        </p>
                        <p className="mt-1">
                          {new Date(request.created_at).toLocaleString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Generated Content */}
                  {request.prompt && (
                    <div className="space-y-4">
                      {/* Title */}
                      <div className="bg-warm-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary-900">
                            곡 제목
                          </h4>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                request.prompt!.song_title,
                                request.id,
                                "title"
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            {isCopied(request.id, "title") ? (
                              <>
                                <Check className="w-3 h-3" />
                                복사됨
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                복사
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-primary-900 font-medium">
                          {request.prompt.song_title}
                        </p>
                      </div>

                      {/* Lyrics */}
                      <div className="bg-warm-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary-900">
                            가사
                          </h4>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                request.prompt!.lyrics,
                                request.id,
                                "lyrics"
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            {isCopied(request.id, "lyrics") ? (
                              <>
                                <Check className="w-3 h-3" />
                                복사됨
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                복사
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-warm-900 max-h-64 overflow-y-auto">
                          {request.prompt.lyrics}
                        </pre>
                      </div>

                      {/* Style Tags */}
                      <div className="bg-warm-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary-900">
                            Style Tags
                          </h4>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                request.prompt!.style_tags,
                                request.id,
                                "tags"
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                          >
                            {isCopied(request.id, "tags") ? (
                              <>
                                <Check className="w-3 h-3" />
                                복사됨
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                복사
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-warm-900">
                          {request.prompt.style_tags}
                        </p>
                      </div>

                      {/* Mark as Sent Button */}
                      {request.status !== "sent" && (
                        <div className="pt-4 border-t border-warm-200">
                          <button
                            onClick={() => markAsSent(request.id)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            <Send className="w-4 h-4" />
                            전송 완료로 표시
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
