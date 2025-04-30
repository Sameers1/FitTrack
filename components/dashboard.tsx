"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { WaterTracker } from "@/components/water-tracker"
import { 
  Footprints, Cloud, Sun, Moon, Droplets, TrendingUp, 
  Calendar, Award, Flame, Target, ArrowUp, Zap,
  Sparkles, Bolt, SunMedium, MoonStar
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { supabase } from "@/lib/supabase"
import { useTheme } from "next-themes"

export function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [city, setCity] = useState<string | null>(null)
  const [lat, setLat] = useState<number | null>(null)
  const [lon, setLon] = useState<number | null>(null)
  const [temperature, setTemperature] = useState<string | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(true)
  const isMobile = useMobile()
  const { theme, setTheme } = useTheme()

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

  return (
    <div className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background via-background/95 to-background/90 transition-all duration-500">
      <div className="p-6 space-y-6">
        {/* Theme Toggle & Weather Card */}
        <div className="rounded-xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl p-6 shadow-lg ring-1 ring-white/10 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 hover:ring-primary/40 transition-all duration-300 group relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300" />
                {theme === "dark" ? (
                  <SunMedium className="h-6 w-6 text-yellow-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                ) : (
                  <MoonStar className="absolute h-6 w-6 text-primary rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                )}
              </button>
              
              {city && (
                <div className="flex items-center gap-3 group">
                  <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 shadow-inner group-hover:shadow-lg group-hover:ring-primary/40 transition-all duration-300">
                    {new Date().getHours() >= 18 || new Date().getHours() <= 6 ? (
                      <Moon className="h-6 w-6 text-primary animate-pulse" />
                    ) : (
                      <Cloud className="h-6 w-6 text-primary animate-bounce" />
                    )}
                  </div>
                  <div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{city}</span>
                    <p className="text-sm text-muted-foreground">{format(currentDate, "EEEE, dd MMM")}</p>
                  </div>
                </div>
              )}
              {loadingWeather ? (
                <div className="animate-pulse flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="h-6 w-20 rounded bg-muted" />
                </div>
              ) : temperature ? (
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl group hover:bg-accent/20 transition-all duration-300">
                  <Sun className="h-5 w-5 text-yellow-500 group-hover:animate-[spin_1s_linear_infinite]" />
                  <span className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    {temperature}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Water Tracker with Enhanced UI */}
        <div className="rounded-xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl shadow-lg ring-1 ring-white/10 overflow-hidden group hover:ring-primary/30 transition-all duration-300">
          <WaterTracker />
        </div>

        {/* Steps Card with Enhanced UI */}
        <div className="rounded-xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl p-6 shadow-lg ring-1 ring-white/10 group hover:ring-primary/30 transition-all duration-300 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          
          <div className="flex flex-col items-center text-center relative">
            <div className="relative">
              <div className="mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-5 ring-2 ring-primary/20 shadow-xl group-hover:shadow-primary/20 transition-all duration-300">
                <Bolt className="h-12 w-12 text-primary drop-shadow-lg animate-[pulse_2s_ease-in-out_infinite]" />
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="rounded-full bg-emerald-500/20 p-1.5 animate-bounce">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </div>
            <div className="relative">
              <h2 className="text-8xl font-black mb-2 bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                8,432
              </h2>
              <div className="absolute -right-8 -top-3">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10">
                    <Zap className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">+12%</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-8">steps today</p>
            <div className="w-full max-w-md">
              <div className="h-4 w-full rounded-full bg-gradient-to-br from-muted/60 to-muted/30 overflow-hidden shadow-inner group-hover:shadow-primary/20 transition-all duration-300">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/50 transition-all duration-500 group-hover:animate-pulse relative"
                  style={{ width: "84%" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[move_1s_linear_infinite]" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Daily Goal: 10,000 steps</span>
                <span className="font-bold text-primary group-hover:scale-110 transition-transform">84%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid with Enhanced UI */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Weekly Stats */}
          <div className="rounded-xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl p-6 shadow-lg ring-1 ring-white/10 group hover:ring-primary/30 transition-all duration-300 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            
            <div className="flex items-center gap-3 mb-8 relative">
              <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <Flame className="h-6 w-6 text-primary group-hover:animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Weekly Progress</h3>
                <p className="text-sm text-muted-foreground">Average: 7,845 steps</p>
              </div>
            </div>
            <div className="space-y-5 relative">
              {[
                { day: "Monday", steps: 8234, percent: 82 },
                { day: "Tuesday", steps: 9112, percent: 91 },
                { day: "Wednesday", steps: 7324, percent: 73 }
              ].map((day, i) => (
                <div key={day.day} className="group/bar">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{day.day}</span>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary/50" />
                      <span className="text-sm font-bold">{day.steps.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gradient-to-br from-muted/60 to-muted/30 overflow-hidden shadow-inner group-hover/bar:shadow-primary/20 transition-all duration-300">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/50 transition-all duration-300 group-hover/bar:from-primary/80 group-hover/bar:to-primary/30 relative"
                      style={{ 
                        width: `${day.percent}%`,
                        transitionDelay: `${i * 100}ms`
                      }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[move_1s_linear_infinite]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="rounded-xl border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl p-6 shadow-lg ring-1 ring-white/10 group hover:ring-primary/30 transition-all duration-300 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <Calendar className="h-6 w-6 text-primary group-hover:animate-[pulse_1s_ease-in-out_infinite]" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Monthly Overview</h3>
                <p className="text-sm text-muted-foreground">April 2024</p>
              </div>
            </div>
            <div className="text-center mb-8 relative">
              <div className="relative inline-block group-hover:scale-110 transition-transform duration-300">
                <h4 className="text-7xl font-black mb-2 bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                  234,567
                </h4>
                <div className="absolute -right-4 -top-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total Steps This Month</p>
            </div>
            <div className="space-y-4 relative">
              <div className="h-4 w-full rounded-full bg-gradient-to-br from-muted/60 to-muted/30 overflow-hidden shadow-inner group-hover:shadow-primary/20 transition-all duration-300">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/50 transition-all duration-500 relative"
                  style={{ width: "78%" }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[move_1s_linear_infinite]" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Monthly Goal: 300,000 steps</p>
                  <div className="flex items-center gap-2 text-sm text-emerald-500">
                    <Award className="h-4 w-4" />
                    <span className="font-bold">CRUSHING IT! 🔥</span>
                  </div>
                </div>
                <span className="text-3xl font-black bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  78%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add this to your global CSS
const styles = `
@keyframes move {
  0% { background-position: 0 0; }
  100% { background-position: 20px 20px; }
}

.bg-grid-white\/5 {
  background-size: 30px 30px;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}
`;
