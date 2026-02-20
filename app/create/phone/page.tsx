"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  CheckCircle,
  TicketCheck,
  Info,
  Music,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Theme, Style, Genre } from "@/lib/types";

export default function PhoneNumberPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as Theme;
    const savedAnswers = localStorage.getItem("answers");
    const savedStyle = localStorage.getItem("selectedStyle") as Style;
    const savedGenre = localStorage.getItem("selectedGenre") as Genre;

    if (!savedTheme || !savedAnswers || !savedStyle || !savedGenre) {
      router.push("/create/theme");
    } else {
      setTheme(savedTheme);
      setAnswers(JSON.parse(savedAnswers));
      setSelectedStyle(savedStyle);
      setSelectedGenre(savedGenre);
    }
  }, [router]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 13) return;

    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    // [핵심] 1. 백그라운드 API 호출 (기다리지 않음)
    // keepalive: true는 페이지 이동 후에도 브라우저가 요청을 끝까지 처리하게 합니다.
    fetch("/api/submit-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: phoneNumber,
        theme,
        answers,
        style: selectedStyle,
        genre: selectedGenre,
      }),
      keepalive: true,
    })
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          const requestId = result.data.requestId;

          // 2단계 프롬프트 생성도 백그라운드에서 이어서 실행
          fetch("/api/generate-prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestId,
              theme,
              answers,
              style: selectedStyle,
              genre: selectedGenre,
            }),
            keepalive: true,
          });
        }
      })
      .catch((err) => console.error("Background sync failed:", err));

    // [핵심] 2. 클릭 즉시 페이지 이동
    // 로컬 스토리지는 이동 전에 미리 비워줍니다.
    localStorage.removeItem("selectedTheme");
    localStorage.removeItem("answers");
    localStorage.removeItem("selectedStyle");
    localStorage.removeItem("selectedGenre");

    router.push(`/complete?phone=${encodeURIComponent(phoneNumber)}`);
  };

  if (!theme) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header & Progress */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <div className="h-1 w-full bg-warm-100">
          <motion.div
            initial={{ width: "90%" }}
            animate={{ width: "100%" }}
            className="h-full bg-primary-500"
          />
        </div>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-warm-500 hover:bg-warm-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">
              Final Step
            </span>
            <span className="text-sm font-bold text-warm-900">연락처 입력</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 pb-32 max-w-lg">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-sm mb-4 border border-warm-100 text-primary-600">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-bold text-warm-900 mb-2 leading-tight">
            거의 다 됐어요! <br />
            어디로 노래를 보내드릴까요?
          </h1>
          <p className="text-warm-500 text-sm break-keep">
            정성껏 만들어진 노래는 카카오톡으로 전달됩니다.
          </p>
        </motion.div>

        {/* Selection Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-warm-100 mb-8 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
            <TicketCheck className="w-24 h-24 text-primary-900" />
          </div>
          <h3 className="text-[10px] font-bold text-warm-400 uppercase tracking-widest mb-4 flex items-center gap-1">
            신청 내용 확인
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-warm-50 pb-3">
              <span className="text-sm text-warm-500">주제</span>
              <span className="text-sm font-bold text-warm-900">{theme}</span>
            </div>
            <div className="flex justify-between items-center border-b border-warm-50 pb-3">
              <span className="text-sm text-warm-500">장르</span>
              <span className="text-sm font-bold text-warm-900">
                {selectedGenre}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-warm-500">분위기</span>
              <span className="text-sm font-bold text-warm-900">
                {selectedStyle}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Phone Number Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <label className="block text-sm font-bold text-warm-900 mb-3 ml-1">
            휴대폰 번호
          </label>
          <div className="relative group">
            <div
              className={`absolute inset-y-0 left-5 flex items-center transition-colors ${
                phoneNumber ? "text-primary-500" : "text-warm-300"
              }`}
            >
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              maxLength={13}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent rounded-[1.5rem] text-xl font-medium focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all shadow-sm placeholder:text-warm-200"
            />
          </div>
          <p className="mt-3 text-[11px] text-warm-400 flex items-start gap-1.5 px-1">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            번호를 잘못 입력하시면 노래를 받으실 수 없으니 다시 한번
            확인해주세요.
          </p>
        </motion.div>

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent z-10">
          <div className="max-w-lg mx-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={phoneNumber.length < 13}
              className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 font-bold text-lg shadow-2xl transition-all
                ${
                  phoneNumber.length === 13
                    ? "bg-primary-600 text-white shadow-primary-200"
                    : "bg-warm-200 text-warm-400 cursor-not-allowed shadow-none"
                }`}
            >
              <CheckCircle className="w-5 h-5" />
              <span>노래 만들기</span>
            </motion.button>
          </div>
        </div>

        {/* Notice Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-5 bg-primary-50 rounded-2xl border border-primary-100"
        >
          <h4 className="text-[10px] font-bold text-primary-700 mb-2 uppercase tracking-widest">
            이후 진행 안내
          </h4>
          <ul className="space-y-1.5">
            <li className="text-xs text-primary-800 flex gap-2">
              <span className="opacity-50">•</span> AI가 당신의 이야기를
              분석하여 작곡을 시작합니다.
            </li>
            <li className="text-xs text-primary-800 flex gap-2">
              <span className="opacity-50">•</span> 완성된 곡은 검수 후
              카카오톡으로 개별 발송됩니다.
            </li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
