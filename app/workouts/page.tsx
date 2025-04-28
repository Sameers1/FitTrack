import { Sidebar } from "@/components/sidebar"
import { WorkoutTracker } from "@/components/workout-tracker"

export default function WorkoutsPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Workout Tracker</h1>
            <p className="text-muted-foreground">Log and track your workouts</p>
          </div>
          <WorkoutTracker />
        </div>
      </div>
    </main>
  )
}
