"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { set } from "date-fns"
interface User {
  username?: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast() // Add this line to use toast

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/me")
      // const response = await fetch("http://localhost:5000/api/auth/user")

      console.log("Response from /api/auth/me:", response)

      if (response.ok) {
        const { user } = await response.json()
        setUser(user.data)


      } else {

        setUser(null)
      }
    } catch (error) {
      console.error("Error checking authentication:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }



  const login = async (email: string, password: string) => {

    console.log("Logging in with:", { email, password })
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()


      // if (response.ok) {
      //   console.log(data)
      //   // The cookie is set by the API, we just need to update our state
      //   await checkAuth()
      //   return { success: true, message: "Login successful" }
      // } else {
      //   return { success: false, message: data.message || "Login failed" }
      // }

      if (response.ok) {
        // The cookie is set by the API, we just need to update our state
        await checkAuth()
        // Show success toast
        toast({
          title: "Login successful",
          description: "Welcome back! You've been logged in successfully.",
          variant: "default",
        })
        return { success: true, message: "Login successful" }
      } else {
        // Show error toast
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
        return { success: false, message: data.message || "Login failed" }
      }

    }
    // catch (error) {
    //   console.error("Login error:", error)
    //   return { success: false, message: "An error occurred during login" }
    // }
    catch (error) {
      console.error("Login error:", error)
      // Show error toast for unexpected errors
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { success: false, message: "An error occurred during login" }
    }
  }



  // const register = async (name: string, email: string, password: string) => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/auth/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ name, email, password }),
  //       credentials: "include", // Important for cookies
  //     })

  //     const data = await response.json()

  //     if (response.ok) {
  //       // The cookie is set by the API, we just need to update our state
  //       await checkAuth()
  //       return { success: true, message: "Registration successful" }
  //     } else {
  //       return { success: false, message: data.message || "Registration failed" }
  //     }
  //   } catch (error) {
  //     console.error("Registration error:", error)
  //     return { success: false, message: "An error occurred during registration" }
  //   }
  // }


  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name, email, password
        }),
        credentials: "include", // Important for cookies
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (response.ok) {
        // The cookie is set by the API, we just need to update our state
        await checkAuth()
        // Show success toast
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully!",
          variant: "default",
        })
        return { success: true, message: "Registration successful" }
      } else {
        // Show error toast
        toast({
          title: "Registration failed",
          description: data.message || "Could not create your account. Please try again.",
          variant: "destructive",
        })
        return { success: false, message: data.message || "Registration failed" }
      }
    } catch (error) {
      console.error("Registration error:", error)
      // Show error toast for unexpected errors
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { success: false, message: "An error occurred during registration" }
    }
  }



  const logout = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/logout", { method: "POST", })
      const data = await response.json()
      console.log("Logout response:", data)
      // Clear user state
      // Redirect to login page
      if (response.ok) {
        // Show success toast
        toast({
          title: "Logout successful",
          description: "You have been logged out successfully.",
          variant: "default",
        })
        setUser(null)
        router.push("/login")
      } else {
        // Show error toast
        toast({
          title: "Logout failed",
          description: data.message || "Could not log you out. Please try again.",
          variant: "destructive",
        })
      }
      // setLoading(false)
      // setUser(null)
      // router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
