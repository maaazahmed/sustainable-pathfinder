"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { login } = useAuth()

  // const [errors, setErrors] = useState({
  //   email: "",
  //   password: "",
  // })

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!validateForm()) return

  //   setIsLoading(true)

  //   try {
  //     // This is where you would implement your authentication logic
  //     console.log("Login with:", formData)

  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     // For demo purposes, store user in localStorage
  //     // In a real app, you would use a proper auth solution
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem(
  //         "user",
  //         JSON.stringify({
  //           name: "Demo User",
  //           email: formData.email,
  //         }),
  //       )
  //     }

  //     // Simple notification instead of using toast
  //     alert("Login successful! Redirecting to dashboard...")

  //     // Redirect to dashboard after successful login
  //     router.push("/dashboard")
  //   } catch (error) {
  //     console.error("Login failed:", error)
  //     alert("Login failed. Please check your credentials and try again.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }



  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({ ...errors, general: "" })

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Redirect to dashboard after successful login
        router.push("/dashboard")
      } else {
        setErrors({ ...errors, general: result.message })
      }
    } catch (error) {
      console.error("Login failed:", error)
      setErrors({ ...errors, general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Left side - Brand section */}
      <div className="hidden w-1/2 flex-col justify-between bg-brand-blue p-12 text-white lg:flex">
        <div className="border-[10px] border-white rounded-md" >
          <Logo className="h-12 w-auto " />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="text-xl opacity-90">
            Sign in to your Sustainable Pathfinders account to access your dashboard and tools.
          </p>
          <div className="h-1 w-20 bg-white/30 rounded"></div>
          <div className="space-y-4">
            <p className="text-lg opacity-80">
              "Sustainable Pathfinders has transformed how we approach environmental challenges."
            </p>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white/20"></div>
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm opacity-70">Environmental Director</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm opacity-70">
          © {new Date().getFullYear()} Sustainable Pathfinders. All rights reserved.
        </div>
      </div>

      {/* Right side - Form section */}
      <div className="flex w-full flex-col justify-center p-6 lg:w-1/2 lg:p-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-brand-blue"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </button>
            <div className="lg:hidden">
              <Logo className="h-8 w-auto" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="mt-2 text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                // className="h-12 rounded-lg border-gray-300 text-brand-blue bg-white px-4  "
                className="h-12 rounded-lg border-gray-300 text-brand-blue bg-white px-4 focus:outline-none focus:ring-0"

                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-brand-blue hover:text-brand-blue-dark"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  // className="h-12 rounded-lg border-gray-300 bg-white px-4 shadow-sm focus:border-brand-blue focus:ring-brand-blue"
                  className="h-12 rounded-lg border border-gray-300 text-brand-blue bg-white px-4 focus:outline-none focus:ring-0"

                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-lg bg-brand-blue text-base font-medium text-white shadow-sm transition-all hover:bg-brand-blue-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-brand-blue hover:text-brand-blue-dark">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
