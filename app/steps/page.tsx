import { Sidebar } from "@/components/sidebar"
import { Footprints, TrendingUp, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StepsPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Steps</h1>
            <p className="text-sm text-muted-foreground">Track your daily steps and activity</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="grid gap-6 max-w-4xl mx-auto">
            <div className="rounded-lg border bg-card p-8 shadow-lg animate-in scale-in">
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground/10 mb-6">
                  <Footprints className="h-10 w-10 text-foreground" />
                </div>
                <h2 className="text-6xl font-bold mb-2">8,432</h2>
                <p className="text-lg text-muted-foreground mb-6">steps today</p>
                <div className="w-full max-w-md mb-3">
                  <Progress value={84} className="h-3" />
                </div>
                <p className="text-muted-foreground">84% of daily goal (10,000 steps)</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div
                className="rounded-lg border bg-card p-6 shadow-lg animate-in scale-in"
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10">
                    <TrendingUp className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Average</p>
                    <p className="text-2xl font-bold">7,845</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monday</span>
                    <span>8,234</span>
                  </div>
                  <Progress value={82} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span>Tuesday</span>
                    <span>9,112</span>
                  </div>
                  <Progress value={91} className="h-2" />

                  <div className="flex justify-between text-sm">
                    <span>Wednesday</span>
                    <span>7,324</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </div>
              </div>

              <div
                className="rounded-lg border bg-card p-6 shadow-lg animate-in scale-in"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10">
                    <Calendar className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">234,567</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Monthly Goal</span>
                    <span>300,000 steps</span>
                  </div>
                  <Progress value={78} className="h-3 mb-2" />
                  <p className="text-sm text-muted-foreground">You're on track to reach your monthly goal!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
