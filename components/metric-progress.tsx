import { Progress } from "@/components/ui/progress"

interface MetricProgressProps {
  title: string
  current: number
  target: number
  unit: string
}

export function MetricProgress({ title, current, target, unit }: MetricProgressProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">
          {current.toLocaleString()} / {target.toLocaleString()} {unit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}
