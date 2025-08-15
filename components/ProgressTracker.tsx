'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BarChart3, TrendingUp, Target, Award } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

export default function ProgressTracker() {
  const { progress, loading, resetAchievements } = useProgress()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

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

  const generateChartData = (days: number) => {
    const endDate = new Date()
    const startDate = subDays(endDate, days - 1)
    const dates = eachDayOfInterval({ start: startDate, end: endDate })
    
    return dates.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const isInProgress = date <= new Date()
      const dayNumber = Math.floor((date.getTime() - new Date(progress.startDate).getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        date: dateStr,
        day: format(date, 'EEE', { locale }),
        value: isInProgress && dayNumber >= 0 ? Math.min(progress.currentStreak, dayNumber + 1) : 0,
        isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      }
    })
  }

  const chartData = generateChartData(selectedPeriod === '7d' ? 7 : 30)

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <BarChart3 className="w-5 h-5 mr-2 text-white" />
          {t.progress.detailedProgress}
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod('7d')}
            className={`flex-1 py-3 px-4 border-2 font-mono uppercase tracking-wider text-sm font-bold transition-all ${
              selectedPeriod === '7d'
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-white hover:bg-white hover:text-black'
            }`}
          >
            {t.progress.last7Days}
          </button>
          <button
            onClick={() => setSelectedPeriod('30d')}
            className={`flex-1 py-3 px-4 border-2 font-mono uppercase tracking-wider text-sm font-bold transition-all ${
              selectedPeriod === '30d'
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-white hover:bg-white hover:text-black'
            }`}
          >
            {t.progress.last30Days}
          </button>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold font-mono uppercase tracking-wider text-white">{t.progress.dailyProgress}</h4>
          <div className="text-sm font-mono uppercase tracking-wider text-white opacity-70">
            {selectedPeriod === '7d' ? t.progress.last7Days : t.progress.last30Days}
          </div>
        </div>
        
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={item.date} className="flex items-center space-x-3">
              <div className="w-12 text-xs font-bold font-mono uppercase tracking-wider text-white">
                {item.day}
              </div>
              <div className="flex-1">
                <div className="relative h-8 bg-black border-2 border-white overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                      item.isToday ? 'bg-white' : 'bg-white'
                    }`}
                    style={{ width: `${Math.min(100, (item.value / Math.max(progress.currentStreak, 1)) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                      {item.value}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Next Goals - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <Target className="w-5 h-5 mr-2 text-white" />
          {t.progress.nextGoals}
        </h3>
        
        <div className="space-y-3">
          {[1, 7, 14, 30, 60, 90].map((milestone) => {
            const isCompleted = progress.currentStreak >= milestone
            const nextMilestone = [1, 7, 14, 30, 60, 90].find(m => m > progress.currentStreak)
            const isNext = !isCompleted && (milestone === 1 || (nextMilestone && progress.currentStreak >= nextMilestone))
            
            return (
              <div
                key={milestone}
                className={`flex items-center justify-between p-3 border-2 transition-all ${
                  isCompleted
                    ? 'bg-white text-black border-white'
                    : isNext
                    ? 'bg-black text-white border-white'
                    : 'bg-black text-white border-white opacity-30'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-none border-2 border-current flex items-center justify-center mr-3 ${
                    isCompleted ? 'border-black' : 'border-white'
                  }`}>
                    {isCompleted ? (
                      <Award className="w-4 h-4 text-black" />
                    ) : (
                      <Target className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className={`font-bold font-mono uppercase tracking-wider ${
                      isCompleted ? 'text-black' : 'text-white'
                    }`}>
                      {milestone} {t.common.days}
                    </div>
                    <div className={`text-xs font-mono uppercase tracking-wider ${
                      isCompleted ? 'text-black opacity-70' : 'text-white opacity-70'
                    }`}>
                      {isCompleted 
                        ? t.progress.completed 
                        : isNext 
                          ? `${milestone - progress.currentStreak} ${t.progress.daysRemaining}`
                          : 'Objetivo futuro'
                      }
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold font-mono uppercase tracking-wider ${
                  isCompleted ? 'text-black' : 'text-white'
                }`}>
                  {isCompleted ? '✓' : (isNext ? '→' : milestone)}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Achievements - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <Award className="w-5 h-5 mr-2 text-white" />
          Logros Desbloqueados
        </h3>
        
        <div className="space-y-3">
          {progress.achievements.length === 0 ? (
            <div className="text-center py-8 text-white">
              <Award className="w-12 h-12 mx-auto mb-3 text-white opacity-50" />
              <p className="font-mono uppercase tracking-wider">No hay logros aún</p>
              <p className="text-sm font-mono uppercase tracking-wider opacity-70">¡Continúa tu progreso para desbloquear logros!</p>
            </div>
          ) : (
            <>
              {progress.achievements.slice(-3).reverse().map((achievement) => (
                <div key={achievement.id} className="p-3 bg-white text-black border-2 border-white">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-black mr-3" />
                    <div>
                      <div className="font-bold font-mono uppercase tracking-wider text-black">{achievement.title}</div>
                      <div className="text-sm font-mono uppercase tracking-wider text-black opacity-70">{achievement.description}</div>
                      <div className="text-xs font-mono uppercase tracking-wider text-black opacity-50">
                        {format(new Date(achievement.date), 'dd/MM/yyyy', { locale })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={resetAchievements}
                className="w-full py-3 px-4 bg-black text-white border-2 border-white font-mono uppercase tracking-wider text-sm font-bold hover:bg-white hover:text-black transition-all btn-touch"
              >
                Reset Logros
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
