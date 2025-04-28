"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Droplets, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface WaterTrackerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WaterTracker({ className, ...props }: WaterTrackerProps) {
  const [waterConsumed, setWaterConsumed] = useState(0)
  const [lastDrink, setLastDrink] = useState<Date>(new Date())
  const [hydrationLevel, setHydrationLevel] = useState(15) // Start at 15%
  const totalBodyWater = 45
  const dailyTarget = 3.5
  const remainingToTarget = Math.max(0, dailyTarget - waterConsumed)
  const percentComplete = Math.min(100, (waterConsumed / dailyTarget) * 100)

  // Timer reference for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize hydration level based on water consumed
  useEffect(() => {
    // If we have 1L of water, set to 100%
    if (waterConsumed >= 1) {
      setHydrationLevel(100)
    } else if (waterConsumed > 0) {
      // Scale proportionally if less than 1L
      setHydrationLevel(Math.min(100, waterConsumed * 100))
    }
  }, [])

  // Simulate natural decrease in hydration over time
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Set up a new timer that decreases hydration every 30 seconds
    timerRef.current = setInterval(() => {
      setHydrationLevel((prev) => {
        // Decrease by 1% every 30 seconds, but don't go below 10%
        return Math.max(10, prev - 1)
      })
    }, 30000) // Every 30 seconds for demo purposes (would be slower in real app)

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const addWater = () => {
    const amount = 0.25 // 250ml
    const newTotal = Math.min(dailyTarget * 1.5, waterConsumed + amount)
    setWaterConsumed(newTotal)
    setLastDrink(new Date())

    // If we reach 1L, set to 100%, otherwise increase proportionally
    if (newTotal >= 1) {
      setHydrationLevel(100)
    } else {
      // Each 250ml increases by ~25% if below 1L
      setHydrationLevel((prev) => Math.min(100, prev + 25))
    }
  }

  const removeWater = () => {
    const amount = 0.25
    const newTotal = Math.max(0, waterConsumed - amount)
    setWaterConsumed(newTotal)

    // Decrease hydration level when removing water
    setHydrationLevel((prev) => {
      if (newTotal >= 1) {
        return 100
      } else if (newTotal === 0) {
        return 15 // Base level
      } else {
        return Math.max(15, newTotal * 100)
      }
    })
  }

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
              <span className="text-muted-foreground">of {dailyTarget}L daily target</span>
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
              Add 250ml Water
            </Button>
            <Button onClick={removeWater} variant="outline" className="py-6" disabled={waterConsumed <= 0}>
              <Minus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-48 h-80 rounded-3xl overflow-hidden border-2 border-foreground/20 shadow-lg">
            {/* Water drop background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzAwODhGRiIvPjwvc3ZnPg==')]"></div>
            </div>

            {/* Hydration level indicator */}
            <div className="absolute top-0 left-0 right-0 flex justify-center p-4">
              <span className="text-sm font-medium bg-background/80 px-3 py-1 rounded-full shadow-sm">
                Hydration Level: {Math.round(hydrationLevel)}%
              </span>
            </div>

            {/* Human silhouette */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <svg viewBox="0 0 100 200" width="80" height="160" className="text-foreground/20">
                <path
                  d="M50,0 C60,0 70,10 70,25 C70,40 65,50 65,60 C65,70 70,80 70,95 C70,110 60,120 50,120 C40,120 30,110 30,95 C30,80 35,70 35,60 C35,50 30,40 30,25 C30,10 40,0 50,0 Z"
                  fill="currentColor"
                />
                <path
                  d="M50,120 C60,120 65,130 65,140 C65,150 60,160 60,170 C60,180 65,190 65,200 L35,200 C35,190 40,180 40,170 C40,160 35,150 35,140 C35,130 40,120 50,120 Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Water level with wave effect */}
            <div
              className="absolute left-0 right-0 bottom-0 bg-[hsl(var(--water)/0.7)] transition-all duration-1000 ease-in-out"
              style={{
                height: `${hydrationLevel}%`,
                borderTopLeftRadius: "40%",
                borderTopRightRadius: "40%",
              }}
            >
              {/* Wave effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-6 opacity-50"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    animation: "wave 3s ease-in-out infinite alternate",
                  }}
                ></div>
                <div
                  className="absolute top-3 left-0 right-0 h-4 opacity-30"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    animation: "wave 5s ease-in-out infinite alternate-reverse",
                  }}
                ></div>
              </div>
            </div>

            {/* Water droplets animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[hsl(var(--water)/0.6)]"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: "10%",
                    animation: `droplet ${2 + i * 0.5}s ease-in infinite`,
                    animationDelay: `${i * 0.7}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* Status indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-background/80 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                {hydrationLevel < 30 ? "Dehydrated" : hydrationLevel < 60 ? "Hydrating" : "Well Hydrated"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes droplet {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          80% { transform: translateY(${hydrationLevel}%) scale(0.8); opacity: 0.8; }
          100% { transform: translateY(${hydrationLevel}%) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
