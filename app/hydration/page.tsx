import { Sidebar } from "@/components/sidebar"
import { WaterTracker } from "@/components/water-tracker"

export default function HydrationPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-centerer justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Hydration</h1>
            <p className="text-sm text-muted-foreground">Track your daily water intake</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <WaterTracker className="animate-in scale-in" />
          </div>
        </div>
      </div>
    </main>
  )
}
