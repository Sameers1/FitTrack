import type React from "react"
import { cn } from "@/lib/utils"
import { Clock, AlertCircle } from "lucide-react"

interface ComingSoonProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function ComingSoon({ title, description, icon, className }: ComingSoonProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
        {icon || <Clock className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h2 className="mb-2 text-2xl font-bold">{title} Coming Soon</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        {description ||
          "We're working hard to bring you this feature. Stay tuned for updates and new improvements to enhance your fitness journey."}
      </p>
      <div className="flex items-center gap-2 rounded-lg border bg-card/50 p-3 text-sm">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <span>We'll notify you when this feature becomes available.</span>
      </div>
    </div>
  )
}
