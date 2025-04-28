import type React from "react"
import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { cva } from "class-variance-authority"

interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  value: string
  unit?: string
  target?: string
  icon?: React.ReactNode
  progress?: number
  trend?: string
  trendUp?: boolean
  size?: "default" | "large"
}

const trendVariants = cva("font-medium", {
  variants: {
    trend: {
      up: "text-emerald-500",
      down: "text-rose-500",
      neutral: "text-muted-foreground",
    },
    size: {
      default: "text-xs",
      large: "text-sm",
    },
  },
  defaultVariants: {
    trend: "neutral",
    size: "default",
  },
})

export function MetricCard({
  title,
  value,
  unit,
  target,
  icon,
  progress = 0,
  trend,
  trendUp,
  size = "default",
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card transition-all duration-300",
        "hover:shadow-lg hover:border-foreground/20 hover:-translate-y-1",
        size === "large" ? "p-6" : "p-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 group-hover:scale-[1.02] transition-transform duration-300">
          {icon && (
            <div
              className={cn(
                "flex items-center justify-center rounded-full bg-foreground/10 text-foreground transition-all duration-300",
                "group-hover:bg-foreground/20 group-hover:shadow-md",
                size === "large" ? "h-14 w-14" : "h-8 w-8",
              )}
            >
              {icon}
            </div>
          )}
          <h3 className={cn("font-medium text-muted-foreground", size === "large" ? "text-lg" : "text-sm")}>{title}</h3>
        </div>
        {trend && (
          <span
            className={trendVariants({
              trend: trendUp ? "up" : trendUp === false ? "down" : "neutral",
              size: size === "large" ? "large" : "default",
            })}
          >
            {trend}
          </span>
        )}
      </div>
      <div
        className={cn(
          "flex items-baseline transition-all duration-300",
          size === "large" ? "mt-6" : "mt-3",
          "group-hover:scale-[1.03] group-hover:translate-x-1",
        )}
      >
        <span className={cn("font-bold", size === "large" ? "text-5xl" : "text-2xl")}>{value}</span>
        {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
      </div>
      {target && (
        <p
          className={cn(
            "text-muted-foreground transition-all duration-300",
            size === "large" ? "mt-2 text-sm" : "mt-1 text-xs",
            "group-hover:text-foreground/80",
          )}
        >
          Target: {target}
        </p>
      )}
      {progress > 0 && (
        <div className={cn(size === "large" ? "mt-4" : "mt-3")}>
          <Progress
            value={progress}
            className={cn(
              "transition-all duration-300",
              size === "large" ? "h-2 group-hover:h-3" : "h-1.5 group-hover:h-2",
            )}
          />
        </div>
      )}

      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground to-transparent"></div>
      </div>
    </div>
  )
}
