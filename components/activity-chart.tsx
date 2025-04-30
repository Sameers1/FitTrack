"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Mock data for the chart
const mockData = [
  { day: "Mon", steps: 7500, calories: 1800, sleep: 7.2 },
  { day: "Tue", steps: 9200, calories: 2100, sleep: 6.8 },
  { day: "Wed", steps: 8100, calories: 1950, sleep: 7.5 },
  { day: "Thu", steps: 10500, calories: 2300, sleep: 8.1 },
  { day: "Fri", steps: 7800, calories: 1850, sleep: 6.5 },
  { day: "Sat", steps: 6500, calories: 1700, sleep: 8.5 },
  { day: "Sun", steps: 5200, calories: 1500, sleep: 9.0 },
]

type DataKey = "steps" | "calories" | "sleep"

export function ActivityChart() {
  const [activeMetric, setActiveMetric] = useState<DataKey>("steps")
  const [isAnimated, setIsAnimated] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Get max value for the selected metric to normalize the chart
  const getMaxValue = () => {
    return Math.max(...mockData.map((item) => item[activeMetric] as number)) * 1.2
  }

  // Calculate the height percentage for each bar
  const calculateHeight = (value: number) => {
    return (value / getMaxValue()) * 100
  }

  // Format the value based on the metric
  const formatValue = (value: number) => {
    switch (activeMetric) {
      case "steps":
        return value.toLocaleString()
      case "calories":
        return `${value} kcal`
      case "sleep":
        return `${value} hrs`
      default:
        return value.toString()
    }
  }

  useEffect(() => {
    // Reset animation state when metric changes
    setIsAnimated(false)

    // Trigger animation after a small delay
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [activeMetric])

  return (
    <div ref={chartRef}>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveMetric("steps")}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            activeMetric === "steps"
              ? "bg-foreground text-background"
              : "bg-accent text-accent-foreground hover:bg-accent/80",
          )}
        >
          Steps
        </button>
        <button
          onClick={() => setActiveMetric("calories")}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            activeMetric === "calories"
              ? "bg-foreground text-background"
              : "bg-accent text-accent-foreground hover:bg-accent/80",
          )}
        >
          Calories
        </button>
        <button
          onClick={() => setActiveMetric("sleep")}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            activeMetric === "sleep"
              ? "bg-foreground text-background"
              : "bg-accent text-accent-foreground hover:bg-accent/80",
          )}
        >
          Sleep
        </button>
      </div>
      <div className="h-64">
        <div className="flex h-full items-end justify-between">
          {mockData.map((item, index) => {
            const height = calculateHeight(item[activeMetric] as number)
            return (
              <div key={item.day} className="group flex w-full flex-col items-center">
                <div className="relative mb-2 w-full px-1">
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 rounded-t-sm bg-foreground/80 transition-all duration-700 ease-out",
                      isAnimated ? "opacity-100" : "opacity-0",
                    )}
                    style={{
                      height: isAnimated ? `${height}%` : "0%",
                      transitionDelay: `${index * 100}ms`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded bg-background/90 px-2 py-1 text-xs">
                      {formatValue(item[activeMetric] as number)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
