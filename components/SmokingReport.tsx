'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Calendar, BarChart3 } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameDay } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import { progressStorage, userStorage, settingsStorage } from '@/lib/localStorage'

interface DayData {
  date: Date
  hits: number
  color: string
  tooltip: string
  dateKey: string // Added dateKey to the interface
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
    
    console.log('=== GENERATING YEAR DATA ===')
    console.log('Progress received:', progress)
    console.log('DailyHits:', progress.dailyHits)
    console.log('DailyHistory:', progress.dailyHistory)
    
    const startDate = startOfYear(new Date())
    const endDate = endOfYear(new Date())
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    
    return days.map(day => {
      const isToday = isSameDay(day, new Date())
      const userStartDate = new Date(progress.startDate)
      const isAfterStart = day >= userStartDate
      
      let hits = 0
      const dateKey = format(day, 'yyyy-MM-dd')
      
      // Para el día actual, SIEMPRE considerar que es después del inicio
      // Si es hoy, siempre mostrar hits independientemente del startDate
      const shouldShowHits = isToday || isAfterStart
      
      if (isToday) {
        // Para hoy, SIEMPRE usar dailyHits (datos en tiempo real)
        hits = progress.dailyHits
        console.log('Today hits:', hits, 'from dailyHits:', progress.dailyHits)
      } else if (day < new Date() && isAfterStart) {
        // Para días pasados, usar los datos del dailyHistory
        hits = progress.dailyHistory[dateKey] || 0
        // Debug para días pasados
        if (hits > 0) {
          console.log(`Past day ${dateKey} has ${hits} hits from dailyHistory`)
        }
      }
      
      // Color coding based on hits
      let color = 'bg-slate-700' // No smoking / No data - Darker color
      if (isToday || shouldShowHits) {
        // Para hoy o días válidos, usar colores basados en hits
        if (hits >= 1 && hits <= 3) {
          color = 'bg-yellow-400' // Grade 1: Yellow
        } else if (hits >= 4 && hits <= 6) {
          color = 'bg-green-500' // Grade 2: Green  
        } else if (hits >= 7 && hits <= 9) {
          color = 'bg-orange-500' // Grade 3: Orange
        } else if (hits >= 10) {
          color = 'bg-red-500' // Grade 4: Red
        } else {
          color = 'bg-slate-700' // No hits
        }
      } else {
        color = 'bg-gray-400' // Before start date - Lighter gray
      }
      
      let tooltip = ''
      if (isToday) {
        // Para hoy, siempre mostrar tooltip con datos
        if (hits === 0) {
          tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - No fumó (HOY)`
        } else {
          tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - ${hits} ${hits === 1 ? 'hit' : 'hits'} (HOY)`
        }
      } else if (!shouldShowHits) {
        tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - Antes del inicio`
      } else if (hits === 0) {
        tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - No fumó`
      } else {
        tooltip = `${format(day, 'EEEE, d MMMM yyyy', { locale })} - ${hits} ${hits === 1 ? 'hit' : 'hits'}`
      }
      
      const result = {
        date: day,
        hits,
        color,
        tooltip,
        dateKey // Agregar dateKey para referencia
      }
      
      if (isToday) {
        console.log('Today data generated:', result)
        console.log('Should show hits:', shouldShowHits)
        console.log('Is after start:', isAfterStart)
      }
      
      return result
    })
  }, [progress, locale])

  // Función para obtener los hits actualizados de un día específico
  const getCurrentHitsForDay = useCallback((day: Date): number => {
    if (!progress) return 0
    
    const isToday = isSameDay(day, new Date())
    const userStartDate = new Date(progress.startDate)
    const isAfterStart = day >= userStartDate
    
    if (!isAfterStart) return 0
    
    const dateKey = format(day, 'yyyy-MM-dd')
    
    if (isToday) {
      // Para hoy, SIEMPRE usar dailyHits (datos en tiempo real)
      return progress.dailyHits
    } else {
      // Para días pasados, usar dailyHistory
      return progress.dailyHistory[dateKey] || 0
    }
  }, [progress])

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
            <div className="text-3xl font-bold font-mono">{progress.smokingHits}</div>
            <div className="text-xs font-mono uppercase tracking-wider">TOTAL HITS</div>
          </div>
          <div className="text-white p-4 border-2 border-white">
            <div className="text-3xl font-bold font-mono">{progress.dailyHits}</div>
            <div className="text-xs font-mono uppercase tracking-wider">HITS HOY</div>
          </div>
        </div>
        
        {/* <button
          onClick={() => {
            console.log('=== SMOKING REPORT DEBUG ===')
            console.log('Progress:', progress)
            console.log('DailyHits:', progress.dailyHits)
            console.log('DailyHistory:', progress.dailyHistory)
            console.log('Today key:', new Date().toISOString().split('T')[0])
            console.log('Today in history:', progress.dailyHistory[new Date().toISOString().split('T')[0]])
            
            // Debug específico para el día anterior (martes 19 de agosto)
            const yesterdayKey = '2025-08-19'
            console.log('Yesterday key:', yesterdayKey)
            console.log('Yesterday in history:', progress.dailyHistory[yesterdayKey])
            
            // Debug para todos los días con hits
            const daysWithHits = Object.entries(progress.dailyHistory).filter(([key, hits]) => hits > 0)
            console.log('All days with hits:', daysWithHits)
            
            console.log('Year data:', yearData)
            console.log('Today data:', yearData.find(day => isSameDay(day.date, new Date())))
            console.log('Yesterday data:', yearData.find(day => day.dateKey === yesterdayKey))
            toast.success('Smoking Report debug logged')
          }}
          className="w-full mt-4 py-2 px-4 bg-blue-600 text-white border-2 border-blue-600 font-mono uppercase tracking-wider text-xs font-bold hover:bg-blue-700 transition-all btn-touch"
        >
          DEBUG SMOKING REPORT
        </button> */}
        
        {/* <button
          onClick={() => {
            console.log('=== FIX START DATE DEBUG ===')
            console.log('Current startDate:', progress.startDate)
            console.log('StartDate as Date:', new Date(progress.startDate))
            
            // Verificar si la fecha de inicio es muy reciente
            const startDate = new Date(progress.startDate)
            const yesterday = new Date('2025-08-19')
            const isStartDateAfterYesterday = startDate > yesterday
            
            console.log('Yesterday date:', yesterday)
            console.log('Is startDate after yesterday:', isStartDateAfterYesterday)
            
            if (isStartDateAfterYesterday) {
              console.log('PROBLEM: Start date is after yesterday, this would hide yesterday\'s data')
              toast.error('Fecha de inicio muy reciente - oculta datos anteriores')
            } else {
              console.log('Start date looks correct')
              toast.success('Fecha de inicio correcta')
            }
          }}
          className="w-full mt-2 py-2 px-4 bg-red-600 text-white border-2 border-red-600 font-mono uppercase tracking-wider text-xs font-bold hover:bg-red-700 transition-all btn-touch"
        >
          CHECK START DATE
        </button> */}
        
        {/* <button
          onClick={() => {
            console.log('=== FIX START DATE ===')
            
            // Encontrar la fecha más antigua en dailyHistory
            const datesWithData = Object.keys(progress.dailyHistory).filter(key => progress.dailyHistory[key] > 0)
            if (datesWithData.length > 0) {
              const oldestDate = datesWithData.sort()[0]
              console.log('Oldest date with data:', oldestDate)
              
              // Actualizar la fecha de inicio para incluir todos los datos
              const newStartDate = new Date(oldestDate)
              newStartDate.setDate(newStartDate.getDate() - 1) // Un día antes del primer dato
              
              console.log('New start date:', newStartDate.toISOString())
              
              // Actualizar el progreso
              const updatedProgress = {
                ...progress,
                startDate: newStartDate.toISOString()
              }
              
              // Guardar en localStorage
              progressStorage.set(updatedProgress)
              
              console.log('Start date fixed')
              toast.success('Fecha de inicio corregida')
              
              // Recargar la página para aplicar los cambios
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else {
              toast.error('No hay datos históricos para corregir')
            }
          }}
          className="w-full mt-2 py-2 px-4 bg-green-600 text-white border-2 border-green-600 font-mono uppercase tracking-wider text-xs font-bold hover:bg-green-700 transition-all btn-touch"
        >
          FIX START DATE
        </button> */}
        
        {/* <button
          onClick={() => {
            console.log('=== COMPLETE DIAGNOSTIC ===')
            console.log('=== PROGRESS DATA ===')
            console.log('Progress object:', progress)
            console.log('Start date:', progress.startDate)
            console.log('Start date as Date:', new Date(progress.startDate))
            console.log('Daily hits:', progress.dailyHits)
            console.log('Smoking hits:', progress.smokingHits)
            
            console.log('=== DAILY HISTORY ===')
            console.log('Daily history:', progress.dailyHistory)
            console.log('Daily history keys:', Object.keys(progress.dailyHistory))
            console.log('Daily history entries:', Object.entries(progress.dailyHistory))
            
            console.log('=== DATE ANALYSIS ===')
            const today = new Date()
            const yesterday = new Date('2025-08-19')
            const startDate = new Date(progress.startDate)
            
            console.log('Today:', today.toISOString())
            console.log('Yesterday:', yesterday.toISOString())
            console.log('Start date:', startDate.toISOString())
            console.log('Is yesterday after start?', yesterday >= startDate)
            console.log('Is today after start?', today >= startDate)
            
            console.log('=== YEAR DATA ANALYSIS ===')
            const todayKey = today.toISOString().split('T')[0]
            const yesterdayKey = '2025-08-19'
            
            console.log('Today key:', todayKey)
            console.log('Yesterday key:', yesterdayKey)
            console.log('Today in history:', progress.dailyHistory[todayKey])
            console.log('Yesterday in history:', progress.dailyHistory[yesterdayKey])
            
            // Buscar el día de ayer en yearData
            const yesterdayInYearData = yearData.find(day => day.dateKey === yesterdayKey)
            console.log('Yesterday in yearData:', yesterdayInYearData)
            
            console.log('=== ALL DAYS WITH HITS ===')
            const daysWithHits = Object.entries(progress.dailyHistory).filter(([key, hits]) => hits > 0)
            console.log('Days with hits:', daysWithHits)
            
            toast.success('Diagnóstico completo en consola')
          }}
          className="w-full mt-2 py-2 px-4 bg-purple-600 text-white border-2 border-purple-600 font-mono uppercase tracking-wider text-xs font-bold hover:bg-purple-700 transition-all btn-touch"
        >
          COMPLETE DIAGNOSTIC
        </button> */}
        
        <button
          onClick={() => {
            console.log('=== AUTO REPAIR ===')
            
            // Detectar problemas comunes
            const problems: string[] = []
            const fixes: (() => any)[] = []
            
            // 1. Verificar si la fecha de inicio es muy reciente
            const startDate = new Date(progress.startDate)
            const datesWithData = Object.keys(progress.dailyHistory).filter(key => progress.dailyHistory[key] > 0)
            
            if (datesWithData.length > 0) {
              const oldestDate = new Date(datesWithData.sort()[0])
              if (startDate > oldestDate) {
                problems.push('Fecha de inicio después del primer dato')
                fixes.push(() => {
                  const newStartDate = new Date(oldestDate)
                  newStartDate.setDate(newStartDate.getDate() - 1)
                  return { startDate: newStartDate.toISOString() }
                })
              }
            }
            
            // 2. Verificar si hay inconsistencias en dailyHistory
            const todayKey = new Date().toISOString().split('T')[0]
            if (progress.dailyHistory[todayKey] !== undefined && 
                progress.dailyHistory[todayKey] !== progress.dailyHits) {
              problems.push('dailyHits y dailyHistory no coinciden para hoy')
              fixes.push(() => {
                return {
                  dailyHistory: {
                    ...progress.dailyHistory,
                    [todayKey]: progress.dailyHits
                  }
                }
              })
            }
            
            // 3. Verificar si faltan entradas en dailyHistory
            if (progress.dailyHits > 0 && progress.dailyHistory[todayKey] === undefined) {
              problems.push('Falta entrada de hoy en dailyHistory')
              fixes.push(() => {
                return {
                  dailyHistory: {
                    ...progress.dailyHistory,
                    [todayKey]: progress.dailyHits
                  }
                }
              })
            }
            
            console.log('Problemas detectados:', problems)
            
            if (problems.length > 0) {
              // Aplicar todas las correcciones
              let updatedProgress = { ...progress }
              
              fixes.forEach((fix, index) => {
                console.log(`Aplicando corrección ${index + 1}:`, problems[index])
                const fixData = fix()
                updatedProgress = { ...updatedProgress, ...fixData }
              })
              
              // Guardar progreso corregido
              progressStorage.set(updatedProgress)
              
              console.log('Progreso corregido:', updatedProgress)
              toast.success(`${problems.length} problema(s) corregido(s)`)
              
              // Recargar página
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            } else {
              console.log('No se detectaron problemas')
              toast.success('No se detectaron problemas')
            }
          }}
          className="w-full mt-2 py-2 px-4 bg-orange-600 text-white border-2 border-orange-600 font-mono uppercase tracking-wider text-xs font-bold hover:bg-orange-700 transition-all btn-touch"
        >
          AUTO REPAIR
        </button>
        
        <button
          onClick={() => {
            console.log('=== IMPORT USER DATA ===')
            
            // Datos del usuario
            const userData = {
              "progress": {
                "startDate": "2025-08-18T00:00:00.000Z", // Corregido: un día antes del primer dato
                "currentStreak": 0,
                "longestStreak": 0,
                "totalDays": 0,
                "lastResetDate": "2025-08-19T19:04:52.647Z",
                "smokingHits": 5,
                "dailyHits": 1,
                "lastHitDate": "2025-08-20T18:04:20.006Z",
                "weedPurchases": 1,
                "totalMoneySpent": 685,
                "lastPurchaseDate": "2025-08-19T20:04:11.921Z",
                "triggers": [],
                "achievements": [],
                "dailyHistory": {
                  "2025-08-19": 4,
                  "2025-08-20": 1
                }
              },
              "user": {
                "id": "local-user-1755713383891",
                "email": "user@queet.app",
                "createdAt": "2025-08-20T18:09:43.891Z"
              },
              "settings": {
                "notifications": true,
                "darkMode": false,
                "language": "es" as "es"
              }
            }
            
            console.log('Importando datos del usuario...')
            console.log('Datos a importar:', userData)
            
            // Importar progreso
            progressStorage.set(userData.progress)
            
            // Importar usuario
            userStorage.set(userData.user)
            
            // Importar configuración
            settingsStorage.set(userData.settings)
            
            console.log('Datos importados correctamente')
            console.log('Fecha de inicio corregida a:', userData.progress.startDate)
            console.log('Esto permitirá mostrar los datos del 19 de agosto')
            
            toast.success('Datos importados y fecha corregida')
            
            // Recargar página
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }}
          className="w-full mt-2 py-2 px-4 bg-yellow-600 text-white border-2 border-yellow-600 font-mono uppercase tracking-wider text-xs font-bold hover:bg-yellow-700 transition-all btn-touch"
        >
          IMPORT USER DATA
        </button>
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
        <div className="space-y-6">
          {Array.from({ length: 12 }, (_, monthIndex) => {
            const month = new Date(2024, monthIndex, 1)
            const monthDays = yearData.filter(day => 
              day.date.getMonth() === monthIndex
            )
            
            return (
              <div key={monthIndex} className="space-y-3">
                {/* Month Label */}
                <div className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                  {format(month, 'MMMM', { locale }).toUpperCase()}
                </div>
                
                                  {/* Days Grid */}
                  <div className="flex flex-wrap gap-0.5 justify-start">
                    {monthDays.map((day, dayIndex) => {
                      const isToday = isSameDay(day.date, new Date())
                      if (isToday) {
                        console.log('Rendering today in calendar:', {
                          date: day.date,
                          hits: day.hits,
                          color: day.color,
                          tooltip: day.tooltip,
                          isToday
                        })
                      }
                      
                      return (
                        <motion.div
                          key={dayIndex}
                          whileTap={{ scale: 0.9 }}
                          className={`w-2.5 h-2.5 rounded-full ${day.color} cursor-pointer transition-all duration-300 shadow-sm ${
                            hoveredDay === day ? 'ring-2 ring-yellow-400 shadow-lg scale-110' : ''
                          } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onTouchStart={() => setHoveredDay(day)}
                          onTouchEnd={() => setHoveredDay(null)}
                          onClick={() => setSelectedDay(day)}
                          title={day.tooltip}
                        />
                      )
                    })}
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
            
            {/* Usar los datos del selectedDay que ya están correctos */}
            {(() => {
              const isToday = isSameDay(selectedDay.date, new Date())
              
              console.log('Selected day info:', {
                selectedDay,
                hits: selectedDay.hits,
                isToday
              })
              
              return (
                <>
                  <div className="text-3xl font-bold font-mono text-white mb-2">
                    {selectedDay.hits}
                  </div>
                  <div className="text-sm font-mono uppercase tracking-wider text-white opacity-70 mb-2">
                    {selectedDay.hits === 0 ? 'NO FUMÓ' : selectedDay.hits === 1 ? 'HIT' : 'HITS'}
                    {isToday && ' (HOY)'}
                  </div>
                  
                  {/* Mostrar información adicional si es hoy */}
                  {isToday && (
                    <div className="text-xs font-mono uppercase tracking-wider text-white opacity-50 mb-3">
                      Datos en tiempo real
                    </div>
                  )}
                  
                  {/* Mostrar información de debug */}
                  <div className="text-xs font-mono uppercase tracking-wider text-blue-400 mb-3">
                    Color: {selectedDay.color} | Tooltip: {selectedDay.tooltip}
                  </div>
                </>
              )
            })()}
            
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
