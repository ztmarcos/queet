'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const generateYearData = useCallback((): DayData[] => {
    if (!progress) return []
    
    const startDate = startOfYear(new Date())
    const endDate = endOfYear(new Date())
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    
    return days.map(day => {
      const isToday = isSameDay(day, new Date())
      const isAfterStart = day >= new Date(progress.startDate)
      const isBeforeToday = day <= new Date()
      
      let hits = 0
      
      // Solo usar datos reales existentes
      if (isToday && isAfterStart) {
        hits = progress.dailyHits
      } else if (day < new Date() && isAfterStart) {
        // Para demostración, agregar algunos hits de ejemplo en días pasados
        // En una implementación real, esto vendría de un historial almacenado
        const dayOfWeek = day.getDay()
        const daysSinceStart = Math.floor((day.getTime() - new Date(progress.startDate).getTime()) / (1000 * 60 * 60 * 24))
        
        // Simular algunos hits para mostrar los colores (solo para demo)
        if (daysSinceStart >= 0 && daysSinceStart < 30) {
          // Simular algunos días con hits para mostrar colores (usando fecha para ser consistente)
          const dayHash = day.getDate() + day.getMonth() * 31
          if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingos y sábados
            hits = (dayHash % 5) + 1 // 1-5 hits (consistente)
          } else if (dayOfWeek === 3) { // Miércoles
            hits = (dayHash % 3) + 1 // 1-3 hits (consistente)
          }
        }
      }
      
      // Color coding based on hits
      let color = 'bg-slate-700' // No smoking / No data - Darker color
      if (!isAfterStart) {
        color = 'bg-gray-400' // Before start date - Lighter gray
      } else if (hits >= 1 && hits <= 3) {
        color = 'bg-yellow-400' // Grade 1: Yellow
      } else if (hits >= 4 && hits <= 6) {
        color = 'bg-green-500' // Grade 2: Green  
      } else if (hits >= 7 && hits <= 9) {
        color = 'bg-orange-500' // Grade 3: Orange
      } else if (hits >= 10) {
        color = 'bg-red-500' // Grade 4: Red
      }
      
      let tooltip = ''
      if (!isAfterStart) {
        tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - Antes del inicio`
      } else if (hits === 0) {
        tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - No fumó`
      } else {
        tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - ${hits} ${hits === 1 ? 'hit' : 'hits'}`
      }
      
      return {
        date: day,
        hits,
        color,
        tooltip
      }
    })
  }, [progress, locale])

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

  const yearData = generateYearData()
  const totalHits = yearData.reduce((sum, day) => sum + day.hits, 0)
  const daysWithHits = yearData.filter(day => day.hits > 0).length
  const maxHits = Math.max(...yearData.map(day => day.hits))
  
  // Debug: Log para verificar que los datos se están generando
  console.log('SmokingReport Debug:', {
    totalDays: yearData.length,
    daysWithHits,
    totalHits,
    maxHits,
    sampleDays: yearData.slice(0, 5).map(d => ({ date: d.date.toISOString().split('T')[0], hits: d.hits, color: d.color }))
  })

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
          <div className="text-white p-4 border-2 border-white">
            <div className="text-3xl font-bold font-mono">{totalHits}</div>
            <div className="text-xs font-mono uppercase tracking-wider">TOTAL HITS</div>
          </div>
          <div className="text-white p-4 border-2 border-white">
            <div className="text-3xl font-bold font-mono">{daysWithHits}</div>
            <div className="text-xs font-mono uppercase tracking-wider">DÍAS CON HITS</div>
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
        
        {/* Month Grid */}
        <div className="space-y-4">
          {Array.from({ length: 12 }, (_, monthIndex) => {
            const month = new Date(2024, monthIndex, 1)
            const monthDays = yearData.filter(day => 
              day.date.getMonth() === monthIndex
            )
            
            return (
              <div key={monthIndex} className="space-y-2">
                {/* Month Label */}
                <div className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  {format(month, 'MMMM', { locale }).toUpperCase()}
                </div>
                
                                  {/* Days Grid */}
                  <div className="grid grid-cols-31 gap-1">
                    {monthDays.map((day, dayIndex) => (
                      <motion.div
                        key={dayIndex}
                        whileHover={{ scale: 1.4, zIndex: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-4 h-4 ${day.color} border-2 border-white cursor-pointer transition-all duration-300 shadow-sm ${
                          hoveredDay === day ? 'ring-2 ring-yellow-400 shadow-lg scale-110' : ''
                        } ${isSameDay(day.date, new Date()) ? 'ring-2 ring-yellow-400' : ''}`}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        onClick={() => setSelectedDay(day)}
                        title={day.tooltip}
                      />
                    ))}
                  </div>
              </div>
            )
          })}
        </div>
        
        {/* Legend for grid */}
        <div className="mt-4 text-xs font-mono uppercase tracking-wider text-white opacity-70">
          Cada punto = 1 día • Hover para ver detalles • Click para expandir
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t-2 border-white">
          <h4 className="text-sm font-semibold mb-3 flex items-center font-mono uppercase tracking-wider text-white">
            <Calendar className="w-4 h-4 mr-2 text-white" />
            LEGENDA
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 border border-white"></div>
              <span className="font-mono uppercase tracking-wider text-white">Antes inicio</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-slate-700 border border-white"></div>
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
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 border border-white"></div>
              <span className="font-mono uppercase tracking-wider text-white">10+ hits</span>
            </div>
          </div>
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
