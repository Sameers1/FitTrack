"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { MetricCard } from "@/components/metric-card"
import { WaterTracker } from "@/components/water-tracker"
import { Footprints, Droplets, Dumbbell } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [city, setCity] = useState<string | null>(null)
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [temperature, setTemperature] = useState<string | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(true)
  const isMobile = useMobile()

  useEffect(() => {
    // Fetch user city/lat/lon from Supabase
    const fetchProfile = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) return
      const { data: userProfile } = await supabase
        .from("users")
        .select("city, latitude, longitude")
        .eq("auth_id", auth.user.id)
        .single()
      if (userProfile) {
        setCity(userProfile.city)
        setLat(userProfile.latitude)
        setLon(userProfile.longitude)
        if (userProfile.latitude && userProfile.longitude) {
          fetchWeather(userProfile.latitude, userProfile.longitude)
        } else {
          setLoadingWeather(false)
        }
      } else {
        setLoadingWeather(false)
      }
    }
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const res = await fetch(`https://wttr.in/${latitude},${longitude}?format=%t`)
        const tempText = await res.text()
        setTemperature(tempText)
      } catch (e) {
        setTemperature(null)
      } finally {
        setLoadingWeather(false)
      }
    }
    fetchProfile()
  }, [])

  // Animation classes for elements when they mount
  const animationClass = "animate-in scale-in duration-500"

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold animate-in fade-in duration-300">Welcome Back, John</h1>
          <p className="text-muted-foreground animate-in fade-in duration-300" style={{ animationDelay: "100ms" }}>
            {format(currentDate, "EEEE, dd MMM")}
          </p>
        </div>

        <div className="mb-4 flex items-center gap-4">
          {city && <span className="text-lg font-medium">{city}</span>}
          {loadingWeather ? (
            <span className="text-muted-foreground">Loading weather...</span>
          ) : temperature ? (
            <span className="text-lg">{temperature}</span>
          ) : (
            <span className="text-muted-foreground">Weather unavailable</span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <MetricCard
            title="Steps"
            value="8,432"
            target="10,000"
            icon={<Footprints className="h-8 w-8" />}
            progress={84}
            trend="+12%"
            trendUp={true}
            className={cn("metric-card", animationClass)}
            style={{ animationDelay: "0ms" }}
            size="large"
          />
          <div className={cn("rounded-lg border bg-card p-6", animationClass)} style={{ animationDelay: "100ms" }}>
            <h3 className="text-lg font-medium mb-4">Daily Activity</h3>
            <div className="flex flex-col items-center justify-center h-40 space-y-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-emerald-500 stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                    strokeDasharray="264, 264"
                    strokeDashoffset="132"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">50%</span>
                  <span className="text-sm text-muted-foreground">Complete</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Daily goal progress</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <WaterTracker className={cn(animationClass)} style={{ animationDelay: "200ms" }} />
        </div>

        <div className="mt-6">
          <div className={cn("rounded-lg border bg-card p-6", animationClass)} style={{ animationDelay: "300ms" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium">Recent Achievements</h3>
              <Button variant="outline" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-200">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Footprints className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium text-center">10K Steps</h4>
                <p className="text-xs text-muted-foreground text-center mt-1">Reached 10,000 steps 3 days in a row</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-200">
                <div className="w-16 h-16 rounded-full bg-[hsl(var(--water))/10] flex items-center justify-center mb-3">
                  <Droplets className="h-8 w-8 text-[hsl(var(--water))]" />
                </div>
                <h4 className="font-medium text-center">Hydration Master</h4>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Met daily water goal for 5 consecutive days
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Dumbbell className="h-8 w-8 text-emerald-500" />
                </div>
                <h4 className="font-medium text-center">Workout Warrior</h4>
                <p className="text-xs text-muted-foreground text-center mt-1">Completed 3 workouts this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
