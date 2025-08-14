import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from './useAuth'
import { progressStorage } from '@/lib/localStorage'
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
  type: 'streak' | 'milestone' | 'trigger'
}

// Mock progress data for development
const mockProgress: ProgressData = {
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  currentStreak: 7,
  longestStreak: 7,
  totalDays: 7,
  lastResetDate: new Date().toISOString(),
  smokingHits: 0,
  dailyHits: 0,
  lastHitDate: new Date().toISOString(),
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
  achievements: [
    {
      id: '1',
      title: 'Primer día',
      description: '¡Completaste tu primer día sin fumar!',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'streak'
    },
    {
      id: '2',
      title: 'Una semana',
      description: '¡Una semana completa sin fumar!',
      date: new Date().toISOString(),
      type: 'streak'
    },
  ],
}

export function useProgress() {
  const { user } = useAuth()
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

      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
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
        return
      }

      const docRef = doc(db, 'users', user.uid, 'progress', 'main')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setProgress(docSnap.data() as ProgressData)
      } else {
        // Initialize new progress
        const newProgress: ProgressData = {
          startDate: new Date().toISOString(),
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0,
          lastResetDate: new Date().toISOString(),
          smokingHits: 0,
          dailyHits: 0,
          lastHitDate: new Date().toISOString(),
          triggers: [],
          achievements: [],
        }
        await setDoc(docRef, newProgress)
        setProgress(newProgress)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
      toast.error('Error al cargar el progreso')
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }, [user, initialized])

  useEffect(() => {
    if (!initialized) {
      loadProgress()
    }
  }, [initialized, loadProgress])

  const checkAchievements = useCallback(async (currentProgress: ProgressData) => {
    const newAchievements: Achievement[] = []

    // Get existing achievement titles to avoid duplicates
    const existingTitles = currentProgress.achievements.map(a => a.title)

    // Calculate if a full day has passed since the last reset
    const today = new Date()
    const lastReset = new Date(currentProgress.lastResetDate)
    const daysSinceLastReset = Math.floor((today.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))

    // Only award achievements if at least a full day has passed since last reset
    if (daysSinceLastReset >= 1) {
      // Streak achievements
      if (currentProgress.currentStreak === 1 && !existingTitles.includes('Primer día')) {
        newAchievements.push({
          id: `achievement-${Date.now()}-1`,
          title: 'Primer día',
          description: '¡Completaste tu primer día sin fumar!',
          date: new Date().toISOString(),
          type: 'streak'
        })
      }

      if (currentProgress.currentStreak === 7 && !existingTitles.includes('Una semana')) {
        newAchievements.push({
          id: `achievement-${Date.now()}-7`,
          title: 'Una semana',
          description: '¡Una semana completa sin fumar!',
          date: new Date().toISOString(),
          type: 'streak'
        })
      }

      if (currentProgress.currentStreak === 30 && !existingTitles.includes('Un mes')) {
        newAchievements.push({
          id: `achievement-${Date.now()}-30`,
          title: 'Un mes',
          description: '¡Un mes completo sin fumar!',
          date: new Date().toISOString(),
          type: 'streak'
        })
      }
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...currentProgress.achievements, ...newAchievements]
      
      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
        const updatedProgress = {
          ...currentProgress,
          achievements: updatedAchievements,
        }
        progressStorage.set(updatedProgress)
        setProgress(updatedProgress)
        
        newAchievements.forEach(achievement => {
          toast.success(`🎉 ${achievement.title}: ${achievement.description}`)
        })
        return
      }

      const docRef = doc(db, 'users', user!.uid, 'progress', 'main')
      await updateDoc(docRef, { achievements: updatedAchievements })
      setProgress({ ...currentProgress, achievements: updatedAchievements })

      newAchievements.forEach(achievement => {
        toast.success(`🎉 ${achievement.title}: ${achievement.description}`)
      })
    }
  }, [user])

  const updateStreak = useCallback(async (reset: boolean = false) => {
    if (!progress) return

    try {
      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
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
        return
      }

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
          lastResetDate: today.toISOString(),
        }
        
        const docRef = doc(db, 'users', user.uid, 'progress', 'main')
        await updateDoc(docRef, updatedProgress)
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
        smokingHits: progress.smokingHits + 1,
        lastResetDate: today.toISOString(),
      }

      const docRef = doc(db, 'users', user.uid, 'progress', 'main')
      await updateDoc(docRef, updatedProgress)
      setProgress(updatedProgress)

      // Check for achievements
      checkAchievements(updatedProgress)

      toast.success('Incidente registrado - Streak reiniciado')
    } catch (error) {
      console.error('Error updating streak:', error)
      toast.error('Error al registrar incidente')
    }
  }, [user, progress, checkAchievements])

  // Auto-update streak at the end of the day
  const autoUpdateStreak = useCallback(async () => {
    if (!user || !progress) return

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

      // Only auto-update if a full day has passed since last reset AND no hits today
      if (daysSinceLastReset >= 1 && !hadHitsToday) {
        const newStreak = progress.currentStreak + daysSinceLastReset
        const newTotalDays = totalDaysSinceStart

        const updatedProgress = {
          ...progress,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, progress.longestStreak),
          totalDays: newTotalDays,
          lastResetDate: today.toISOString(),
        }

        // For development, use local storage
        if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
          progressStorage.set(updatedProgress)
          setProgress(updatedProgress)
        } else {
          const docRef = doc(db, 'users', user.uid, 'progress', 'main')
          await updateDoc(docRef, updatedProgress)
          setProgress(updatedProgress)
        }

        // Check for achievements
        checkAchievements(updatedProgress)
      }

      // Reset daily hits if it's a new day
      const isNewDay = today.toDateString() !== lastHitDate.toDateString()
      if (isNewDay && progress.dailyHits > 0) {
        const updatedProgress = {
          ...progress,
          dailyHits: 0,
        }

        if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
          progressStorage.set(updatedProgress)
          setProgress(updatedProgress)
        } else {
          const docRef = doc(db, 'users', user.uid, 'progress', 'main')
          await updateDoc(docRef, { dailyHits: 0 })
          setProgress(updatedProgress)
        }
      }
    } catch (error) {
      console.error('Error auto-updating streak:', error)
    }
  }, [user, progress, checkAchievements])

  // Set up auto-update interval
  useEffect(() => {
    if (!user || !progress) return

    // Check for auto-update every hour
    const interval = setInterval(autoUpdateStreak, 60 * 60 * 1000)
    
    // Also check immediately when component mounts
    autoUpdateStreak()

    return () => clearInterval(interval)
  }, [user, progress, autoUpdateStreak])

  const addTrigger = useCallback(async (trigger: Omit<Trigger, 'id'>) => {
    if (!user || !progress) return

    try {
      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
        const updatedProgress = progressStorage.addTrigger(trigger)
        if (updatedProgress) {
          setProgress(updatedProgress)
          toast.success('Trigger registrado')
        }
        return
      }

      const newTrigger: Trigger = {
        ...trigger,
        id: Date.now().toString(),
      }

      const updatedTriggers = [...progress.triggers, newTrigger]
      const updatedProgress = { ...progress, triggers: updatedTriggers }

      const docRef = doc(db, 'users', user.uid, 'progress', 'main')
      await updateDoc(docRef, { triggers: updatedTriggers })
      setProgress(updatedProgress)

      toast.success('Trigger registrado')
    } catch (error) {
      console.error('Error adding trigger:', error)
      toast.error('Error al registrar trigger')
    }
  }, [user, progress])

  const deleteTrigger = useCallback(async (triggerId: string) => {
    if (!user || !progress) return

    try {
      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
        const updatedTriggers = progress.triggers.filter(t => t.id !== triggerId)
        const updatedProgress = {
          ...progress,
          triggers: updatedTriggers,
        }
        
        progressStorage.set(updatedProgress)
        setProgress(updatedProgress)
        toast.success('Trigger eliminado')
        return
      }

      const updatedTriggers = progress.triggers.filter(t => t.id !== triggerId)
      const updatedProgress = { ...progress, triggers: updatedTriggers }

      const docRef = doc(db, 'users', user.uid, 'progress', 'main')
      await updateDoc(docRef, { triggers: updatedTriggers })
      setProgress(updatedProgress)

      toast.success('Trigger eliminado')
    } catch (error) {
      console.error('Error deleting trigger:', error)
      toast.error('Error al eliminar trigger')
    }
  }, [user, progress])

  const addSmokingHit = useCallback(async () => {
    if (!user || !progress) return

    try {
      const today = new Date()
      const lastHitDate = new Date(progress.lastHitDate)
      const isNewDay = today.toDateString() !== lastHitDate.toDateString()

      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
        const updatedProgress = {
          ...progress,
          smokingHits: progress.smokingHits + 1,
          dailyHits: isNewDay ? 1 : progress.dailyHits + 1,
          lastHitDate: today.toISOString(),
        }
        
        progressStorage.set(updatedProgress)
        setProgress(updatedProgress)
        toast.success('Hit registrado')
        return
      }

      const updatedProgress = {
        ...progress,
        smokingHits: progress.smokingHits + 1,
        dailyHits: isNewDay ? 1 : progress.dailyHits + 1,
        lastHitDate: today.toISOString(),
      }

      const docRef = doc(db, 'users', user.uid, 'progress', 'main')
      await updateDoc(docRef, { 
        smokingHits: updatedProgress.smokingHits,
        dailyHits: updatedProgress.dailyHits,
        lastHitDate: updatedProgress.lastHitDate
      })
      setProgress(updatedProgress)

      toast.success('Hit registrado')
    } catch (error) {
      console.error('Error adding smoking hit:', error)
      toast.error('Error al registrar hit')
    }
  }, [user, progress])

  const subtractSmokingHit = useCallback(async () => {
    if (!user || !progress) return

    try {
      // Don't allow negative values
      if (progress.smokingHits <= 0) {
        toast.error('No hay fumadas para restar')
        return
      }

      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
        const updatedProgress = {
          ...progress,
          smokingHits: Math.max(0, progress.smokingHits - 1),
          dailyHits: Math.max(0, progress.dailyHits - 1),
        }
        
        progressStorage.set(updatedProgress)
        setProgress(updatedProgress)
        toast.success('Fumada restada')
        return
      }

      const updatedProgress = {
        ...progress,
        smokingHits: Math.max(0, progress.smokingHits - 1),
        dailyHits: Math.max(0, progress.dailyHits - 1),
      }

      const docRef = doc(db, 'users', user.uid, 'progress', 'main')
      await updateDoc(docRef, { 
        smokingHits: updatedProgress.smokingHits,
        dailyHits: updatedProgress.dailyHits
      })
      setProgress(updatedProgress)

      toast.success('Fumada restada')
    } catch (error) {
      console.error('Error subtracting smoking hit:', error)
      toast.error('Error al restar fumada')
    }
  }, [user, progress])

  const cleanAchievements = useCallback(async () => {
    if (!user || !progress) return

    try {
      const cleanedAchievements = cleanDuplicateAchievements(progress.achievements)
      
      if (cleanedAchievements.length !== progress.achievements.length) {
        const updatedProgress = {
          ...progress,
          achievements: cleanedAchievements
        }

        // For development, use local storage
        if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
          progressStorage.set(updatedProgress)
          setProgress(updatedProgress)
          toast.success(`Logros limpiados: ${progress.achievements.length - cleanedAchievements.length} duplicados eliminados`)
          return
        }

        const docRef = doc(db, 'users', user.uid, 'progress', 'main')
        await updateDoc(docRef, { achievements: cleanedAchievements })
        setProgress(updatedProgress)
        toast.success(`Logros limpiados: ${progress.achievements.length - cleanedAchievements.length} duplicados eliminados`)
      } else {
        toast.success('No hay logros duplicados para limpiar')
      }
    } catch (error) {
      console.error('Error cleaning achievements:', error)
      toast.error('Error al limpiar logros')
    }
  }, [user, progress, cleanDuplicateAchievements])

  const resetAchievements = useCallback(async () => {
    if (!user || !progress) return

    try {
      const updatedProgress = {
        ...progress,
        achievements: []
      }

      // Use local storage for both development and production (since we removed auth)
      if (process.env.NODE_ENV === 'development' || !user) {
        progressStorage.set(updatedProgress)
        setProgress(updatedProgress)
        toast.success('Logros reiniciados')
        return
      }

      const docRef = doc(db, 'users', user.uid, 'progress', 'main')
      await updateDoc(docRef, { achievements: [] })
      setProgress(updatedProgress)
      toast.success('Logros reiniciados')
    } catch (error) {
      console.error('Error resetting achievements:', error)
      toast.error('Error al reiniciar logros')
    }
  }, [user, progress])

  return {
    progress,
    loading,
    updateStreak,
    addTrigger,
    deleteTrigger,
    addSmokingHit,
    subtractSmokingHit,
    cleanAchievements,
    resetAchievements,
    loadProgress,
  }
}
