'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, HelpCircle, LogOut, Trash2, Download, Globe } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProgress } from '@/hooks/useProgress'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import { dataManager, settingsStorage } from '@/lib/localStorage'
import toast from 'react-hot-toast'

export default function SettingsPanel() {
  const { user, logout } = useAuth()
  const { progress } = useProgress()
  const { language, changeLanguage } = useLanguage()
  const t = useTranslations(language)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success(t.auth.signOut)
    } catch (error) {
      toast.error('Error al cerrar sesión')
    }
  }

  const handleDeleteAccount = async () => {
    // Clear all local data
    dataManager.clearAll()
    toast.success('Cuenta eliminada')
    setShowDeleteConfirm(false)
    // Reload page to reset state
    window.location.reload()
  }

  const exportData = () => {
    const jsonData = dataManager.export()
    if (!jsonData) {
      toast.error('Error al exportar datos')
      return
    }

    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `queet-weed-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Datos exportados exitosamente')
  }

  const handleLanguageChange = (newLanguage: 'es' | 'en') => {
    changeLanguage(newLanguage)
    toast.success(`Idioma cambiado a ${newLanguage === 'es' ? 'Español' : 'English'}`)
  }

  const handleNotificationChange = (enabled: boolean) => {
    setNotifications(enabled)
    settingsStorage.update({ notifications: enabled })
    toast.success(enabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas')
  }

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mobile"
      >
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white text-black rounded-none flex items-center justify-center mr-4 border-2 border-white">
            <span className="text-2xl font-bold font-mono">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">
              {user?.email}
            </h3>
            <p className="text-white text-sm font-mono uppercase tracking-wider">
              Miembro desde {progress?.startDate ? new Date(progress.startDate).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US') : 'recientemente'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* App Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <Settings className="w-5 h-5 mr-2 text-white" />
          {t.settings.appSettings}
        </h3>
        
        <div className="space-y-4">
          {/* Language Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-3 text-white" />
              <div>
                <div className="font-bold text-white font-mono uppercase tracking-wider">{t.settings.language}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">Seleccionar idioma</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleLanguageChange('es')}
                className={`px-3 py-1 border-2 font-mono uppercase tracking-wider text-xs transition-all ${
                  language === 'es'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:text-black'
                }`}
              >
                {t.settings.spanish}
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 border-2 font-mono uppercase tracking-wider text-xs transition-all ${
                  language === 'en'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-white hover:bg-white hover:text-black'
                }`}
              >
                {t.settings.english}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-white" />
              <div>
                <div className="font-bold text-white font-mono uppercase tracking-wider">{t.settings.notifications}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">{t.settings.dailyReminders}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => handleNotificationChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-black border-2 border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 text-white">🌙</div>
              <div>
                <div className="font-bold text-white font-mono uppercase tracking-wider">{t.settings.darkMode}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">{t.settings.comingSoon}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer opacity-50">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                disabled
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-black border-2 border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <Shield className="w-5 h-5 mr-2 text-white" />
          {t.settings.dataManagement}
        </h3>
        
        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-white hover:text-black transition-all border-2 border-transparent hover:border-white"
          >
            <div className="flex items-center">
              <Download className="w-5 h-5 mr-3 text-white" />
              <div>
                <div className="font-bold text-white font-mono uppercase tracking-wider">{t.settings.exportData}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">{t.settings.downloadProgress}</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-white hover:text-black transition-all border-2 border-transparent hover:border-white"
          >
            <div className="flex items-center">
              <Trash2 className="w-5 h-5 mr-3 text-red-500" />
              <div>
                <div className="font-bold text-red-500 font-mono uppercase tracking-wider">{t.settings.deleteAccount}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">{t.settings.deletePermanently}</div>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Help & Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <HelpCircle className="w-5 h-5 mr-2 text-white" />
          {t.settings.helpSupport}
        </h3>
        
        <div className="space-y-3">
          <a
            href="mailto:soporte@queetweed.com"
            className="flex items-center justify-between p-3 text-left hover:bg-white hover:text-black transition-all border-2 border-transparent hover:border-white"
          >
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 text-white">📧</div>
              <div>
                <div className="font-bold text-white font-mono uppercase tracking-wider">{t.settings.contactSupport}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">soporte@queetweed.com</div>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-3 text-left hover:bg-white hover:text-black transition-all border-2 border-transparent hover:border-white"
          >
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 text-white">📖</div>
              <div>
                <div className="font-bold text-white font-mono uppercase tracking-wider">{t.settings.userGuide}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">{t.settings.howToUse}</div>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="flex items-center justify-between p-3 text-left hover:bg-white hover:text-black transition-all border-2 border-transparent hover:border-white"
          >
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 text-white">🔒</div>
              <div>
                <div className="font-bold text-white font-mono uppercase tracking-wider">{t.settings.privacyPolicy}</div>
                <div className="text-sm text-white font-mono uppercase tracking-wider">{t.settings.howWeProtect}</div>
              </div>
            </div>
          </a>
        </div>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider">{t.settings.appInfo}</h3>
          <p className="text-sm text-white font-mono uppercase tracking-wider">{t.settings.version}</p>
          <p className="text-xs text-white font-mono uppercase tracking-wider">
            {t.settings.yourCompanion}
          </p>
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <button
          onClick={handleLogout}
          className="w-full btn-secondary flex items-center justify-center font-mono uppercase tracking-wider"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t.settings.logout}
        </button>
      </motion.div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border-3 border-white p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider mb-2">
              {t.settings.deleteConfirm}
            </h3>
            <p className="text-white font-mono uppercase tracking-wider mb-6">
              {t.settings.deleteConfirmText}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary font-mono uppercase tracking-wider"
              >
                {t.triggers.cancel}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 border-2 border-red-600 hover:border-red-700 transition-all font-mono uppercase tracking-wider"
              >
                {t.settings.deleteAccount}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
