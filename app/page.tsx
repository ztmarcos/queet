'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Target, MessageCircle, Settings, Plus } from 'lucide-react'
import Dashboard from '@/components/Dashboard'
import ProgressTracker from '@/components/ProgressTracker'
import TriggerLogger from '@/components/TriggerLogger'
import SupportChat from '@/components/SupportChat'
import SettingsPanel from '@/components/SettingsPanel'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import { useServiceWorker } from '@/hooks/useServiceWorker'

export default function Home() {
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Register service worker for PWA functionality
  useServiceWorker()

  const tabs = [
    { id: 'dashboard', label: t.nav.dashboard, icon: TrendingUp },
    { id: 'progress', label: t.nav.progress, icon: Target },
    { id: 'triggers', label: t.nav.triggers, icon: Plus },
    { id: 'support', label: t.nav.support, icon: MessageCircle },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b-2 border-white">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
              🌿 QUEET WEED
            </h1>
            <div className="w-8 h-8 bg-white text-black rounded-none flex items-center justify-center border-2 border-white">
              <span className="font-mono font-bold text-sm">
                U
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'progress' && <ProgressTracker />}
          {activeTab === 'triggers' && <TriggerLogger />}
          {activeTab === 'support' && <SupportChat />}
          {activeTab === 'settings' && <SettingsPanel />}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-white">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center py-2 px-3 transition-all ${
                    activeTab === tab.id
                      ? 'text-black bg-white'
                      : 'text-white hover:bg-white hover:text-black'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
