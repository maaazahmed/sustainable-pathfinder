"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    name: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
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
  //     // This is where you would implement your registration logic
  //     console.log("Register with:", formData)

  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     // For demo purposes, store user in localStorage
  //     // In a real app, you would use a proper auth solution
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem(
  //         "user",
  //         JSON.stringify({
  //           name: formData.name,
  //           email: formData.email,
  //         }),
  //       )
  //     }

  //     // Simple notification instead of using toast
  //     alert("Account created successfully! Redirecting to dashboard...")

  //     // Redirect to dashboard after successful registration
  //     router.push("/dashboard")
  //   } catch (error) {
  //     console.error("Registration failed:", error)
  //     alert("Registration failed. Please try again.")
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
      const result = await register(formData.name, formData.email, formData.password)

      if (result.success) {
        // Redirect to dashboard after successful registration
        router.push("/dashboard")
      } else {
        setErrors({ ...errors, general: result.message })
      }
    } catch (error) {
      console.error("Registration failed:", error)
      setErrors({ ...errors, general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return Math.min(strength, 5)
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const getPasswordStrengthText = () => {
    if (!formData.password) return ""
    const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"]
    return strengthLabels[passwordStrength]
  }

  const getPasswordStrengthColor = () => {
    if (!formData.password) return "bg-gray-200"
    const colors = [
      "bg-red-500", // Very weak
      "bg-orange-500", // Weak
      "bg-yellow-500", // Fair
      "bg-lime-500", // Good
      "bg-green-500", // Strong
    ]
    return colors[Math.min(passwordStrength, 4)]
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Left side - Brand section */}
      <div className="hidden w-1/2 flex-col justify-between bg-brand-green p-12 text-white lg:flex">
        <div className="border-[10px] border-white rounded-md" >
          <Logo className="h-12 w-auto " />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Join Sustainable Pathfinders</h1>
          <p className="text-xl opacity-90">
            Create your account and start your journey towards sustainable solutions.
          </p>
          <div className="h-1 w-20 bg-white/30 rounded"></div>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-lg">Access to exclusive sustainability resources</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-lg">Connect with sustainability experts</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-lg">Track your environmental impact</p>
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
              className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-brand-green"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </button>
            <div className="lg:hidden">
              <Logo className="h-8 w-auto" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">Sign up to get started with our service</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="h-12 rounded-lg text-brand-blue-dark border-gray-300 bg-white px-4 shadow-sm focus:border-brand-green focus:ring-brand-green"
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

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
                className="h-12 rounded-lg text-brand-blue-dark border-gray-300 bg-white px-4 shadow-sm focus:border-brand-green focus:ring-brand-green"
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="h-12 rounded-lg border-gray-300 text-brand-blue-dark bg-white px-4 shadow-sm focus:border-brand-green focus:ring-brand-green"
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

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength: <span className="font-medium">{getPasswordStrengthText()}</span>
                  </p>
                </div>
              )}

              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li className="flex items-center">
                  <span className={formData.password.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</span>
                </li>
                <li className="flex items-center">
                  <span className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>
                    • At least one uppercase letter
                  </span>
                </li>
                <li className="flex items-center">
                  <span className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}>• At least one number</span>
                </li>
                <li className="flex items-center">
                  <span className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : ""}>
                    • At least one special character
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="font-medium text-brand-green hover:text-brand-green-dark">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-brand-green hover:text-brand-green-dark">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-lg bg-brand-green text-base font-medium text-white shadow-sm transition-all hover:bg-brand-green-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 flex-shrink text-sm text-gray-500">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div> */}

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-brand-green hover:text-brand-green-dark">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
