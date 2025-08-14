import { useState, useEffect } from 'react'
import { Language } from '@/lib/i18n'
import { languageStorage } from '@/lib/localStorage'

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('es')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = languageStorage.get()
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    languageStorage.set(newLanguage)
  }

  return {
    language,
    changeLanguage,
  }
}
