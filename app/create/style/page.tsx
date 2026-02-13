'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Music, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { STYLE_DESCRIPTIONS, type Style, type Genre, type Theme } from '@/lib/types'

const styles: Style[] = [
  '포근하고 따뜻한',
  '잔잔하고 평온한',
  '애절하고 뭉클한',
  '신나고 활기찬',
  '웅장하고 감동적인',
  '담담하고 깊이 있는',
]

const genres: Genre[] = [
  '발라드',
  '트로트',
  '포크',
  '클래식/가곡',
  '팝',
  '록',
  '재즈',
]

export default function StyleSelection() {
  const router = useRouter()
  const [theme, setTheme] = useState<Theme | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') as Theme
    const savedAnswers = localStorage.getItem('answers')
    
    if (!savedTheme || !savedAnswers) {
      router.push('/create/theme')
    } else {
      setTheme(savedTheme)
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [router])

  const handleNext = () => {
    if (!selectedStyle || !selectedGenre) return

    // 스타일과 장르를 localStorage에 저장
    localStorage.setItem('selectedStyle', selectedStyle)
    localStorage.setItem('selectedGenre', selectedGenre)
    
    // 휴대폰 번호 입력 페이지로 이동
    router.push('/create/phone')
  }

  if (!theme) return null

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-warm-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-4">
              마지막 단계예요! 🎵
            </h1>
            <p className="text-warm-700 text-lg">
              어떤 분위기와 장르로 노래를 만들까요?
            </p>
          </motion.div>

          {/* Style Selection */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-display font-bold text-primary-900">
                분위기 선택
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {styles.map((style) => (
                <motion.button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl text-left transition-all ${
                    selectedStyle === style
                      ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-xl'
                      : 'bg-white/80 hover:bg-white hover:shadow-lg'
                  }`}
                >
                  <h3 className={`text-xl font-display font-semibold mb-2 ${
                    selectedStyle === style ? 'text-white' : 'text-primary-900'
                  }`}>
                    {style}
                  </h3>
                  <p className={`text-sm ${
                    selectedStyle === style ? 'text-primary-50' : 'text-warm-600'
                  }`}>
                    {STYLE_DESCRIPTIONS[style]}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Genre Selection */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Music className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-display font-bold text-primary-900">
                장르 선택
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {genres.map((genre) => (
                <motion.button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg'
                      : 'bg-white/80 text-primary-900 hover:bg-white hover:shadow-md'
                  }`}
                >
                  {genre}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              disabled={!selectedStyle || !selectedGenre}
              className="px-12 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-lg font-bold rounded-full hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 inline-flex items-center gap-3"
            >
              다음 단계
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
