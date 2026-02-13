"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Theme, Style, Genre } from "@/lib/types";

export default function PhoneNumberPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

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
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 010-1234-5678 형식으로 포맷
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !selectedStyle || !selectedGenre || !theme) return;

    // 휴대폰 번호 유효성 검사
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("올바른 휴대폰 번호를 입력해주세요. (010-1234-5678)");
      return;
    }

    setLoading(true);

    try {
      // 1단계: 노래 요청 생성
      const submitResponse = await fetch("/api/submit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          theme,
          answers,
          style: selectedStyle,
          genre: selectedGenre,
        }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.error || "Failed to submit request");
      }

      const submitResult = await submitResponse.json();
      const requestId = submitResult.data.requestId;

      // 2단계: AI 프롬프트 생성
      const promptResponse = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          theme,
          answers,
          style: selectedStyle,
          genre: selectedGenre,
        }),
      });

      if (!promptResponse.ok) throw new Error("Failed to generate prompt");

      // 로컬 스토리지 정리
      localStorage.removeItem("selectedTheme");
      localStorage.removeItem("answers");
      localStorage.removeItem("selectedStyle");
      localStorage.removeItem("selectedGenre");

      // 완료 페이지로 이동
      router.push(`/complete?phone=${encodeURIComponent(phoneNumber)}`);
    } catch (error) {
      console.error("Error:", error);
      alert("노래 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!theme) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-warm-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
              <Phone className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">
              거의 다 끝났어요! 📱
            </h1>
            <p className="text-warm-700 text-lg">
              노래를 받으실 휴대폰 번호를 입력해주세요
            </p>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8"
          >
            <h3 className="font-semibold text-primary-900 mb-4">
              선택하신 내용
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-600">주제</span>
                <span className="font-medium text-primary-900">{theme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-600">장르</span>
                <span className="font-medium text-primary-900">
                  {selectedGenre}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-600">분위기</span>
                <span className="font-medium text-primary-900">
                  {selectedStyle}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Phone Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-8"
          >
            <label
              htmlFor="phone"
              className="block text-lg font-semibold text-primary-900 mb-4"
            >
              휴대폰 번호
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                maxLength={13}
                className="w-full pl-12 pr-4 py-4 border-2 border-warm-200 rounded-xl text-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              />
            </div>
            <p className="mt-3 text-sm text-warm-600">
              💡 입력하신 번호로 완성된 노래를 문자로 보내드립니다
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleSubmit}
              disabled={!phoneNumber || phoneNumber.length < 13 || loading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-lg font-bold rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 inline-flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  노래 생성 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  노래 만들기
                </>
              )}
            </button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-6 bg-primary-50/50 rounded-xl"
          >
            <h4 className="font-semibold text-primary-900 mb-3">📝 안내사항</h4>
            <ul className="space-y-2 text-sm text-primary-800">
              <li>• 노래 생성에는 약 1-2분이 소요됩니다</li>
              <li>• 완성된 노래는 관리자가 직접 확인 후 문자로 발송됩니다</li>
              <li>• 보통 24시간 이내에 받아보실 수 있습니다</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
