import { useState, useEffect } from 'react'
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { userStorage, LocalUser } from '@/lib/localStorage'
import toast from 'react-hot-toast'

// Mock user for development
const createMockUser = (email: string): User => {
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
  } as User
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create mock user for both development and production (since we removed auth)
    if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
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
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // Mock sign in for development
        setTimeout(() => {
          const mockUser = createMockUser(email)
          setUser(mockUser)
          setLoading(false)
          toast.success('¡Bienvenido de vuelta!')
        }, 1000)
        return
      }
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('¡Bienvenido de vuelta!')
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
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // Mock sign up for development
        setTimeout(() => {
          const mockUser = createMockUser(email)
          setUser(mockUser)
          setLoading(false)
          toast.success('¡Cuenta creada exitosamente!')
        }, 1000)
        return
      }
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success('¡Cuenta creada exitosamente!')
    } catch (error: any) {
      toast.error(error.message || 'Error al crear cuenta')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        setUser(null)
        userStorage.clear()
        toast.success('Sesión cerrada')
        return
      }
      await signOut(auth)
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
