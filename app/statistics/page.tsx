import { Sidebar } from "@/components/sidebar"
import { ComingSoon } from "@/components/coming-soon"
import { BarChart3 } from "lucide-react"

export default function StatisticsPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Statistics</h1>
            <p className="text-sm text-muted-foreground">Analyze your fitness data and progress</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="flex h-[80vh] items-center justify-center rounded-lg border bg-card/50">
            <ComingSoon
              title="Statistics & Analytics"
              icon={<BarChart3 className="h-10 w-10 text-emerald-500" />}
              description="Soon you'll be able to visualize your fitness data, track your progress over time, and gain valuable insights into your health journey."
            />
          </div>
        </div>
      </div>
    </main>
  )
}
