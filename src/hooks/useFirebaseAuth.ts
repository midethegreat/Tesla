"use client"

// Firebase Auth Hook
import { useState, useEffect } from "react"
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/config/firebase"
import { firebaseAuthService } from "@/services/firebase-auth.service"

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const result = await firebaseAuthService.register(email, password)
      if (!result.success) {
        setError(result.message || "Registration failed")
      }
      return result
    } catch (err: any) {
      const errorMessage = err.message || "Registration error"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const result = await firebaseAuthService.login(email, password)
      if (!result.success) {
        setError(result.message || "Login failed")
      }
      return result
    } catch (err: any) {
      const errorMessage = err.message || "Login error"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setError(null)
    try {
      await firebaseAuthService.logout()
      setUser(null)
    } catch (err: any) {
      setError(err.message || "Logout error")
    }
  }

  const sendPasswordReset = async (email: string) => {
    setError(null)
    try {
      return await firebaseAuthService.sendPasswordReset(email)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send reset email"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    sendPasswordReset,
  }
}
