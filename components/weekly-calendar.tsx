"use client"

import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"

interface WeeklyCalendarProps {
  currentDate: Date
}

export function WeeklyCalendar({ currentDate }: WeeklyCalendarProps) {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 })

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i)
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      isToday: isSameDay(date, currentDate),
    }
  })

  return (
    <div className="flex justify-between">
      {days.map((day) => (
        <div key={day.dayName} className="flex flex-1 flex-col items-center">
          <span className="text-xs text-muted-foreground">{day.dayName}</span>
          <div
            className={cn(
              "mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
              day.isToday ? "bg-foreground text-background" : "hover:bg-accent",
            )}
          >
            {day.dayNumber}
          </div>
        </div>
      ))}
    </div>
  )
}
