import { Sidebar } from "@/components/sidebar"
import { Badges } from "@/components/badges"

export default function BadgesPage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Badges & Rewards</h1>
            <p className="text-sm text-muted-foreground">Track your achievements and earn rewards</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <Badges />
        </div>
      </div>
    </main>
  )
}
