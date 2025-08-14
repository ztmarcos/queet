'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, AlertTriangle, Clock, MessageSquare, Activity, Trash2 } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

const triggerTypes = [
  { id: 'stress', label: 'Estrés', icon: '😰', color: 'bg-red-100 text-red-600' },
  { id: 'boredom', label: 'Aburrimiento', icon: '😐', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'social', label: 'Social', icon: '👥', color: 'bg-blue-100 text-blue-600' },
  { id: 'emotional', label: 'Emocional', icon: '💔', color: 'bg-purple-100 text-purple-600' },
  { id: 'habit', label: 'Hábito', icon: '🔄', color: 'bg-gray-100 text-gray-600' },
  { id: 'other', label: 'Otro', icon: '❓', color: 'bg-orange-100 text-orange-600' },
]

export default function TriggerLogger() {
  const { progress, addTrigger, deleteTrigger } = useProgress()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [triggerToDelete, setTriggerToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: '',
    intensity: 5,
    notes: '',
  })

  const locale = language === 'es' ? es : enUS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.type) {
      alert('Por favor selecciona un tipo de trigger')
      return
    }

    await addTrigger({
      date: new Date().toISOString(),
      type: formData.type,
      intensity: formData.intensity,
      notes: formData.notes,
      handled: false,
    })

    setFormData({ type: '', intensity: 5, notes: '' })
    setShowForm(false)
  }

  const handleDeleteTrigger = (triggerId: string) => {
    setTriggerToDelete(triggerId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (triggerToDelete) {
      await deleteTrigger(triggerToDelete)
      setShowDeleteConfirm(false)
      setTriggerToDelete(null)
    }
  }

  const getTriggerTypeInfo = (type: string) => {
    return triggerTypes.find(t => t.id === type) || triggerTypes[5]
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 2) return 'bg-green-500'
    if (intensity <= 4) return 'bg-yellow-500'
    if (intensity <= 6) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Add Trigger Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <button
          onClick={() => setShowForm(true)}
          className="w-full btn-primary flex items-center justify-center font-mono uppercase tracking-wider"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t.triggers.registerTrigger}
        </button>
      </motion.div>

      {/* Trigger Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-mobile border-3 border-white shadow-brutalist"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5 mr-2 text-white" />
            {t.triggers.newTrigger}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trigger Type */}
            <div>
              <label className="block text-sm font-medium text-white font-mono uppercase tracking-wider mb-2">
                {t.triggers.triggerType}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {triggerTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id })}
                    className={`p-3 border-2 transition-all font-mono uppercase tracking-wider ${
                      formData.type === type.id
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-white hover:bg-white hover:text-black'
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-xs">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-sm font-medium text-white font-mono uppercase tracking-wider mb-2">
                {t.triggers.intensity}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-white font-mono font-bold min-w-[3rem] text-center">
                  {formData.intensity}/10
                </span>
              </div>
              <div className="flex justify-between text-xs text-white font-mono uppercase tracking-wider mt-1">
                <span>{t.triggers.mild}</span>
                <span>{t.triggers.moderate}</span>
                <span>{t.triggers.intense}</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-white font-mono uppercase tracking-wider mb-2">
                {t.triggers.notes} <span className="text-white opacity-70">({t.triggers.optional})</span>
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t.triggers.describe}
                className="w-full p-3 bg-black text-white border-2 border-white font-mono uppercase tracking-wider focus:outline-none focus:border-white resize-none"
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 btn-secondary font-mono uppercase tracking-wider"
              >
                {t.triggers.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary font-mono uppercase tracking-wider"
              >
                {t.triggers.save}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Recent Triggers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-mobile border-3 border-white shadow-brutalist"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
          <Activity className="w-5 h-5 mr-2 text-white" />
          {t.triggers.recentTriggers}
        </h3>

        {progress?.triggers.length === 0 ? (
          <div className="text-center py-8 text-white">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-white opacity-50" />
            <p className="font-mono uppercase tracking-wider">{t.triggers.noTriggers}</p>
            <p className="text-sm font-mono uppercase tracking-wider opacity-70">{t.triggers.startRegistering}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress?.triggers.slice(-5).reverse().map((trigger) => {
              const typeInfo = getTriggerTypeInfo(trigger.type)
              return (
                <div key={trigger.id} className="p-4 bg-white text-black border-2 border-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-none border-2 border-black flex items-center justify-center mr-3">
                        <span className="text-lg">{typeInfo.icon}</span>
                      </div>
                      <div>
                        <div className="font-bold font-mono uppercase tracking-wider">{typeInfo.label}</div>
                        <div className="text-sm font-mono uppercase tracking-wider opacity-70">
                          {format(new Date(trigger.date), 'dd/MM/yyyy HH:mm', { locale })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-none border border-black ${getIntensityColor(trigger.intensity)}`} />
                      <span className="text-sm font-bold font-mono uppercase tracking-wider">{trigger.intensity}/10</span>
                      <button
                        onClick={() => handleDeleteTrigger(trigger.id)}
                        className="p-1 hover:bg-black hover:text-white transition-all border border-transparent hover:border-black"
                        title="Eliminar trigger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {trigger.notes && (
                    <div className="mt-2 p-2 bg-black text-white text-sm font-mono uppercase tracking-wider border border-black">
                      {trigger.notes}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Trigger Statistics */}
      {progress?.triggers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-mobile border-3 border-white shadow-brutalist"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center font-mono uppercase tracking-wider">
            <Activity className="w-5 h-5 mr-2 text-white" />
            {t.triggers.triggerStats}
          </h3>

          <div className="space-y-3">
            {triggerTypes.map((type) => {
              const count = progress.triggers.filter(t => t.type === type.id).length
              const percentage = progress.triggers.length > 0 ? (count / progress.triggers.length) * 100 : 0
              
              return count > 0 ? (
                <div key={type.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{type.icon}</span>
                    <span className="font-bold font-mono uppercase tracking-wider text-white">{type.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-white border-2 border-white h-2">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold font-mono uppercase tracking-wider text-white">{count}</span>
                  </div>
                </div>
              ) : null
            })}
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border-3 border-white p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-white font-mono uppercase tracking-wider mb-2">
              ¿Eliminar trigger?
            </h3>
            <p className="text-white font-mono uppercase tracking-wider mb-6">
              Esta acción no se puede deshacer. El trigger será eliminado permanentemente.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary font-mono uppercase tracking-wider"
              >
                {t.triggers.cancel}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 border-2 border-red-600 hover:border-red-700 transition-all font-mono uppercase tracking-wider"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
