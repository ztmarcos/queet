'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BarChart3 } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameDay } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

interface DayData {
  date: Date
  hits: number
  color: string
  tooltip: string
}

export default function SmokingReport() {
  const { progress, loading } = useProgress()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)

  const locale = language === 'es' ? es : enUS

  if (loading || !progress) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-48 bg-white border-2 border-white mb-4"></div>
          <div className="h-32 bg-white border-2 border-white mb-4"></div>
          <div className="h-32 bg-white border-2 border-white"></div>
        </div>
      </div>
    )
  }

  const generateYearData = (): DayData[] => {
    const startDate = startOfYear(new Date())
    const endDate = endOfYear(new Date())
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    
    return days.map(day => {
      // For now, we'll use mock data based on progress.smokingHits
      // In a real app, you'd have daily hit data
      const isToday = isSameDay(day, new Date())
      const isStartDate = isSameDay(day, new Date(progress.startDate))
      
      let hits = 0
      
      // Mock logic: distribute hits across recent days
      if (isToday) {
        hits = progress.dailyHits
      } else if (isStartDate) {
        hits = Math.floor(progress.smokingHits / 10) // Some hits on start date
      } else if (day > new Date(progress.startDate) && day < new Date()) {
        // Random distribution for demo
        const daysSinceStart = Math.floor((day.getTime() - new Date(progress.startDate).getTime()) / (1000 * 60 * 60 * 24))
        if (daysSinceStart < 30) {
          hits = Math.floor(Math.random() * 5) // 0-4 hits for recent days
        }
      }
      
      // Color coding based on hits
      let color = 'bg-white' // No smoking
      if (hits >= 1 && hits <= 3) {
        color = 'bg-yellow-400' // Grade 1: Yellow
      } else if (hits >= 4 && hits <= 6) {
        color = 'bg-green-500' // Grade 2: Green
      } else if (hits >= 7 && hits <= 9) {
        color = 'bg-orange-500' // Grade 3: Orange
      } else if (hits >= 10) {
        color = 'bg-red-500' // Grade 4: Red
      }
      
      const tooltip = hits === 0 
        ? `${format(day, 'EEEE, d MMMM yyyy', { locale })} - No fumó`
        : `${format(day, 'EEEE, d MMMM yyyy', { locale })} - ${hits} ${hits === 1 ? 'hit' : 'hits'}`
      
      return {
        date: day,
        hits,
        color,
        tooltip
      }
    })
  }

  const yearData = generateYearData()
  const totalHits = yearData.reduce((sum, day) => sum + day.hits, 0)
  const daysWithHits = yearData.filter(day => day.hits > 0).length
  const maxHits = Math.max(...yearData.map(day => day.hits))

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <BarChart3 className="w-5 h-5 mr-2 text-white" />
          {t.progress.smokingReport || 'REPORTE DE FUMADAS'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white text-black p-3 border-2 border-white">
            <div className="text-2xl font-bold font-mono">{totalHits}</div>
            <div className="text-xs font-mono uppercase tracking-wider">TOTAL HITS</div>
          </div>
          <div className="bg-white text-black p-3 border-2 border-white">
            <div className="text-2xl font-bold font-mono">{daysWithHits}</div>
            <div className="text-xs font-mono uppercase tracking-wider">DÍAS CON HITS</div>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h4 className="text-sm font-semibold mb-3 flex items-center font-mono uppercase tracking-wider">
          <Calendar className="w-4 h-4 mr-2 text-white" />
          LEGENDA
        </h4>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-white"></div>
            <span className="font-mono uppercase tracking-wider text-white">No fumó</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 border border-white"></div>
            <span className="font-mono uppercase tracking-wider text-white">1-3 hits</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 border border-white"></div>
            <span className="font-mono uppercase tracking-wider text-white">4-6 hits</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 border border-white"></div>
            <span className="font-mono uppercase tracking-wider text-white">7-9 hits</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <div className="w-4 h-4 bg-red-500 border border-white"></div>
            <span className="font-mono uppercase tracking-wider text-white">10+ hits</span>
          </div>
        </div>
      </motion.div>

      {/* Year Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h4 className="text-sm font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <Calendar className="w-4 h-4 mr-2 text-white" />
          {new Date().getFullYear()} - TODO EL AÑO
        </h4>
        
        <div className="grid grid-cols-53 gap-1">
          {yearData.map((day, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 ${day.color} border border-white cursor-pointer transition-all duration-200 ${
                hoveredDay === day ? 'ring-2 ring-white' : ''
              }`}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => setSelectedDay(day)}
              title={day.tooltip}
            />
          ))}
        </div>
      </motion.div>

      {/* Selected Day Info */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-mobile border-3 border-white shadow-brutalist"
        >
          <div className="text-center">
            <h4 className="text-lg font-bold font-mono uppercase tracking-wider text-white mb-2">
              {format(selectedDay.date, 'EEEE, d MMMM yyyy', { locale }).toUpperCase()}
            </h4>
            <div className="text-3xl font-bold font-mono text-white mb-2">
              {selectedDay.hits}
            </div>
            <div className="text-sm font-mono uppercase tracking-wider text-white opacity-70">
              {selectedDay.hits === 0 ? 'NO FUMÓ' : selectedDay.hits === 1 ? 'HIT' : 'HITS'}
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="mt-3 px-4 py-2 bg-white text-black border-2 border-white font-mono uppercase tracking-wider text-xs font-bold hover:bg-black hover:text-white transition-all"
            >
              CERRAR
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
