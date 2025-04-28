import { Sidebar } from "@/components/sidebar"
import { StopwatchTimer } from "@/components/stopwatch-timer"

export default function TimerPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Timer</h1>
            <p className="text-sm text-muted-foreground">Track your workouts and activities</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-md rounded-lg border bg-card p-6 shadow-lg animate-in scale-in">
            <StopwatchTimer />
          </div>
        </div>
      </div>
    </main>
  )
}
