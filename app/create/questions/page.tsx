'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Music } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { THEME_QUESTIONS, type Theme } from '@/lib/types'

export default function QuestionsPage() {
  const router = useRouter()
  const [theme, setTheme] = useState<Theme | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState('')

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') as Theme
    if (!savedTheme) {
      router.push('/create/theme')
    } else {
      setTheme(savedTheme)
    }
  }, [router])

  if (!theme) return null

  const questions = THEME_QUESTIONS[theme]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleNext = () => {
    if (currentAnswer.trim()) {
      const newAnswers = {
        ...answers,
        [questions[currentQuestion]]: currentAnswer,
      }
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setCurrentAnswer(newAnswers[questions[currentQuestion + 1]] || '')
      } else {
        // 모든 질문 완료
        localStorage.setItem('answers', JSON.stringify(newAnswers))
        router.push('/create/style')
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setCurrentAnswer(answers[questions[currentQuestion - 1]] || '')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-warm-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">뒤로가기</span>
            </button>
            
            <div className="flex items-center gap-2 text-sm text-warm-700">
              <Music className="w-4 h-4" />
              <span className="hidden md:inline">{theme}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-warm-700">
                질문 {currentQuestion + 1} / {questions.length}
              </span>
              <span className="text-sm text-primary-600 font-semibold">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-warm-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-600 to-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-900 mb-6 leading-relaxed">
                  {questions[currentQuestion]}
                </h2>
              </div>

              {/* Answer Input */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="편하게 답변해주세요. 당신의 진심이 담긴 이야기가 가장 아름다운 노래가 됩니다."
                  className="w-full h-48 md:h-64 p-4 border-2 border-warm-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none text-warm-900 placeholder:text-warm-400"
                  autoFocus
                />
                
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="inline-flex items-center gap-2 px-6 py-3 text-warm-700 hover:text-warm-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    이전
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion < questions.length - 1 ? '다음' : '완료'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-primary-50/50 rounded-xl">
                <p className="text-sm text-primary-800">
                  💡 <strong>팁:</strong> 구체적인 장면이나 감정을 표현하면 더 감동적인 노래가 만들어집니다.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
