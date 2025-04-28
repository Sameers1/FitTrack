"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Play, Pause, RotateCcw, Timer } from "lucide-react"

export function StopwatchTimer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10)
      }, 10)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
  }

  const handleLap = () => {
    setLaps([...laps, time])
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex items-center justify-center">
        <Timer className="mr-2 h-6 w-6 text-foreground" />
        <h2 className="text-2xl font-semibold">Stopwatch</h2>
      </div>
      <div className="mb-8 flex h-32 w-full items-center justify-center rounded-lg bg-background">
        <span className="font-mono text-6xl font-bold tracking-wider">{formatTime(time)}</span>
      </div>
      <div className="mb-8 flex gap-4">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "h-16 w-16 rounded-full transition-transform hover:scale-105 active:scale-95",
            isRunning
              ? "border-rose-500 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-500"
              : "border-foreground bg-foreground/10 text-foreground hover:bg-foreground/20",
          )}
          onClick={handleStartStop}
        >
          {isRunning ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-foreground/50 bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-transform hover:scale-105 active:scale-95"
          onClick={handleReset}
          disabled={time === 0}
        >
          <RotateCcw className="h-8 w-8" />
        </Button>
        <Button
          variant="outline"
          className="h-16 rounded-full px-8 border-foreground/50 bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-transform hover:scale-105 active:scale-95"
          onClick={handleLap}
          disabled={!isRunning && time === 0}
        >
          Lap
        </Button>
      </div>
      {laps.length > 0 && (
        <div className="w-full max-h-60 overflow-auto rounded-lg border">
          <div className="p-3 text-sm font-medium text-muted-foreground border-b">Laps</div>
          <ul className="divide-y">
            {laps.map((lapTime, index) => (
              <li key={index} className="flex items-center justify-between p-3 text-sm hover:bg-accent/5">
                <span className="font-medium">Lap {laps.length - index}</span>
                <span className="font-mono">{formatTime(lapTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
