"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Dumbbell, Footprints } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        // Check if user profile exists
        const { data: userProfile } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", data.user.id)
          .single()
        if (userProfile) {
          router.replace("/dashboard")
        } else {
          router.replace("/profile")
        }
      }
    })
  }, [router, supabase])

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/login`,
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-4 p-8 bg-white/80 dark:bg-black/60 rounded-xl shadow-lg animate-in fade-in duration-500">
        <Dumbbell className="w-12 h-12 text-emerald-500 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FitTrack</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Sign in to track your fitness journey</p>
        <Button
          onClick={handleGoogleSignIn}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md"
        >
          <Footprints className="w-5 h-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
  )
} 