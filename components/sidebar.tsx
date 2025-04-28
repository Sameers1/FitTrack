"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Footprints,
  Home,
  LineChart,
  LogOut,
  Menu,
  Moon,
  User,
  Dumbbell,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { supabase } from "@/lib/supabase"

// Update the navItems array to mark certain items as "coming soon" and remove Settings
const navItems = [
  {
    category: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Timer", href: "/timer", icon: Clock },
    ],
  },
  {
    category: "Health Metrics",
    items: [
      { name: "Steps", href: "/steps", icon: Footprints },
      { name: "Sleep", href: "/sleep", icon: Moon, comingSoon: true },
      { name: "Hydration", href: "/hydration", icon: Droplets },
      { name: "Heart Rate", href: "/heart-rate", icon: Heart, comingSoon: true },
      { name: "Calories", href: "/calories", icon: BarChart3, comingSoon: true },
    ],
  },
  {
    category: "Fitness",
    items: [
      { name: "Workouts", href: "/workouts", icon: Dumbbell },
      { name: "Statistics", href: "/statistics", icon: LineChart, comingSoon: true },
      { name: "Calendar", href: "/calendar", icon: Calendar, comingSoon: true },
      { name: "Profile", href: "/profile", icon: User },
    ],
  },
]

// Update the Sidebar component to improve animations and add "coming soon" badges
export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const isMobile = useMobile()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/auth/login")
  }

  const SidebarContent = () => (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-card transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-64",
      )}
    >
      <div className={cn("flex items-center gap-2 border-b p-4", collapsed ? "justify-center" : "px-4")}>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
          <Footprints className="h-5 w-5 text-background" />
        </div>
        <span
          className={cn(
            "text-xl font-semibold transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
          )}
        >
          FitTrack
        </span>
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto h-8 w-8 transition-all duration-200", collapsed ? "ml-0" : "")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 border-b p-4 transition-all duration-300",
          collapsed ? "justify-center" : "px-4",
        )}
      >
        <Avatar className="h-10 w-10 border-2 border-primary/10 transition-transform duration-300 ease-in-out hover:scale-110">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "flex flex-col transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
          )}
        >
          <span className="text-sm font-medium">John Doe</span>
          <span className="text-xs text-muted-foreground">Premium Member</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((category) => (
            <div key={category.category} className="mb-4">
              {!collapsed && (
                <div className="mb-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category.category}
                </div>
              )}
              <div className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.comingSoon ? "#" : item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                            collapsed && "justify-center px-2",
                            item.comingSoon &&
                              "opacity-70 cursor-default hover:bg-transparent hover:text-muted-foreground",
                          )}
                          onClick={(e) => item.comingSoon && e.preventDefault()}
                        >
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded transition-colors duration-200",
                              isActive ? "bg-primary-foreground text-primary" : "bg-background text-foreground",
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          {!collapsed && (
                            <div className="flex items-center justify-between w-full">
                              <span>{item.name}</span>
                              {item.comingSoon && (
                                <span className="ml-auto text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded-full">
                                  Soon
                                </span>
                              )}
                            </div>
                          )}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          <div className="flex items-center gap-2">
                            {item.name}
                            {item.comingSoon && (
                              <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded-full">Soon</span>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </nav>

      <div className={cn("mt-auto border-t p-4 transition-all duration-300", collapsed && "flex justify-center")}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200",
            collapsed && "justify-center px-2",
          )}
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span
            className={cn(
              "transition-opacity duration-200",
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
            )}
          >
            Log Out
          </span>
        </Button>
      </div>
    </div>
  )

  // Mobile sidebar with sheet
  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 lg:hidden" aria-label="Menu">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </Button>
      </>
    )
  }

  // Desktop sidebar
  return <SidebarContent />
}
