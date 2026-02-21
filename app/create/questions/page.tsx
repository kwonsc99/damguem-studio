"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Music, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { THEME_QUESTIONS, THEME_PLACEHOLDERS, type Theme } from "@/lib/types";

export default function QuestionsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as Theme;
    if (!savedTheme) router.push("/create/theme");
    else setTheme(savedTheme);
  }, [router]);

  if (!theme) return null;

  const questions = THEME_QUESTIONS[theme];
  const placeholders = THEME_PLACEHOLDERS[theme];
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <div className="h-1 w-full bg-warm-100">
          <motion.div
            className="h-full bg-primary-500"
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion((q) => q - 1)}
            disabled={currentQuestion === 0}
            className="p-2 disabled:opacity-0"
          >
            <ArrowLeft />
          </button>
          <span className="text-sm font-bold">
            {currentQuestion + 1} / {questions.length}
          </span>
          <div className="px-3 py-1 bg-warm-100 rounded-full text-[11px] font-medium">
            {theme}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Quote className="w-8 h-8 text-primary-200 mb-4" />
            <h2 className="text-2xl font-bold text-warm-900 mb-8 break-keep">
              {questions[currentQuestion]}
            </h2>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={placeholders[currentQuestion]}
              className="w-full min-h-[300px] p-6 bg-white rounded-3xl border-none shadow-sm focus:ring-2 focus:ring-primary-100 outline-none text-lg leading-relaxed resize-none"
              autoFocus
            />
            <button
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className={`w-full mt-8 py-5 rounded-2xl flex justify-center items-center gap-2 font-bold text-lg ${
                currentAnswer.trim()
                  ? "bg-warm-900 text-white"
                  : "bg-warm-200 text-warm-400"
              }`}
            >
              {currentQuestion < questions.length - 1
                ? "다음 질문으로"
                : "이야기 완성하기"}{" "}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
