'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Target, TrendingUp, Award, Clock, Heart, Trash2 } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { progress, loading, updateStreak, addSmokingHit, subtractSmokingHit, resetAchievements } = useProgress()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const locale = language === 'es' ? es : enUS

  const handleReset = () => {
    setShowResetConfirm(true)
  }

  const confirmReset = async () => {
    await updateStreak(true)
    setShowResetConfirm(false)
  }

  if (loading || !progress) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-white border-2 border-white mb-4"></div>
          <div className="h-24 bg-white border-2 border-white mb-4"></div>
          <div className="h-24 bg-white border-2 border-white"></div>
        </div>
      </div>
    )
  }

  const startDate = new Date(progress.startDate)
  const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mobile bg-black text-white border-3 border-white shadow-brutalist"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 font-mono uppercase tracking-widest">
            {progress.currentStreak} {t.dashboard.days}
          </h2>
          <p className="text-white mb-4 font-mono uppercase tracking-wider">
            {t.dashboard.withoutSmoking}
          </p>
          
          <div className="flex justify-center space-x-6 text-sm mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-white">{progress.longestStreak}</div>
              <div className="text-white font-mono uppercase tracking-wider">{t.dashboard.bestStreak}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-white">{progress.totalDays}</div>
              <div className="text-white font-mono uppercase tracking-wider">{t.dashboard.totalDays}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-white">{progress.smokingHits}</div>
              <div className="text-white font-mono uppercase tracking-wider">{t.dashboard.smokingHits}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-white">{progress.dailyHits}</div>
              <div className="text-white font-mono uppercase tracking-wider">{t.dashboard.dailyHits}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <Target className="w-5 h-5 mr-2 text-white" />
          {t.dashboard.quickActions}
        </h3>
        
        <div className="flex flex-col space-y-3">
            <button
              onClick={() => updateStreak()}
              className="w-full py-4 px-6 bg-white text-black border-2 border-white font-mono uppercase tracking-wider text-lg font-bold hover:bg-black hover:text-white transition-all"
            >
              {t.dashboard.update}
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => subtractSmokingHit()}
                className="flex-1 py-3 px-4 bg-black text-white border-2 border-white font-mono uppercase tracking-wider text-sm font-bold hover:bg-white hover:text-black transition-all"
              >
                -1 {t.dashboard.smokingHits}
              </button>
              
              <button
                onClick={resetAchievements}
                className="flex-1 py-3 px-4 bg-black text-white border-2 border-white font-mono uppercase tracking-wider text-sm font-bold hover:bg-white hover:text-black transition-all"
              >
                Reset Logros
              </button>
            </div>
            
            <button
              onClick={handleReset}
              className="w-full py-3 px-6 bg-black text-white border-2 border-white font-mono uppercase tracking-wider text-sm font-bold hover:bg-white hover:text-black transition-all"
            >
              {t.dashboard.reset}
            </button>
          </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <TrendingUp className="w-5 h-5 mr-2 text-white" />
          {t.dashboard.statistics}
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-mono uppercase tracking-wider">{t.dashboard.startDate}</span>
            <span className="font-mono font-bold text-white">
              {formatDistanceToNow(startDate, { addSuffix: true, locale }).toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white font-mono uppercase tracking-wider">{t.dashboard.daysSinceStart}</span>
            <span className="font-mono font-bold text-white">{daysSinceStart}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white font-mono uppercase tracking-wider">{t.dashboard.triggersRegistered}</span>
            <span className="font-mono font-bold text-white">{progress.triggers.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white font-mono uppercase tracking-wider">{t.dashboard.achievementsObtained}</span>
            <span className="font-mono font-bold text-white">{progress.achievements.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Achievements */}
      {progress.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-mobile border-3 border-white shadow-brutalist"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
            <Award className="w-5 h-5 mr-2 text-white" />
            {t.dashboard.recentAchievements}
          </h3>
          
          <div className="space-y-3">
            {progress.achievements.slice(-3).reverse().map((achievement) => (
              <div key={achievement.id} className="flex items-center p-3 bg-white text-black border-2 border-white">
                <Award className="w-5 h-5 text-black mr-3" />
                <div>
                  <div className="font-bold text-black font-mono uppercase tracking-wider">{achievement.title}</div>
                  <div className="text-sm text-black font-mono uppercase tracking-wider">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Motivation Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-mobile bg-black text-white border-3 border-white shadow-brutalist"
      >
        <div className="text-center">
          <Heart className="w-8 h-8 text-white mx-auto mb-3" />
          <p className="text-white italic font-mono uppercase tracking-wider">
            {t.dashboard.motivationQuote}
          </p>
          <p className="text-sm text-white mt-2 font-mono uppercase tracking-wider">- QUEET WEED</p>
        </div>
      </motion.div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border-3 border-white p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider mb-2">
              ¿Reiniciar todo el progreso?
            </h3>
            <p className="text-white font-mono uppercase tracking-wider mb-6">
              Esta acción reiniciará completamente tu progreso:
              <br />• Días sin fumar: 0
              <br />• Contador de fumadas: 0
              <br />• Mejor racha: 0
              <br />• Fecha de inicio: hoy
              <br /><br />
              Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 btn-secondary font-mono uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 border-2 border-red-600 hover:border-red-700 transition-all font-mono uppercase tracking-wider"
              >
                Reiniciar Todo
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
