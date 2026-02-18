"use client";

import { Music, Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Music className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary-900">
            담음<span className="text-lg">(談音)</span>
          </h1>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <Link
            href="/admin/login"
            className="px-4 py-2 text-sm md:text-base text-primary-700 hover:text-primary-900 transition-colors"
          >
            관리자
          </Link>
        </motion.div> */}
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-900 mb-4 leading-tight">
              당신의 이야기가
              <br />
              <span className="text-primary-600">노래</span>가 됩니다
            </h2>
            <p className="text-lg md:text-xl text-warm-800 mb-8 leading-relaxed">
              소중한 추억과 감정을 담은
              <br className="hidden md:block" />
              나만의 노래를 만들어보세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Link
              href="/create/theme"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all"
            >
              지금 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Features
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 md:gap-8 mt-20"
          >
            {[
              {
                icon: Heart,
                title: "진심을 담아",
                description:
                  "당신의 이야기에 귀 기울이고, 진심을 담은 질문으로 감정을 끌어냅니다",
                color: "from-red-400 to-pink-400",
              },
              {
                icon: Sparkles,
                title: "AI가 작곡",
                description:
                  "당신의 답변을 바탕으로 AI가 감성적인 가사와 멜로디를 제안합니다",
                color: "from-yellow-400 to-orange-400",
              },
              {
                icon: Music,
                title: "나만의 노래",
                description:
                  "발라드부터 트로트까지, 원하는 스타일로 완성된 노래를 받아보세요",
                color: "from-blue-400 to-purple-400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 mx-auto`}
                >
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-semibold text-primary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-warm-700 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div> */}

          {/* Themes Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12"
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-primary-900 mb-8">
              다양한 주제로 노래를 만들어보세요
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {[
                "부모님",
                "자녀",
                "나의 청춘",
                "내 곁에 있는 당신",
                "지친 마음을 위로하는",
                "오늘의 여유",
                "보고 싶은 사람",
                "다시 뛰는 심장",
                "요즘 내 기분",
              ].map((theme, index) => (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.05 }}
                  className="px-4 py-3 bg-gradient-to-br from-warm-100 to-primary-100 rounded-xl text-primary-900 font-medium hover:shadow-md transition-all hover:scale-105 cursor-default text-sm md:text-base"
                >
                  {theme}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-warm-600 text-sm">
        <p>© 2026 담음(談音). All rights reserved.</p>
      </footer>
    </div>
  );
}
