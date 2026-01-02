// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth"
import { auth } from "@/config/firebase"

export interface FirebaseAuthResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    email: string
    emailVerified: boolean
  }
}

export const firebaseAuthService = {
  // Register with email and password
  register: async (email: string, password: string): Promise<FirebaseAuthResponse> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email || "",
          emailVerified: user.emailVerified,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Registration failed",
      }
    }
  },

  // Login with email and password
  login: async (email: string, password: string): Promise<FirebaseAuthResponse> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Get ID token for backend API calls
      const token = await user.getIdToken()
      localStorage.setItem("firebaseToken", token)

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email || "",
          emailVerified: user.emailVerified,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Login failed",
      }
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await signOut(auth)
      localStorage.removeItem("firebaseToken")
    } catch (error: any) {
      console.error("Logout error:", error)
    }
  },

  // Send password reset email
  sendPasswordReset: async (email: string): Promise<FirebaseAuthResponse> => {
    try {
      await sendPasswordResetEmail(auth, email)
      return {
        success: true,
        message: "Password reset email sent",
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to send reset email",
      }
    }
  },

  // Confirm password reset
  confirmPasswordReset: async (code: string, newPassword: string): Promise<FirebaseAuthResponse> => {
    try {
      await confirmPasswordReset(auth, code, newPassword)
      return {
        success: true,
        message: "Password reset successful",
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Password reset failed",
      }
    }
  },

  // Verify password reset code
  verifyPasswordResetCode: async (code: string): Promise<FirebaseAuthResponse> => {
    try {
      const email = await verifyPasswordResetCode(auth, code)
      return {
        success: true,
        message: "Code verified",
        user: {
          id: "",
          email: email || "",
          emailVerified: false,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Invalid reset code",
      }
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser
  },

  // Get ID token for API calls
  getIdToken: async (): Promise<string | null> => {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken()
      }
      return localStorage.getItem("firebaseToken")
    } catch (error) {
      console.error("Error getting ID token:", error)
      return localStorage.getItem("firebaseToken")
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.currentUser || !!localStorage.getItem("firebaseToken")
  },
}
