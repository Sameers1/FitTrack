"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Droplets, Plus, Minus, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { HydrationGauge } from "./hydration-gauge"

interface WaterTrackerProps extends React.HTMLAttributes<HTMLDivElement> {}

interface UserProfile {
  id: string;
  height?: number;
  weight?: number;
  activity_level?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export function WaterTracker({ className, ...props }: WaterTrackerProps) {
  const [waterConsumed, setWaterConsumed] = useState(0)
  const [lastDrink, setLastDrink] = useState<Date>(new Date())
  const [activeHydration, setActiveHydration] = useState(0) // L currently hydrating
  const totalBodyWater = 45
  const [dailyTarget, setDailyTarget] = useState(1) // 1L
  const remainingToTarget = Math.max(0, dailyTarget - waterConsumed)
  const percentComplete = Math.min(100, (waterConsumed / dailyTarget) * 100)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [temperature, setTemperature] = useState(25)
  const [decayRate, setDecayRate] = useState(1)
  const [dehydratingFast, setDehydratingFast] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0) // minutes left

  // Timer reference for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch user profile and temperature from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return
      const { data: user } = await supabase
        .from("users")
        .select("id, height, weight, activity_level, city, latitude, longitude")
        .eq("auth_id", auth.user.id)
        .single()
      setUserProfile(user as UserProfile)
      // Fetch temperature from dashboard logic or wttr.in
      if (user?.latitude && user?.longitude) {
        const res = await fetch(`https://wttr.in/${user.latitude},${user.longitude}?format=%t`)
        const tempText = await res.text()
        const tempNum = parseInt(tempText)
        setTemperature(isNaN(tempNum) ? 25 : tempNum)
      }
    }
    fetchProfile()
  }, [])

  // Calculate decay rate based on user and temp
  useEffect(() => {
    if (!userProfile) return
    let baseDecay = 1 // 1% per 30min
    if (temperature > 30) baseDecay += 0.5
    if (userProfile.activity_level === "active" || userProfile.activity_level === "very_active") baseDecay += 0.5
    if (userProfile.weight && userProfile.weight > 80) baseDecay += 0.25
    setDecayRate(baseDecay)
    setDehydratingFast(baseDecay > 1.5)
  }, [userProfile, temperature])

  // Calculate personalized daily target (ml): 35ml per kg + 500ml if temp > 30 + 500ml if very active
  useEffect(() => {
    if (!userProfile) return
    let target = userProfile.weight ? userProfile.weight * 0.035 : 2.5 // L
    if (temperature > 30) target += 0.5
    if (userProfile.activity_level === "very_active") target += 0.5
    setDailyTarget(target)
  }, [userProfile, temperature])

  // Hydration decay logic: 1L = 7h to 0%. Decay rate = 1L / (7*60) per minute
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current as NodeJS.Timeout)
    if (activeHydration === 0) return
    const decayPerMinute = 1 / (7 * 60) // L per minute
    timerRef.current = setInterval(() => {
      setActiveHydration((prev) => Math.max(0, prev - decayPerMinute))
    }, 60 * 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current as NodeJS.Timeout)
    }
  }, [activeHydration])

  // Update timeLeft whenever activeHydration changes
  useEffect(() => {
    setTimeLeft(Math.round(activeHydration * 7 * 60)) // 1L = 7h = 420min
  }, [activeHydration])

  // Log hydration event to Supabase
  const logHydration = async (amount: number) => {
    if (!userProfile) return
    await supabase.from("hydration_logs").insert({
      user_id: userProfile.id,
      date: new Date().toISOString().slice(0, 10),
      hydration_percent: Math.min(100, (activeHydration / 1) * 100),
      water_ml: amount * 1000,
      temperature_c: temperature,
    })
  }

  // Add water: add 0.5L to activeHydration (max 1L)
  const addWater = async () => {
    if (!userProfile) {
      console.error("User profile not loaded, cannot add water")
      return
    }
    setWaterConsumed((prev) => prev + 0.5)
    setActiveHydration((prev) => Math.min(1, prev + 0.5))
    setLastDrink(new Date())
    const { error } = await supabase.from("hydration_logs").insert({
      user_id: userProfile.id,
      date: new Date().toISOString().slice(0, 10),
      hydration_percent: Math.min(100, ((activeHydration + 0.5) / 1) * 100),
      water_ml: 500,
      temperature_c: temperature,
    })
    if (error) {
      console.error("Supabase insert error:", error)
    } else {
      console.log("Hydration log inserted successfully")
    }
  }

  // Remove water: subtract 0.5L from activeHydration (min 0)
  const removeWater = async () => {
    if (!userProfile) {
      console.error("User profile not loaded, cannot remove water")
      return
    }
    if (waterConsumed <= 0) return
    setWaterConsumed((prev) => Math.max(0, prev - 0.5))
    setActiveHydration((prev) => Math.max(0, prev - 0.5))
    setLastDrink(new Date())
    const { error } = await supabase.from("hydration_logs").insert({
      user_id: userProfile.id,
      date: new Date().toISOString().slice(0, 10),
      hydration_percent: Math.max(0, ((activeHydration - 0.5) / 1) * 100),
      water_ml: -500,
      temperature_c: temperature,
    })
    if (error) {
      console.error("Supabase remove error:", error)
    } else {
      console.log("Hydration removal logged successfully")
    }
  }

  // Reset hydration at start of day
  useEffect(() => {
    const now = new Date()
    if (now.getHours() === 0 && now.getMinutes() < 5) {
      setActiveHydration(0)
      setWaterConsumed(0)
    }
  }, [])

  // Format time since last drink
  const getTimeSinceLastDrink = () => {
    const now = new Date()
    const diffMs = now.getTime() - lastDrink.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours === 1) return "1 hour ago"
    return `${diffHours} hours ago`
  }

  // Hydration percent for UI
  const hydrationLevel = Math.min(100, (activeHydration / 1) * 100)

  // Format time left as h m
  const formatTimeLeft = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h > 0 ? `${h}h ` : ""}${m}m left`
  }

  // Restore hydration state from Supabase on mount
  useEffect(() => {
    if (!userProfile) return;
    const fetchHydration = async () => {
      const today = new Date().toISOString().slice(0, 10)
      const { data: logs, error } = await supabase
        .from("hydration_logs")
        .select("water_ml, created_at")
        .eq("user_id", userProfile.id)
        .eq("date", today)
        .order("created_at", { ascending: true })
      if (logs && logs.length > 0) {
        // Total water consumed today
        const totalWater = logs.reduce((sum, log) => sum + (log.water_ml || 0), 0)
        setWaterConsumed(totalWater / 1000)
        // Calculate active hydration: sum of all drinks, each decaying independently
        const now = new Date()
        const decayPerMinute = 1 / (7 * 60) // L per minute
        let active = 0
        logs.forEach((log) => {
          const drinkL = (log.water_ml || 0) / 1000
          const minsElapsed = Math.floor((now.getTime() - new Date(log.created_at).getTime()) / 60000)
          if (minsElapsed < 7 * 60) {
            if (drinkL > 0) {
              const decayed = Math.max(0, drinkL - decayPerMinute * minsElapsed)
              active += decayed
            } else if (drinkL < 0) {
              // Remove water: subtract immediately, no decay
              active += drinkL // drinkL is negative
            }
          }
        })
        setActiveHydration(Math.max(0, Math.min(1, active)))
        // Last drink time
        setLastDrink(new Date(logs[logs.length - 1].created_at))
      } else {
        setActiveHydration(0)
        setWaterConsumed(0)
        setLastDrink(new Date())
      }
    }
    fetchHydration()
  }, [userProfile])

  // Add hydration decay timer (every 10 min)
  useEffect(() => {
    if (!userProfile) return;
    const interval = setInterval(() => {
      // Re-run the hydration restore logic to update decay
      const today = new Date().toISOString().slice(0, 10)
      supabase
        .from("hydration_logs")
        .select("water_ml, created_at")
        .eq("user_id", userProfile.id)
        .eq("date", today)
        .order("created_at", { ascending: true })
        .then(({ data: logs }) => {
          if (logs && logs.length > 0) {
            const now = new Date()
            const decayPerMinute = 1 / (7 * 60)
            let active = 0
            logs.forEach((log) => {
              const drinkL = (log.water_ml || 0) / 1000
              const minsElapsed = Math.floor((now.getTime() - new Date(log.created_at).getTime()) / 60000)
              if (minsElapsed < 7 * 60) {
                if (drinkL > 0) {
                  const decayed = Math.max(0, drinkL - decayPerMinute * minsElapsed)
                  active += decayed
                } else if (drinkL < 0) {
                  // Remove water: subtract immediately, no decay
                  active += drinkL // drinkL is negative
                }
              }
            })
            setActiveHydration(Math.max(0, Math.min(1, active)))
          } else {
            setActiveHydration(0)
          }
        })
    }, 10 * 60 * 1000) // every 10 min
    return () => clearInterval(interval)
  }, [userProfile])

  const resetHydration = async () => {
    setActiveHydration(0)
    setWaterConsumed(0)
    setLastDrink(new Date())
    if (userProfile) {
      const today = new Date().toISOString().slice(0, 10)
      // Delete all hydration logs for today for this user
      await supabase.from("hydration_logs")
        .delete()
        .eq("user_id", userProfile.id)
        .eq("date", today)
      // Insert a single reset log
      await supabase.from("hydration_logs").insert({
        user_id: userProfile.id,
        date: today,
        hydration_percent: 0,
        water_ml: 0,
        temperature_c: temperature,
      })
    }
  }

  return (
    <div className={cn("rounded-lg border bg-card p-6 transition-all duration-300", className)} {...props}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--water)/0.2)] text-[hsl(var(--water))]">
              <Droplets className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium">Hydration</h3>
            <span className="ml-auto text-sm text-muted-foreground">Last drink: {getTimeSinceLastDrink()}</span>
          </div>

          <div className="mb-6 group">
            <div className="flex justify-between mb-2">
              <span className="text-2xl font-bold">{waterConsumed.toFixed(1)}L</span>
              <span className="text-muted-foreground">of {dailyTarget.toFixed(1)}L daily target</span>
            </div>
            <Progress value={percentComplete} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground mb-1">Total Body Water</div>
              <div className="text-xl font-bold">{totalBodyWater}L</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground mb-1">Remaining to Drink</div>
              <div className="text-xl font-bold">{remainingToTarget.toFixed(1)}L</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={addWater}
              className="flex-1 py-6 text-lg bg-[hsl(var(--water))] hover:bg-[hsl(var(--water))] hover:brightness-110"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add 500ml Water
            </Button>
            <Button onClick={removeWater} variant="outline" className="py-6" disabled={waterConsumed <= 0}>
              <Minus className="h-5 w-5" />
            </Button>
          </div>

          <Button onClick={resetHydration} variant="destructive" className="w-full mt-2">
            Reset Hydration
          </Button>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <HydrationGauge hydrationLevel={hydrationLevel} activeHydration={activeHydration} />
        </div>
      </div>
    </div>
  )
}

