'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Baby, Sparkles, Users, Wind, Sun, MessageCircle, Target, Smile } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Theme } from '@/lib/types'

const themes: { name: Theme; icon: any; description: string; color: string }[] = [
  {
    name: '부모님',
    icon: Heart,
    description: '부모님께 전하는 마음',
    color: 'from-red-400 to-pink-500',
  },
  {
    name: '자녀',
    icon: Baby,
    description: '아이에게 들려주는 이야기',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    name: '나의 청춘',
    icon: Sparkles,
    description: '빛나던 그 시절의 나',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    name: '내 곁에 있는 당신',
    icon: Users,
    description: '함께한 소중한 인연',
    color: 'from-purple-400 to-pink-500',
  },
  {
    name: '지친 마음을 위로하는',
    icon: Wind,
    description: '나를 위한 휴식',
    color: 'from-teal-400 to-green-500',
  },
  {
    name: '오늘의 여유',
    icon: Sun,
    description: '평온한 일상의 순간',
    color: 'from-amber-400 to-yellow-500',
  },
  {
    name: '보고 싶은 사람',
    icon: MessageCircle,
    description: '그리움을 담아',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    name: '다시 뛰는 심장',
    icon: Target,
    description: '새로운 도전과 열정',
    color: 'from-orange-400 to-red-500',
  },
  {
    name: '요즘 내 기분',
    icon: Smile,
    description: '지금 이 순간의 감정',
    color: 'from-green-400 to-teal-500',
  },
]

export default function ThemeSelection() {
  const router = useRouter()

  const handleThemeSelect = (theme: Theme) => {
    localStorage.setItem('selectedTheme', theme)
    router.push('/create/questions')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-warm-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">
              어떤 이야기를 노래로 만들까요?
            </h1>
            <p className="text-warm-700 text-lg">
              주제를 선택하면 관련 질문이 시작됩니다
            </p>
          </motion.div>

          {/* Theme Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {themes.map((theme, index) => (
              <motion.button
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleThemeSelect(theme.name)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-left hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${theme.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <theme.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-display font-semibold text-primary-900 mb-2">
                  {theme.name}
                </h3>
                <p className="text-warm-700 text-sm md:text-base">{theme.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
