import { Sidebar } from "@/components/sidebar"
import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <main className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your personal information and preferences</p>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <ProfileForm />
          </div>
        </div>
      </div>
    </main>
  )
}
