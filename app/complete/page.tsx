"use client";

import { useEffect, useState, Suspense } from "react"; // Suspense 추가
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Sparkles, Home } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// 1. 실제 로직을 담은 내부 컴포넌트
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-2xl">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-900 mb-4">
            감사합니다! 🎉
          </h1>
          <p className="text-lg md:text-xl text-warm-700 leading-relaxed">
            당신의 소중한 이야기가 노래로 만들어지고 있습니다
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-xl mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-display font-bold text-primary-900">
              다음 단계
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-900">
                1
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 mb-1">
                  노래 생성 완료
                </h3>
                <p className="text-warm-700 text-sm">
                  AI가 당신의 답변을 바탕으로 감성적인 가사와 멜로디를
                  만들었습니다
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-900">
                2
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 mb-1">
                  관리자 확인
                </h3>
                <p className="text-warm-700 text-sm">
                  담음 팀이 노래를 직접 확인하고 완성도를 높입니다
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-900">
                3
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 mb-1">
                  문자 발송
                </h3>
                <p className="text-warm-700 text-sm">
                  <span className="font-semibold text-primary-900">
                    {phoneNumber}
                  </span>
                  <br />위 번호로 완성된 노래를 문자로 보내드립니다
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Expected Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary-50/50 rounded-xl p-6 mb-8"
        >
          <p className="text-center text-primary-800">
            <span className="font-semibold">예상 소요 시간:</span> 보통 24시간
            이내
            <br />
            <span className="text-sm">
              빠르면 몇 시간 안에 받아보실 수 있습니다
            </span>
          </p>
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </motion.div>

        {/* Additional Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-warm-600 italic">
            "당신의 이야기가 누군가에게 감동과 위로가 되길 바랍니다"
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// 2. 외부에서 접근하는 페이지 컴포넌트 (Suspense로 감싸기)
export default function CompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-warm-600 animate-pulse">잠시만 기다려 주세요...</p>
        </div>
      }
    >
      <CompleteContent />
    </Suspense>
  );
}
