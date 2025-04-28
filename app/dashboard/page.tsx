"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: any }) => {
      if (!data.user) {
        router.replace("/auth/login")
      } else {
        setLoading(false)
      }
    })
  }, [router, supabase])

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-xl">Loading...</div>
  }

  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <Dashboard />
    </main>
  )
}
