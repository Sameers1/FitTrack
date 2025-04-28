import { Sidebar } from "@/components/sidebar"
import { ComingSoon } from "@/components/coming-soon"
import { Moon } from "lucide-react"

export default function SleepPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Sleep</h1>
            <p className="text-sm text-muted-foreground">Track your sleep patterns and quality</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="flex h-[80vh] items-center justify-center rounded-lg border bg-card/50">
            <ComingSoon
              title="Sleep Tracking"
              icon={<Moon className="h-10 w-10 text-indigo-400" />}
              description="Soon you'll be able to monitor your sleep patterns, track your sleep quality, and get insights to improve your rest."
            />
          </div>
        </div>
      </div>
    </main>
  )
}
