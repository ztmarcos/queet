import { useState, useEffect, useCallback } from 'react'
import { progressStorage, dataManager } from '@/lib/localStorage'
import toast from 'react-hot-toast'

export interface ProgressData {
  startDate: string
  currentStreak: number
  longestStreak: number
  totalDays: number
  lastResetDate: string
  smokingHits: number
  dailyHits: number
  lastHitDate: string
  weedPurchases: number
  lastPurchaseDate: string
  triggers: Trigger[]
  achievements: Achievement[]
}

export interface Trigger {
  id: string
  date: string
  type: string
  intensity: number
  notes: string
  handled: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: string
}

// Mock progress data for first time users
const mockProgress: ProgressData = {
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  currentStreak: 7,
  longestStreak: 7,
  totalDays: 7,
  lastResetDate: new Date().toISOString(),
  smokingHits: 0,
  dailyHits: 0,
  lastHitDate: new Date().toISOString(),
  weedPurchases: 0,
  lastPurchaseDate: new Date().toISOString(),
  triggers: [
    {
      id: '1',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'stress',
      intensity: 7,
      notes: 'Trabajo estresante',
      handled: true,
    },
    {
      id: '2',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'boredom',
      intensity: 4,
      notes: 'Aburrido en casa',
      handled: false,
    },
  ],
  achievements: [],
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const cleanDuplicateAchievements = useCallback((achievements: Achievement[]): Achievement[] => {
    const seen = new Set<string>()
    return achievements.filter(achievement => {
      const duplicate = seen.has(achievement.title)
      seen.add(achievement.title)
      return !duplicate
    })
  }, [])

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true)

      // Always use localStorage (no Firebase)
      let savedProgress = progressStorage.get()
      
      if (!savedProgress) {
        // Initialize with mock data for first time users
        savedProgress = mockProgress
        progressStorage.set(savedProgress)
      } else {
        // Clean duplicate achievements if they exist
        if (savedProgress.achievements && savedProgress.achievements.length > 0) {
          const cleanedAchievements = cleanDuplicateAchievements(savedProgress.achievements)
          if (cleanedAchievements.length !== savedProgress.achievements.length) {
            savedProgress = {
              ...savedProgress,
              achievements: cleanedAchievements
            }
            progressStorage.set(savedProgress)
          }
        }
        
        // Force clean all achievements if they exist (temporary fix)
        if (savedProgress.achievements && savedProgress.achievements.length > 0) {
          savedProgress = {
            ...savedProgress,
            achievements: []
          }
          progressStorage.set(savedProgress)
        }
      }
      
      setProgress(savedProgress)
      setLoading(false)
      setInitialized(true)
    } catch (error) {
      console.error('Error loading progress:', error)
      toast.error('Error al cargar el progreso')
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }, [initialized])

  useEffect(() => {
    if (!initialized) {
      loadProgress()
    }
  }, [initialized, loadProgress])

  // Auto-backup every time progress changes
  useEffect(() => {
    if (progress) {
      // Temporarily disable integrity check to fix loading issue
      // const isIntegrityValid = dataManager.checkIntegrity()
      // if (!isIntegrityValid) {
      //   console.warn('Data integrity check failed')
      // }
      
      // Create backup reminder
      dataManager.createBackupReminder()
    }
  }, [progress])

  const checkAchievements = useCallback(async (currentProgress: ProgressData) => {
    const newAchievements: Achievement[] = []

    // Get existing achievement titles to avoid duplicates
    const existingTitles = currentProgress.achievements.map(a => a.title)

    // Check for 1 day achievement
    if (currentProgress.currentStreak >= 1 && !existingTitles.includes('Primer día')) {
      newAchievements.push({
        id: `achievement-${Date.now()}-1`,
        title: 'Primer día',
        description: '¡Completaste tu primer día sin fumar!',
        date: new Date().toISOString(),
        type: 'streak'
      })
    }

    // Check for 7 days achievement
    if (currentProgress.currentStreak >= 7 && !existingTitles.includes('Una semana')) {
      newAchievements.push({
        id: `achievement-${Date.now()}-7`,
        title: 'Una semana',
        description: '¡Una semana completa sin fumar!',
        date: new Date().toISOString(),
        type: 'streak'
      })
    }

    // Check for 30 days achievement
    if (currentProgress.currentStreak >= 30 && !existingTitles.includes('Un mes')) {
      newAchievements.push({
        id: `achievement-${Date.now()}-30`,
        title: 'Un mes',
        description: '¡Un mes completo sin fumar!',
        date: new Date().toISOString(),
        type: 'streak'
      })
    }

    if (newAchievements.length > 0) {
      const updatedProgress = {
        ...currentProgress,
        achievements: [...currentProgress.achievements, ...newAchievements]
      }
      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)

      // Show achievement notifications
      newAchievements.forEach(achievement => {
        toast.success(`🎉 ${achievement.title}: ${achievement.description}`)
      })
    }
  }, [])

  const updateStreak = useCallback(async (reset: boolean = false) => {
    if (!progress) return

    try {
      // Always use localStorage (no Firebase)
      const today = new Date()
      const startDate = new Date(progress.startDate)
      const lastReset = new Date(progress.lastResetDate)
      
      // Calculate total days since start
      const totalDaysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Calculate days since last reset
      const daysSinceLastReset = Math.floor((today.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))

      let newStreak = progress.currentStreak
      let newTotalDays = progress.totalDays

      if (reset) {
        // Reset progress - start counting from today
        newStreak = 0
        newTotalDays = 0
        const updatedProgress = {
          ...progress,
          startDate: today.toISOString(),
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          smokingHits: 0,
          dailyHits: 0,
          lastHitDate: today.toISOString(),
          lastResetDate: today.toISOString(),
          triggers: [],
          achievements: [],
        }
        progressStorage.set(updatedProgress)
        setProgress(updatedProgress)
        toast.success('Progreso reiniciado')
        return
      } else {
        // Log smoking incident - reset streak to 0 and increment hits
        newStreak = 0
        newTotalDays = totalDaysSinceStart
      }

      const updatedProgress = {
        ...progress,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, progress.longestStreak),
        totalDays: newTotalDays,
        smokingHits: reset ? 0 : progress.smokingHits + 1,
        dailyHits: reset ? 0 : (today.toDateString() !== new Date(progress.lastHitDate).toDateString() ? 1 : progress.dailyHits + 1),
        lastHitDate: reset ? today.toISOString() : progress.lastHitDate,
        lastResetDate: today.toISOString(),
        triggers: reset ? [] : progress.triggers,
        achievements: reset ? [] : progress.achievements,
      }

      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)

      // Check for achievements
      checkAchievements(updatedProgress)

      toast.success('Incidente registrado - Streak reiniciado')
    } catch (error) {
      console.error('Error updating streak:', error)
      toast.error('Error al registrar incidente')
    }
  }, [progress, checkAchievements])

  // Auto-update streak at the end of the day
  const autoUpdateStreak = useCallback(async () => {
    if (!progress) return

    try {
      const today = new Date()
      const startDate = new Date(progress.startDate)
      const lastReset = new Date(progress.lastResetDate)
      const lastHitDate = new Date(progress.lastHitDate)
      
      // Calculate total days since start
      const totalDaysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Calculate days since last reset
      const daysSinceLastReset = Math.floor((today.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))

      // Check if there were hits today
      const hadHitsToday = today.toDateString() === lastHitDate.toDateString() && progress.dailyHits > 0

      // Only increment streak if no hits today
      if (!hadHitsToday && daysSinceLastReset >= 1) {
        const newStreak = progress.currentStreak + 1
        const newTotalDays = Math.max(progress.totalDays, totalDaysSinceStart)

        const updatedProgress = {
          ...progress,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, progress.longestStreak),
          totalDays: newTotalDays,
          lastResetDate: today.toISOString(),
          dailyHits: 0, // Reset daily hits
        }

        // Always use localStorage (no Firebase)
        progressStorage.set(updatedProgress)
        setProgress(updatedProgress)

        // Check for achievements
        checkAchievements(updatedProgress)
      }
    } catch (error) {
      console.error('Error auto-updating streak:', error)
    }
  }, [progress, checkAchievements])

  const addTrigger = useCallback(async (trigger: Omit<Trigger, 'id'>) => {
    if (!progress) return

    try {
      const newTrigger: Trigger = {
        ...trigger,
        id: Date.now().toString(),
      }

      const updatedProgress = {
        ...progress,
        triggers: [...progress.triggers, newTrigger],
      }

      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)
      toast.success('Trigger registrado')
    } catch (error) {
      console.error('Error adding trigger:', error)
      toast.error('Error al registrar trigger')
    }
  }, [progress])

  const deleteTrigger = useCallback(async (triggerId: string) => {
    if (!progress) return

    try {
      const updatedTriggers = progress.triggers.filter(t => t.id !== triggerId)
      const updatedProgress = {
        ...progress,
        triggers: updatedTriggers,
      }

      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)
      toast.success('Trigger eliminado')
    } catch (error) {
      console.error('Error deleting trigger:', error)
      toast.error('Error al eliminar trigger')
    }
  }, [progress])

  const addSmokingHit = useCallback(async () => {
    if (!progress) return

    try {
      const today = new Date()
      const isNewDay = today.toDateString() !== new Date(progress.lastHitDate).toDateString()
      
      const updatedProgress = {
        ...progress,
        smokingHits: progress.smokingHits + 1,
        dailyHits: isNewDay ? 1 : progress.dailyHits + 1,
        lastHitDate: today.toISOString(),
      }

      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)
      toast.success('Hit registrado')
    } catch (error) {
      console.error('Error adding smoking hit:', error)
      toast.error('Error al registrar hit')
    }
  }, [progress])

  const subtractSmokingHit = useCallback(async () => {
    if (!progress) return

    try {
      const updatedProgress = {
        ...progress,
        smokingHits: Math.max(0, progress.smokingHits - 1),
        dailyHits: Math.max(0, progress.dailyHits - 1),
      }

      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)
      toast.success('Hit restado')
    } catch (error) {
      console.error('Error subtracting smoking hit:', error)
      toast.error('Error al restar hit')
    }
  }, [progress])

  const resetAchievements = useCallback(async () => {
    if (!progress) return

    try {
      const updatedProgress = {
        ...progress,
        achievements: [],
      }

      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)
      toast.success('Logros reiniciados')
    } catch (error) {
      console.error('Error resetting achievements:', error)
      toast.error('Error al reiniciar logros')
    }
  }, [progress])

  const reportWeedPurchase = useCallback(async () => {
    if (!progress) return

    try {
      const today = new Date()
      const updatedProgress = {
        ...progress,
        weedPurchases: progress.weedPurchases + 1,
        lastPurchaseDate: today.toISOString(),
      }

      progressStorage.set(updatedProgress)
      setProgress(updatedProgress)
      toast.success('Compra de weed registrada')
    } catch (error) {
      console.error('Error reporting weed purchase:', error)
      toast.error('Error al registrar compra')
    }
  }, [progress])

  return {
    progress,
    loading,
    updateStreak,
    addTrigger,
    deleteTrigger,
    addSmokingHit,
    subtractSmokingHit,
    resetAchievements,
    reportWeedPurchase,
    autoUpdateStreak,
  }
}
