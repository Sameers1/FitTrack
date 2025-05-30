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
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <div className="flex items-center gap-4 border-b px-6 py-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <Dashboard />
      </div>
    </div>
  )
}
