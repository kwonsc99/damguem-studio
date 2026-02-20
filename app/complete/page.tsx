"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Sparkles,
  Home,
  Music2,
  MessageSquare,
  Clock3,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function CompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const phone = searchParams.get("phone");
    if (!phone) {
      router.push("/");
    } else {
      setPhoneNumber(phone);
    }
  }, [searchParams, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-12 overflow-x-hidden">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-[5%] left-[-5%] w-72 h-72 bg-warm-100 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg w-full z-10"
      >
        {/* Success Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-primary-200 mb-6 mx-auto"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-primary-400 opacity-50" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-display font-bold text-warm-900 mb-3">
            모든 준비가 끝났어요!
          </h1>
          <p className="text-warm-500 break-keep">
            소중한 마음이 담긴 노래가 <br />
            이제 곧 아름다운 선율로 태어납니다.
          </p>
        </motion.div>

        {/* Status Timeline Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-warm-100 mb-10"
        >
          <h2 className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Music2 className="w-4 h-4" />
            노래 제작 프로세스
          </h2>

          <div className="space-y-10 relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-warm-50" />

            {/* Step 1 */}
            <div className="relative flex gap-5">
              <div className="z-10 w-10 h-10 bg-white border-2 border-primary-500 rounded-full flex items-center justify-center text-primary-600 shadow-sm">
                <Music2 className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-bold text-warm-900 mb-1">
                  AI 멜로디 위빙
                </h3>
                <p className="text-xs text-warm-500 leading-relaxed">
                  작성하신 이야기를 바탕으로 감성적인 가사와 선율을 구성하고
                  있습니다.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-5">
              <div className="z-10 w-10 h-10 bg-white border-2 border-warm-100 rounded-full flex items-center justify-center text-warm-300">
                <Heart className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-bold text-warm-900 mb-1">
                  담음 팀 최종 감수
                </h3>
                <p className="text-xs text-warm-500 leading-relaxed">
                  음악의 완성도를 높이기 위해 담음 팀이 직접 듣고 확인하는
                  과정을 거칩니다.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex gap-5">
              <div className="z-10 w-10 h-10 bg-white border-2 border-warm-100 rounded-full flex items-center justify-center text-warm-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-0.5">
                <h3 className="text-sm font-bold text-warm-900 mb-1">
                  카카오톡 전송
                </h3>
                <p className="text-xs text-warm-500 leading-relaxed">
                  <span className="text-primary-600 font-bold">
                    {phoneNumber}
                  </span>{" "}
                  번호로 <br />
                  완성된 노래 링크를 보내드립니다.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Expected Time Badge */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 mb-12 px-6 py-4 bg-white border border-warm-100 rounded-2xl shadow-sm"
        >
          <Clock3 className="w-5 h-5 text-primary-500" />
          <p className="text-sm text-warm-600">
            평균 제작 시간{" "}
            <span className="text-warm-900 font-bold ml-1">24시간 이내</span>
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Link
            href="/"
            className="w-full py-5 bg-warm-900 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-xl hover:scale-[1.02] transition-all"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
          <div className="text-center">
            <p className="text-[11px] text-warm-400 mt-6 tracking-wide italic">
              "당신의 이야기가 누군가에게 <br className="md:hidden" /> 세상에서
              가장 아름다운 선물이 되길"
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin mb-4" />
          <p className="text-warm-500 font-medium">로딩 중...</p>
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  );
}
