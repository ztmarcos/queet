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
  const { progress, loading, updateStreak, addSmokingHit, subtractSmokingHit, resetAchievements, reportWeedPurchase, resetEverything } = useProgress()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState('')

  const locale = language === 'es' ? es : enUS

  const handleUpdate = () => {
    updateStreak()
  }

  const handleReset = () => {
    setShowResetConfirm(true)
  }

  const confirmReset = () => {
    resetEverything()
    setShowResetConfirm(false)
  }

  const handlePurchaseClick = () => {
    setShowPurchaseModal(true)
  }

  const handlePurchaseSubmit = () => {
    const amount = parseFloat(purchaseAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }
    reportWeedPurchase(amount)
    setPurchaseAmount('')
    setShowPurchaseModal(false)
  }

  const handlePurchaseCancel = () => {
    setPurchaseAmount('')
    setShowPurchaseModal(false)
  }

  if (loading || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white font-mono uppercase tracking-wider">
          {t.dashboard.loading}
        </div>
      </div>
    )
  }

  const startDate = new Date(progress.startDate)
  const daysSinceStart = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-black text-white safe-area-inset">
      <div className="container mx-auto px-4 py-6 max-w-md md:max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold font-mono uppercase tracking-wider mb-2">
            QUEET WEED
          </h1>
          <p className="text-sm font-mono uppercase tracking-wider opacity-70">
            {t.dashboard.withoutSmoking}
          </p>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-mobile border-3 border-white shadow-brutalist mb-6"
        >
          <div className="text-center mb-6">
            <div className="text-6xl font-bold font-mono text-white mb-2">
              {progress.currentStreak}
            </div>
            <div className="text-white font-mono uppercase tracking-wider">
              {t.dashboard.days}
            </div>
          </div>

          <div className="flex justify-center space-x-2 sm:space-x-4 text-sm mb-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">{progress.longestStreak}</div>
              <div className="text-white font-mono uppercase tracking-wider text-xs sm:text-sm">{t.dashboard.bestStreak}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">{progress.totalDays}</div>
              <div className="text-white font-mono uppercase tracking-wider text-xs sm:text-sm">{t.dashboard.totalDays}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">{progress.smokingHits}</div>
              <div className="text-white font-mono uppercase tracking-wider text-xs sm:text-sm">{t.dashboard.smokingHits}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">{progress.dailyHits}</div>
              <div className="text-white font-mono uppercase tracking-wider text-xs sm:text-sm">{t.dashboard.dailyHits}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">{progress.weedPurchases || 0}</div>
              <div className="text-white font-mono uppercase tracking-wider text-xs sm:text-sm">COMPRAS</div>
              <div className="text-xs text-white font-mono uppercase tracking-wider opacity-70">
                (${Number(progress.totalMoneySpent || 0).toFixed(2)})
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-white font-mono uppercase tracking-wider opacity-50">
            Fecha inicio: {startDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </motion.div>



        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-mobile border-3 border-white shadow-brutalist mb-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
            <Target className="w-5 h-5 mr-2 text-white" />
            {t.dashboard.quickActions}
          </h3>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleUpdate}
              className="w-full py-4 px-6 bg-white text-black border-2 border-white font-mono uppercase tracking-wider text-lg font-bold hover:bg-black hover:text-white transition-all btn-touch"
            >
              {t.dashboard.update}
            </button>
            
            <button
              onClick={addSmokingHit}
              className="w-full py-3 px-6 bg-green-600 text-white border-2 border-green-600 font-mono uppercase tracking-wider text-sm font-bold hover:bg-green-700 transition-all btn-touch"
            >
              + HIT
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={subtractSmokingHit}
                className="flex-1 py-3 px-4 bg-black text-white border-2 border-white font-mono uppercase tracking-wider text-sm font-bold hover:bg-white hover:text-black transition-all btn-touch"
              >
                {t.dashboard.subtractHit}
              </button>
              
              <button
                onClick={handlePurchaseClick}
                className="flex-1 py-3 px-4 bg-black text-green-500 border-2 border-white font-mono uppercase tracking-wider text-sm font-bold hover:bg-white hover:text-green-600 transition-all btn-touch"
              >
                $
              </button>
            </div>
            
            <button
              onClick={() => {
                console.log('=== DEBUG INFO ===')
                console.log('Progress:', progress)
                console.log('Daily History:', progress?.dailyHistory)
                console.log('Today key:', new Date().toISOString().split('T')[0])
                console.log('Today hits in history:', progress?.dailyHistory[new Date().toISOString().split('T')[0]])
                toast.success('Debug info logged to console')
              }}
              className="w-full py-2 px-4 bg-blue-600 text-white border-2 border-blue-600 font-mono uppercase tracking-wider text-xs font-bold hover:bg-blue-700 transition-all btn-touch"
            >
              DEBUG INFO
            </button>
            
            <button
              onClick={() => {
                const { dataManager } = require('@/lib/localStorage')
                dataManager.completeReset()
                toast.success('Sistema completamente reseteado. Recarga la página.')
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
              }}
              className="w-full py-2 px-4 bg-red-800 text-white border-2 border-red-800 font-mono uppercase tracking-wider text-xs font-bold hover:bg-red-900 transition-all btn-touch"
            >
              RESET COMPLETO
            </button>
            

            
            <button
              onClick={handleReset}
              className="w-full py-3 px-6 bg-black text-white border-2 border-white font-mono uppercase tracking-wider text-sm font-bold hover:bg-white hover:text-black transition-all btn-touch"
            >
              {t.dashboard.reset}
            </button>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-mobile border-3 border-white shadow-brutalist mb-6"
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
              <span className="font-mono font-bold text-white">{progress.triggers?.length || 0}</span>
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
            transition={{ delay: 0.4 }}
            className="card-mobile border-3 border-white shadow-brutalist mb-6"
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
          transition={{ delay: 0.5 }}
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

        {/* Purchase Modal */}
        {showPurchaseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black border-3 border-white p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider mb-2">
                REGISTRAR COMPRA
              </h3>
              <p className="text-white font-mono uppercase tracking-wider mb-4">
                Ingresa el monto gastado en la compra:
              </p>
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black text-white border-2 border-white p-3 font-mono uppercase tracking-wider mb-6 focus:outline-none focus:border-green-500"
                step="0.01"
                min="0"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handlePurchaseCancel}
                  className="flex-1 bg-black text-white border-2 border-white font-bold py-3 px-6 hover:bg-white hover:text-black transition-all font-mono uppercase tracking-wider btn-touch"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePurchaseSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 border-2 border-green-600 hover:border-green-700 transition-all font-mono uppercase tracking-wider btn-touch"
                >
                  Registrar
                </button>
              </div>
            </motion.div>
          </div>
        )}

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
                  className="flex-1 bg-black text-white border-2 border-white font-bold py-3 px-6 hover:bg-white hover:text-black transition-all font-mono uppercase tracking-wider btn-touch"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 border-2 border-red-600 hover:border-red-700 transition-all font-mono uppercase tracking-wider btn-touch"
                >
                  Reiniciar Todo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
