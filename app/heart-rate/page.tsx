import { Sidebar } from "@/components/sidebar"
import { ComingSoon } from "@/components/coming-soon"
import { Heart } from "lucide-react"

export default function HeartRatePage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Heart Rate</h1>
            <p className="text-sm text-muted-foreground">Monitor your heart rate and cardiovascular health</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="flex h-[80vh] items-center justify-center rounded-lg border bg-card/50">
            <ComingSoon
              title="Heart Rate Tracking"
              icon={<Heart className="h-10 w-10 text-rose-500" />}
              description="Soon you'll be able to monitor your heart rate, track your cardiovascular health, and analyze your heart rate zones in real-time."
            />
          </div>
        </div>
      </div>
    </main>
  )
}
