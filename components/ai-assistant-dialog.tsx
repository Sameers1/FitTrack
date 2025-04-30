import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { AiFitnessAssistant } from "./ai-fitness-assistant"
import { Bot, Sparkles } from "lucide-react"

interface AiAssistantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AiAssistantDialog({ open, onOpenChange }: AiAssistantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 gap-0 bg-gradient-to-b from-card to-background border-2">
        <div className="flex items-center gap-3 p-6 pb-2 border-b bg-card/50">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 border border-purple-500/20">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              AI Fitness Assistant
              <Sparkles className="w-4 h-4 text-purple-500" />
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Your personal AI-powered fitness coach and wellness advisor</p>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-hidden bg-gradient-to-b from-transparent to-background/50">
          <div className="h-full rounded-lg border bg-card/50 shadow-inner">
            <AiFitnessAssistant />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 