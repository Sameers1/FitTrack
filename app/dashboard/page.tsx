import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <Dashboard />
    </main>
  )
}
