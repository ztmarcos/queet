'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslations } from '@/lib/i18n'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const { language } = useLanguage()
  const t = useTranslations(language)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos')
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    
    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto"
    >
      <div className="card-mobile border-3 border-white shadow-brutalist">
        <h1 className="text-4xl font-bold text-white mb-6 text-center font-mono uppercase tracking-widest">
          🌿 QUEET WEED
        </h1>
        
        <p className="text-white mb-8 text-center font-mono uppercase tracking-wider">
          {t.auth.yourCompanionHealthy}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white font-mono uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-black text-white border-2 border-white font-mono uppercase tracking-wider focus:outline-none focus:border-white"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-mono uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black text-white border-2 border-white font-mono uppercase tracking-wider focus:outline-none focus:border-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary font-mono uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'CARGANDO...' : (isSignUp ? t.auth.signUp : t.auth.signIn)}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white font-mono uppercase tracking-wider hover:underline"
          >
            {isSignUp ? '¿Ya tienes cuenta? Iniciar sesión' : '¿No tienes cuenta? Registrarse'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-white font-mono uppercase tracking-wider">
            Modo local - Los datos se guardan en tu navegador
          </p>
        </div>
      </div>
    </motion.div>
  )
}
