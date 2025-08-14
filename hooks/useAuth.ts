import { useState, useEffect } from 'react'
import { userStorage, LocalUser } from '@/lib/localStorage'
import toast from 'react-hot-toast'

// Mock User interface for localStorage-only mode
interface MockUser {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string | null
  photoURL: string | null
  phoneNumber: string | null
  isAnonymous: boolean
  metadata: any
  providerData: any[]
  refreshToken: string
  tenantId: string | null
  delete: () => Promise<void>
  getIdToken: () => Promise<string>
  getIdTokenResult: () => Promise<any>
  reload: () => Promise<void>
  toJSON: () => any
  providerId: string
}

// Mock user for localStorage-only mode
const createMockUser = (email: string): MockUser => {
  const localUser: LocalUser = {
    id: 'local-user-' + Date.now(),
    email,
    createdAt: new Date().toISOString(),
  }
  
  userStorage.set(localUser)
  
  return {
    uid: localUser.id,
    email: localUser.email,
    emailVerified: true,
    displayName: null,
    photoURL: null,
    phoneNumber: null,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: () => Promise.resolve(),
    getIdToken: () => Promise.resolve('mock-token'),
    getIdTokenResult: () => Promise.resolve({} as any),
    reload: () => Promise.resolve(),
    toJSON: () => ({}),
    providerId: 'password',
  }
}

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always use localStorage mode (no Firebase)
    let savedUser = userStorage.get()
    if (!savedUser) {
      // Create a default user
      savedUser = { 
        id: 'default-user',
        email: 'user@queet.app', 
        createdAt: new Date().toISOString()
      }
      userStorage.set(savedUser)
    }
    const mockUser = createMockUser(savedUser.email)
    setUser(mockUser)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Mock sign in
      setTimeout(() => {
        const mockUser = createMockUser(email)
        setUser(mockUser)
        setLoading(false)
        toast.success('¡Bienvenido de vuelta!')
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Mock sign up
      setTimeout(() => {
        const mockUser = createMockUser(email)
        setUser(mockUser)
        setLoading(false)
        toast.success('¡Cuenta creada exitosamente!')
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || 'Error al crear cuenta')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      userStorage.clear()
      toast.success('Sesión cerrada')
    } catch (error: any) {
      toast.error('Error al cerrar sesión')
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
  }
}
