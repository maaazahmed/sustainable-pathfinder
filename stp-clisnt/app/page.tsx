"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
      </div>
    )
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-brand-green">Welcome</h1>
          <p className="mt-2 text-gray-600">Sign in to your account or create a new one</p>
        </div>
        <div className="mt-8 space-y-5">
          <Link href="/login" className="block w-full">
            <Button className="w-full py-6 text-base text-white font-medium shadow-sm transition-all hover:shadow-md bg-brand-green hover:bg-brand-green-dark">
              Sign In
            </Button>
          </Link>
          <Link href="/register" className="block w-full">
            <Button
              variant="outline"
              className="w-full py-6 text-base text-white font-medium shadow-sm transition-all hover:shadow-md  bg-brand-blue  hover:bg-brand-blue-dark"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
