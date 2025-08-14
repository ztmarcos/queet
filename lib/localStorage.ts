import { ProgressData, Trigger, Achievement } from '@/hooks/useProgress'

const STORAGE_KEYS = {
  PROGRESS: 'queet-weed-progress',
  USER: 'queet-weed-user',
  LANGUAGE: 'queet-weed-language',
  SETTINGS: 'queet-weed-settings',
}

export interface LocalUser {
  id: string
  email: string
  createdAt: string
}

export interface LocalSettings {
  notifications: boolean
  darkMode: boolean
  language: 'es' | 'en'
}

// Progress Management
export const progressStorage = {
  get: (): ProgressData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error reading progress from localStorage:', error)
      return null
    }
  },

  set: (progress: ProgressData): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving progress to localStorage:', error)
    }
  },

  update: (updates: Partial<ProgressData>): ProgressData | null => {
    try {
      const current = progressStorage.get()
      if (!current) return null

      const updated = { ...current, ...updates }
      progressStorage.set(updated)
      return updated
    } catch (error) {
      console.error('Error updating progress:', error)
      return null
    }
  },

  addTrigger: (trigger: Omit<Trigger, 'id'>): ProgressData | null => {
    try {
      const current = progressStorage.get()
      if (!current) return null

      const newTrigger: Trigger = {
        ...trigger,
        id: Date.now().toString(),
      }

      const updated = {
        ...current,
        triggers: [...current.triggers, newTrigger],
      }

      progressStorage.set(updated)
      return updated
    } catch (error) {
      console.error('Error adding trigger:', error)
      return null
    }
  },

  addAchievement: (achievement: Omit<Achievement, 'id'>): ProgressData | null => {
    try {
      const current = progressStorage.get()
      if (!current) return null

      const newAchievement: Achievement = {
        ...achievement,
        id: Date.now().toString(),
      }

      const updated = {
        ...current,
        achievements: [...current.achievements, newAchievement],
      }

      progressStorage.set(updated)
      return updated
    } catch (error) {
      console.error('Error adding achievement:', error)
      return null
    }
  },

  reset: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS)
    } catch (error) {
      console.error('Error resetting progress:', error)
    }
  },

  initialize: (): ProgressData => {
    const defaultProgress: ProgressData = {
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

    progressStorage.set(defaultProgress)
    return defaultProgress
  },
}

// User Management
export const userStorage = {
  get: (): LocalUser | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error reading user from localStorage:', error)
      return null
    }
  },

  set: (user: LocalUser): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } catch (error) {
      console.error('Error saving user to localStorage:', error)
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER)
    } catch (error) {
      console.error('Error clearing user from localStorage:', error)
    }
  },

  createMockUser: (email: string): LocalUser => {
    const user: LocalUser = {
      id: 'local-user-' + Date.now(),
      email,
      createdAt: new Date().toISOString(),
    }
    userStorage.set(user)
    return user
  },
}

// Settings Management
export const settingsStorage = {
  get: (): LocalSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Error reading settings from localStorage:', error)
    }

    // Default settings
    return {
      notifications: true,
      darkMode: false,
      language: 'es',
    }
  },

  set: (settings: LocalSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings to localStorage:', error)
    }
  },

  update: (updates: Partial<LocalSettings>): LocalSettings => {
    const current = settingsStorage.get()
    const updated = { ...current, ...updates }
    settingsStorage.set(updated)
    return updated
  },
}

// Language Management
export const languageStorage = {
  get: (): 'es' | 'en' => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
      return (data as 'es' | 'en') || 'es'
    } catch (error) {
      console.error('Error reading language from localStorage:', error)
      return 'es'
    }
  },

  set: (language: 'es' | 'en'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
    } catch (error) {
      console.error('Error saving language to localStorage:', error)
    }
  },
}

// Data Export/Import
export const dataManager = {
  export: (): string => {
    try {
      const data = {
        progress: progressStorage.get(),
        user: userStorage.get(),
        settings: settingsStorage.get(),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      return ''
    }
  },

  import: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.progress) {
        progressStorage.set(data.progress)
      }
      
      if (data.user) {
        userStorage.set(data.user)
      }
      
      if (data.settings) {
        settingsStorage.set(data.settings)
      }
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS)
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.SETTINGS)
      localStorage.removeItem(STORAGE_KEYS.LANGUAGE)
    } catch (error) {
      console.error('Error clearing all data:', error)
    }
  },
}

// Utility functions
export const getStorageStats = () => {
  try {
    const progress = progressStorage.get()
    const user = userStorage.get()
    const settings = settingsStorage.get()
    
    return {
      hasProgress: !!progress,
      hasUser: !!user,
      hasSettings: !!settings,
      progressSize: progress ? JSON.stringify(progress).length : 0,
      totalSize: JSON.stringify({ progress, user, settings }).length,
    }
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return null
  }
}
