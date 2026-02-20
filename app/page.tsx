"use client";

import {
  Music,
  Heart,
  Sparkles,
  ArrowRight,
  Mic,
  Headphones,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-warm-100">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-warm-900 tracking-tight">
              담음
              <span className="text-primary-600 ml-1 text-sm font-medium">
                談音
              </span>
            </h1>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-20">
          <div className="max-w-xl mx-auto text-center">
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold mb-6"
            >
              <Sparkles className="w-3 h-3" />
              <span>3,000원으로 만드는 나의 노래</span>
            </motion.div> */}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-display font-bold text-warm-900 mb-6 leading-[1.2]"
            >
              당신의 이야기로 만드는 <br />
              <span className="relative">
                <span className="relative z-10 text-primary-600">
                  하나뿐인 노래
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bottom-1 left-0 h-3 bg-primary-100 -z-0"
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-warm-600 text-base md:text-lg mb-10 leading-relaxed break-keep"
            >
              직접 말로 전하기 힘들었던 진심, <br className="md:hidden" />
              담음이 선율 위에 예쁘게 얹어드릴게요.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/create/theme"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-warm-900 text-white rounded-2xl text-lg font-bold shadow-xl hover:bg-primary-600 transition-all duration-300"
              >
                지금 시작하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How it works - 심플한 프로세스 안내 추가 */}
        {/* <section className="container mx-auto px-6 mb-24">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: PenTool, label: "이야기하기" },
              { icon: Mic, label: "AI 작곡" },
              { icon: Headphones, label: "노래 감상" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-warm-100 flex items-center justify-center text-warm-400">
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-warm-500">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </section> */}

        {/* Themes Preview - 태그 클라우드 스타일 */}
        <section className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-warm-100 p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div className="text-left">
                <h3 className="text-2xl font-display font-bold text-warm-900 mb-2">
                  이런 이야기를 들려주세요
                </h3>
                <p className="text-warm-500 text-sm">
                  다양한 주제로 당신만의 노래를 시작해보세요
                </p>
              </div>
              {/* <Link
                href="/create/theme"
                className="text-primary-600 font-bold text-sm hover:underline"
              >
                전체 보기
              </Link> */}
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {[
                "부모님",
                "자녀",
                "나의 청춘",
                "내 곁에 있는 당신",
                "지친 마음 위로",
                "오늘의 여유",
                "그리운 사람",
                "새로운 도전",
                "지금 내 기분",
              ].map((theme, index) => (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
                  className="px-5 py-3 bg-white border border-warm-100 rounded-full text-warm-700 font-medium shadow-sm cursor-default text-sm md:text-base transition-colors"
                >
                  {theme === "부모님"
                    ? "❤️ "
                    : theme === "지친 마음 위로"
                    ? "🌿 "
                    : ""}
                  {theme}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-warm-100 py-12 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale">
            <Music className="w-4 h-4 text-warm-900" />
            <span className="font-display font-bold text-warm-900">담음</span>
          </div>
          <p className="text-warm-400 text-xs tracking-widest uppercase mb-2 font-medium">
            Keep your story in a melody
          </p>
          <p className="text-warm-400 text-[10px]">
            © 2026 담음(談音). All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
