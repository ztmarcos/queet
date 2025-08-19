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
      if (!data) return null
      
      const parsed = JSON.parse(data)
      
      // Validate the parsed data has required fields
      if (!parsed || typeof parsed !== 'object') {
        console.warn('Invalid progress data format, clearing...')
        progressStorage.reset()
        return null
      }
      
      // Ensure all required fields exist
      const validated = {
        startDate: parsed.startDate || new Date().toISOString(),
        currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
        longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
        totalDays: typeof parsed.totalDays === 'number' ? parsed.totalDays : 0,
        lastResetDate: parsed.lastResetDate || new Date().toISOString(),
        smokingHits: typeof parsed.smokingHits === 'number' ? parsed.smokingHits : 0,
        dailyHits: typeof parsed.dailyHits === 'number' ? parsed.dailyHits : 0,
        lastHitDate: parsed.lastHitDate || new Date().toISOString(),
        weedPurchases: typeof parsed.weedPurchases === 'number' ? parsed.weedPurchases : 0,
        totalMoneySpent: typeof parsed.totalMoneySpent === 'number' ? parsed.totalMoneySpent : 0,
        lastPurchaseDate: parsed.lastPurchaseDate || new Date().toISOString(),
        triggers: Array.isArray(parsed.triggers) ? parsed.triggers : [],
        achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
        dailyHistory: parsed.dailyHistory && typeof parsed.dailyHistory === 'object' ? parsed.dailyHistory : {},
      }
      
      return validated
          } catch (error: any) {
        console.error('Error reading progress from localStorage:', error)
        // If there's an error, clear the corrupted data
        progressStorage.reset()
        return null
      }
  },

  set: (progress: ProgressData): void => {
    try {
      // Validate progress data before saving
      if (!progress || typeof progress !== 'object') {
        throw new Error('Invalid progress data')
      }
      
      // Ensure all required fields exist
      const validated = {
        startDate: progress.startDate || new Date().toISOString(),
        currentStreak: typeof progress.currentStreak === 'number' ? progress.currentStreak : 0,
        longestStreak: typeof progress.longestStreak === 'number' ? progress.longestStreak : 0,
        totalDays: typeof progress.totalDays === 'number' ? progress.totalDays : 0,
        lastResetDate: progress.lastResetDate || new Date().toISOString(),
        smokingHits: typeof progress.smokingHits === 'number' ? progress.smokingHits : 0,
        dailyHits: typeof progress.dailyHits === 'number' ? progress.dailyHits : 0,
        lastHitDate: progress.lastHitDate || new Date().toISOString(),
        weedPurchases: typeof progress.weedPurchases === 'number' ? progress.weedPurchases : 0,
        totalMoneySpent: typeof progress.totalMoneySpent === 'number' ? progress.totalMoneySpent : 0,
        lastPurchaseDate: progress.lastPurchaseDate || new Date().toISOString(),
        triggers: Array.isArray(progress.triggers) ? progress.triggers : [],
        achievements: Array.isArray(progress.achievements) ? progress.achievements : [],
        dailyHistory: progress.dailyHistory && typeof progress.dailyHistory === 'object' ? progress.dailyHistory : {},
      }
      
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(validated))
    } catch (error) {
      console.error('Error saving progress to localStorage:', error)
      // Try to save a backup of the current data
      try {
        const backup = {
          ...progress,
          _backupDate: new Date().toISOString(),
          _error: error.message
        }
        localStorage.setItem(STORAGE_KEYS.PROGRESS + '_backup', JSON.stringify(backup))
      } catch (backupError) {
        console.error('Failed to create backup:', backupError)
      }
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
      weedPurchases: 0,
      totalMoneySpent: 0,
      lastPurchaseDate: new Date().toISOString(),
      dailyHistory: {},
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

  // Auto-backup to cloud storage (if available)
  autoBackup: async (): Promise<void> => {
    try {
      const data = dataManager.export()
      
      // Try to save to cloud storage if available
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `queet-weed-backup-${new Date().toISOString().split('T')[0]}.json`,
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        })
        const writable = await handle.createWritable()
        await writable.write(data)
        await writable.close()
        console.log('Auto-backup saved to file')
      }
    } catch (error) {
      console.log('Auto-backup not available:', error)
    }
  },

  // Check data integrity
  checkIntegrity: (): boolean => {
    try {
      const progress = progressStorage.get()
      const user = userStorage.get()
      
      // Basic integrity checks
      if (!progress || !user) return false
      if (!progress.startDate || typeof progress.currentStreak !== 'number') return false
      
      return true
    } catch (error) {
      console.error('Data integrity check failed:', error)
      return false
    }
  },

  // Create backup reminder
  createBackupReminder: (): void => {
    try {
      const lastBackup = localStorage.getItem('queet-weed-last-backup')
      const today = new Date().toISOString().split('T')[0]
      
      if (lastBackup !== today) {
        // Show backup reminder every 7 days
        const lastBackupDate = lastBackup ? new Date(lastBackup) : new Date(0)
        const daysSinceBackup = Math.floor((new Date().getTime() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysSinceBackup >= 7) {
          console.log('Backup reminder: Consider exporting your data')
          // You can add a toast notification here
        }
      }
    } catch (error) {
      console.error('Error creating backup reminder:', error)
    }
  },

  // Complete system reset
  completeReset: (): void => {
    try {
      // Clear all data
      dataManager.clearAll()
      
      // Clear any additional keys that might exist
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.includes('queet-weed')) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })
      
      console.log('Complete system reset performed')
    } catch (error) {
      console.error('Error during complete reset:', error)
    }
  },

  // Repair corrupted data
  repairData: (): boolean => {
    try {
      console.log('Attempting to repair corrupted data...')
      
      // Try to load current data
      const currentProgress = progressStorage.get()
      const currentUser = userStorage.get()
      
      // If data is corrupted, try to restore from backup
      if (!currentProgress) {
        const backupData = localStorage.getItem(STORAGE_KEYS.PROGRESS + '_backup')
        if (backupData) {
          try {
            const backup = JSON.parse(backupData)
            // Remove backup metadata
            delete backup._backupDate
            delete backup._error
            progressStorage.set(backup)
            console.log('Data restored from backup')
            return true
          } catch (backupError) {
            console.error('Failed to restore from backup:', backupError)
          }
        }
        
        // If no backup, initialize fresh data
        progressStorage.initialize()
        console.log('Fresh data initialized')
        return true
      }
      
      // Validate and fix current data
      const today = new Date()
      const todayKey = today.toISOString().split('T')[0]
      
      // Ensure dailyHistory exists and has today's entry
      if (!currentProgress.dailyHistory) {
        currentProgress.dailyHistory = {}
      }
      
      // Sync dailyHits with dailyHistory
      if (currentProgress.dailyHistory[todayKey] !== undefined) {
        currentProgress.dailyHits = currentProgress.dailyHistory[todayKey]
      } else {
        currentProgress.dailyHistory[todayKey] = currentProgress.dailyHits
      }
      
      // Save repaired data
      progressStorage.set(currentProgress)
      console.log('Data repaired successfully')
      return true
      
         } catch (error: any) {
       console.error('Error repairing data:', error)
       return false
     }
  },

  // Validate data integrity
  validateData: (): { isValid: boolean; issues: string[] } => {
    const issues: string[] = []
    
    try {
      const progress = progressStorage.get()
      const user = userStorage.get()
      
      if (!progress) {
        issues.push('No progress data found')
      } else {
        // Check required fields
        if (!progress.startDate) issues.push('Missing startDate')
        if (typeof progress.currentStreak !== 'number') issues.push('Invalid currentStreak')
        if (typeof progress.dailyHits !== 'number') issues.push('Invalid dailyHits')
        if (!progress.dailyHistory || typeof progress.dailyHistory !== 'object') {
          issues.push('Invalid dailyHistory')
        }
        
        // Check data consistency
        const todayKey = new Date().toISOString().split('T')[0]
        if (progress.dailyHistory[todayKey] !== undefined && 
            progress.dailyHistory[todayKey] !== progress.dailyHits) {
          issues.push('dailyHits and dailyHistory are out of sync')
        }
      }
      
      if (!user) {
        issues.push('No user data found')
      }
      
      return {
        isValid: issues.length === 0,
        issues
      }
    } catch (error) {
      issues.push(`Validation error: ${error.message}`)
      return {
        isValid: false,
        issues
      }
    }
  }
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
