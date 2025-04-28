"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Award,
  Droplets,
  Footprints,
  Dumbbell,
  Heart,
  Moon,
  Flame,
  Trophy,
  Clock,
  Zap,
  Calendar,
  Target,
} from "lucide-react"

// Badge data
const badges = [
  {
    id: 1,
    name: "Step Master",
    description: "Reach 10,000 steps in a day",
    icon: Footprints,
    category: "steps",
    progress: 100,
    achieved: true,
    date: "2023-04-15",
    color: "bg-blue-500/20 text-blue-500",
  },
  {
    id: 2,
    name: "Hydration Hero",
    description: "Drink 3L of water for 7 consecutive days",
    icon: Droplets,
    category: "hydration",
    progress: 100,
    achieved: true,
    date: "2023-04-10",
    color: "bg-cyan-500/20 text-cyan-500",
  },
  {
    id: 3,
    name: "Workout Warrior",
    description: "Complete 5 workouts in a week",
    icon: Dumbbell,
    category: "workouts",
    progress: 100,
    achieved: true,
    date: "2023-04-05",
    color: "bg-emerald-500/20 text-emerald-500",
  },
  {
    id: 4,
    name: "Early Bird",
    description: "Wake up before 6 AM for 5 consecutive days",
    icon: Clock,
    category: "sleep",
    progress: 60,
    achieved: false,
    color: "bg-orange-500/20 text-orange-500",
  },
  {
    id: 5,
    name: "Marathon Runner",
    description: "Run a total of 42.2 km",
    icon: Zap,
    category: "steps",
    progress: 75,
    achieved: false,
    color: "bg-purple-500/20 text-purple-500",
  },
  {
    id: 6,
    name: "Sleep Champion",
    description: "Get 8 hours of sleep for 10 consecutive days",
    icon: Moon,
    category: "sleep",
    progress: 30,
    achieved: false,
    color: "bg-indigo-500/20 text-indigo-500",
  },
  {
    id: 7,
    name: "Calorie Crusher",
    description: "Burn 5000 calories in a week",
    icon: Flame,
    category: "calories",
    progress: 45,
    achieved: false,
    color: "bg-red-500/20 text-red-500",
  },
  {
    id: 8,
    name: "Heart Health",
    description: "Maintain heart rate in optimal zone during workouts for 10 sessions",
    icon: Heart,
    category: "heart",
    progress: 20,
    achieved: false,
    color: "bg-rose-500/20 text-rose-500",
  },
  {
    id: 9,
    name: "Consistency King",
    description: "Log in to the app for 30 consecutive days",
    icon: Calendar,
    category: "general",
    progress: 90,
    achieved: false,
    color: "bg-amber-500/20 text-amber-500",
  },
  {
    id: 10,
    name: "Goal Getter",
    description: "Achieve all daily goals for a full week",
    icon: Target,
    category: "general",
    progress: 85,
    achieved: false,
    color: "bg-teal-500/20 text-teal-500",
  },
]

export function Badges() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredBadges =
    activeTab === "all"
      ? badges.filter(badge => !badge.achieved)
      : activeTab === "achieved"
        ? badges.filter((badge) => badge.achieved)
        : badges.filter((badge) => !badge.achieved)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Achievements & Badges</h2>
          <p className="text-muted-foreground">Track your progress and earn rewards for your fitness journey</p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="achieved">Achieved</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <Card
            key={badge.id}
            className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-lg",
              badge.achieved ? "border-primary/30" : "border-muted",
            )}
          >
            <CardHeader className={cn("pb-2", badge.achieved && "bg-gradient-to-r from-primary/5 to-transparent")}>
              <CardTitle className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    badge.color,
                    badge.achieved && "achievement-glow",
                  )}
                >
                  <badge.icon className="h-4 w-4" />
                </div>
                <span>{badge.name}</span>
                {badge.achieved && <Trophy className="ml-auto h-4 w-4 text-yellow-500" />}
              </CardTitle>
              <CardDescription>{badge.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{badge.progress}%</span>
                </div>
                <Progress value={badge.progress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              {badge.achieved ? (
                <p className="text-xs text-muted-foreground">Achieved on {new Date(badge.date).toLocaleDateString()}</p>
              ) : (
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  <Award className="mr-2 h-3 w-3" />
                  View Details
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
