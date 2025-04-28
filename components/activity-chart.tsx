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

export default function ActivityChart() {
  return null; // Remove activity chart display
}
