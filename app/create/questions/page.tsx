"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Music, Sparkles, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { THEME_QUESTIONS, type Theme } from "@/lib/types";

export default function QuestionsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as Theme;
    if (!savedTheme) {
      router.push("/create/theme");
    } else {
      setTheme(savedTheme);
    }
  }, [router]);

  if (!theme) return null;

  const questions = THEME_QUESTIONS[theme];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentAnswer.trim()) {
      const newAnswers = {
        ...answers,
        [questions[currentQuestion]]: currentAnswer,
      };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer(newAnswers[questions[currentQuestion + 1]] || "");
      } else {
        localStorage.setItem("answers", JSON.stringify(newAnswers));
        router.push("/create/style");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(answers[questions[currentQuestion - 1]] || "");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Top Navigation & Progress */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <div className="h-1 w-full bg-warm-100">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="p-2 -ml-2 text-warm-500 hover:text-warm-900 disabled:opacity-0 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">
              당신의 이야기를 들려주세요
            </span>
            <span className="text-sm font-bold text-warm-900">
              {currentQuestion + 1}{" "}
              <span className="text-warm-300 mx-1">/</span> {questions.length}
            </span>
          </div>

          <div className="px-3 py-1 bg-warm-100 rounded-full flex items-center gap-1.5">
            <Music className="w-3 h-3 text-warm-600" />
            <span className="text-[11px] font-medium text-warm-600">
              {theme}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col container mx-auto px-6 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {/* Question Label */}
            <div className="mb-8">
              <Quote className="w-8 h-8 text-primary-200 mb-4 fill-primary-50" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-warm-900 leading-tight break-keep">
                {questions[currentQuestion]}
              </h2>
            </div>

            {/* Input Area */}
            <div className="flex-1 relative flex flex-col group">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="여기에 편하게 적어주세요..."
                className="flex-1 w-full min-h-[300px] p-6 bg-white rounded-[2rem] border-none shadow-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-900 text-lg placeholder:text-warm-300 resize-none leading-relaxed"
                autoFocus
              />

              {/* Decoration Circle */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary-50 rounded-full -z-10 opacity-50 blur-2xl group-focus-within:bg-primary-200 transition-colors" />
            </div>

            {/* Bottom Section */}
            <div className="mt-8 flex flex-col gap-6">
              {/* Tip Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-3 p-4 bg-white/50 border border-warm-100 rounded-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                </div>
                <p className="text-xs md:text-sm text-warm-600 leading-relaxed">
                  구체적인 장면(그날의 날씨, 옷차림, 향기 등)이나{" "}
                  <br className="hidden md:block" />
                  나만의 감정을 표현하면 훨씬 풍부한 가사가 만들어집니다.
                </p>
              </motion.div>

              {/* Next Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!currentAnswer.trim()}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-xl transition-all
                  ${
                    currentAnswer.trim()
                      ? "bg-warm-900 text-white shadow-warm-200"
                      : "bg-warm-200 text-warm-400 cursor-not-allowed shadow-none"
                  }`}
              >
                {currentQuestion < questions.length - 1
                  ? "다음 질문으로"
                  : "이야기 완성하기"}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Keyboard Spacer (Mobile focus) */}
      <div className="h-8 md:hidden" />
    </div>
  );
}
