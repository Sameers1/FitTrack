import { Sidebar } from "@/components/sidebar"
import { ComingSoon } from "@/components/coming-soon"
import { Flame } from "lucide-react"

export default function CaloriesPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Calories</h1>
            <p className="text-sm text-muted-foreground">Track your calorie intake and expenditure</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="flex h-[80vh] items-center justify-center rounded-lg border bg-card/50">
            <ComingSoon
              title="Calorie Tracking"
              icon={<Flame className="h-10 w-10 text-orange-500" />}
              description="Soon you'll be able to track your calorie intake, monitor your daily expenditure, and maintain a healthy energy balance."
            />
          </div>
        </div>
      </div>
    </main>
  )
}
