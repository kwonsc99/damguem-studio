"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Baby,
  Sparkles,
  Users,
  Wind,
  Sun,
  MessageCircle,
  Target,
  Smile,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Theme } from "@/lib/types";

const themes: { name: Theme; icon: any; description: string; color: string }[] =
  [
    {
      name: "부모님",
      icon: Heart,
      description: "부모님께 전하는 마음",
      color: "from-red-400 to-pink-500",
    },
    {
      name: "자녀",
      icon: Baby,
      description: "아이에게 들려주는 이야기",
      color: "from-blue-400 to-cyan-500",
    },
    {
      name: "나의 청춘",
      icon: Sparkles,
      description: "빛나던 그 시절의 나",
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "내 곁에 있는 당신",
      icon: Users,
      description: "함께한 소중한 인연",
      color: "from-purple-400 to-pink-500",
    },
    {
      name: "지친 마음을 위로하는",
      icon: Wind,
      description: "나를 위한 휴식",
      color: "from-teal-400 to-green-500",
    },
    {
      name: "오늘의 여유",
      icon: Sun,
      description: "평온한 일상의 순간",
      color: "from-amber-400 to-yellow-500",
    },
    {
      name: "보고 싶은 사람",
      icon: MessageCircle,
      description: "그리움을 담아",
      color: "from-indigo-400 to-purple-500",
    },
    {
      name: "다시 뛰는 심장",
      icon: Target,
      description: "새로운 도전과 열정",
      color: "from-orange-400 to-red-500",
    },
    {
      name: "요즘 내 기분",
      icon: Smile,
      description: "지금 이 순간의 감정",
      color: "from-green-400 to-teal-500",
    },
  ];

export default function ThemeSelection() {
  const router = useRouter();

  const handleThemeSelect = (theme: Theme) => {
    localStorage.setItem("selectedTheme", theme);
    router.push("/create/questions");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {" "}
      {/* 배경색 유지 및 미세 조정 */}
      {/* Header & Progress */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 text-warm-900 hover:bg-warm-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-warm-900">주제 선택</span>
          </div>
          <div className="w-10" /> {/* 밸런스를 위한 빈 공간 */}
        </div>
      </header>
      <main className="container mx-auto px-5 py-8 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold text-warm-900 leading-tight">
              어떤 이야기를 <br />
              <span className="text-primary-600">노래로 담아볼까요?</span>
            </h1>
            <p className="text-warm-500 mt-2 text-sm md:text-base">
              마음속에 머무는 주제를 하나 골라주세요.
            </p>
          </motion.div>

          {/* Theme Grid - Mobile 2 Columns! */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <AnimatePresence>
              {themes.map((theme, index) => (
                <motion.button
                  key={theme.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileTap={{ scale: 0.96 }} // 터치 시 쫀득한 느낌
                  onClick={() => handleThemeSelect(theme.name)}
                  className="relative overflow-hidden bg-white border border-warm-100 rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center mb-4 text-white shadow-sm group-hover:rotate-12 transition-transform`}
                  >
                    <theme.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>

                  <h3 className="text-[15px] md:text-lg font-bold text-warm-900 mb-1 break-keep">
                    {theme.name}
                  </h3>
                  <p className="text-[11px] md:text-sm text-warm-500 leading-snug line-clamp-2">
                    {theme.description}
                  </p>

                  {/* 배경 살짝 비치는 효과 (옵션) */}
                  <div
                    className={`absolute -right-2 -bottom-2 w-12 h-12 bg-gradient-to-br ${theme.color} opacity-[0.03] rounded-full blur-2xl`}
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
      {/* Mobile Footer Gradient (글자 겹침 방지) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}
