"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Music,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  STYLE_DESCRIPTIONS,
  type Style,
  type Genre,
  type Theme,
} from "@/lib/types";

const styles: Style[] = [
  "포근하고 따뜻한",
  "잔잔하고 평온한",
  "애절하고 뭉클한",
  "신나고 활기찬",
  "웅장하고 감동적인",
  "담담하고 깊이 있는",
];

const genres: Genre[] = [
  "발라드",
  "트로트",
  "포크",
  "클래식/가곡",
  "팝",
  "록",
  "재즈",
];

export default function StyleSelection() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as Theme;
    const savedAnswers = localStorage.getItem("answers");

    if (!savedTheme || !savedAnswers) {
      router.push("/create/theme");
    } else {
      setTheme(savedTheme);
    }
  }, [router]);

  const handleNext = () => {
    if (!selectedStyle || !selectedGenre) return;
    localStorage.setItem("selectedStyle", selectedStyle);
    localStorage.setItem("selectedGenre", selectedGenre);
    router.push("/create/phone");
  };

  if (!theme) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header & Progress */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <div className="h-1 w-full bg-warm-100">
          <motion.div
            initial={{ width: "66.6%" }}
            animate={{ width: "90%" }}
            className="h-full bg-primary-500"
          />
        </div>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-warm-500 hover:text-warm-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-warm-900">스타일 선택</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 pb-32 max-w-2xl">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-2xl font-display font-bold text-warm-900 mb-2">
            이제 다 왔어요!
          </h1>
          <p className="text-warm-500 text-sm">
            이야기에 어울리는 분위기를 골라주세요.
          </p>
        </motion.div>

        {/* Style Selection (Mood) */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 bg-primary-500 rounded-full" />
            <h2 className="text-lg font-bold text-warm-900">
              어떤 분위기가 좋은가요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {styles.map((style) => {
              const isSelected = selectedStyle === style;
              return (
                <motion.button
                  key={style}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStyle(style)}
                  className={`relative p-5 rounded-2xl text-left border-2 transition-all duration-200 
                    ${
                      isSelected
                        ? "bg-white border-primary-500 shadow-md ring-4 ring-primary-50"
                        : "bg-white border-transparent shadow-sm hover:border-warm-200"
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className={`font-bold ${
                        isSelected ? "text-primary-600" : "text-warm-900"
                      }`}
                    >
                      {style}
                    </h3>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                  <p className="text-xs text-warm-500 leading-relaxed break-keep">
                    {STYLE_DESCRIPTIONS[style]}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Genre Selection (Chips style) */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 bg-primary-500 rounded-full" />
            <h2 className="text-lg font-bold text-warm-900">
              선호하는 장르는 무엇인가요?
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <motion.button
                  key={genre}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all
                    ${
                      isSelected
                        ? "bg-warm-900 text-white shadow-lg"
                        : "bg-white text-warm-500 border border-warm-100 hover:border-warm-300 shadow-sm"
                    }`}
                >
                  {genre}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Floating Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent">
          <div className="max-w-2xl mx-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!selectedStyle || !selectedGenre}
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-2xl transition-all
                ${
                  selectedStyle && selectedGenre
                    ? "bg-primary-600 text-white shadow-primary-200"
                    : "bg-warm-200 text-warm-400 cursor-not-allowed shadow-none"
                }`}
            >
              노래 제작 요청하기
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
