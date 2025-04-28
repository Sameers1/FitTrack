import { useState, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { cn } from "@/lib/utils"

interface UserData {
  age: number
  height_cm: number
  weight_kg: number
  fitness_level: "beginner" | "intermediate" | "advanced"
  fitness_goals: string[]
  health_conditions?: string[]
  dietary_restrictions?: string[]
  preferred_workout_days: string[]
  preferred_workout_time: "morning" | "afternoon" | "evening"
  hydration?: {
    today?: {
      water_ml: number
      hydration_percent: number
      temperature_c: number | null
    }
    weeklyAverage?: {
      water_ml: number
      hydration_percent: number
    }
  }
}

interface Message {
  role: "assistant" | "user"
  content: string
}

const DEFAULT_PROFILE: Partial<UserData> = {
  fitness_level: "beginner",
  fitness_goals: ["general_fitness"],
  preferred_workout_days: ["monday", "wednesday", "friday"],
  preferred_workout_time: "morning",
  health_conditions: [],
  dietary_restrictions: []
}

export function AiFitnessAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Fitness Assistant. I can help you with workout plans, nutrition advice, and tracking your fitness goals. How can I help you today?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const supabase = createClientComponentClient()

  // Fetch user data when component mounts
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // First, get the user's basic info and ID mapping
        const { data: basicInfo, error: basicError } = await supabase
          .from('users')
          .select('id, auth_id, age, height, weight, gender, activity_level')
          .eq('auth_id', user.id)
          .single()

        if (basicError) {
          console.error('Error fetching basic info:', basicError)
          return
        }

        if (!basicInfo?.id) {
          console.error('User not found in users table')
          return
        }

        // Get today's hydration data using the correct user_id
        const today = new Date().toISOString().split('T')[0]
        const { data: hydrationData, error: hydrationError } = await supabase
          .from('hydration_logs')
          .select('*')
          .eq('user_id', basicInfo.id)  // Use the ID from users table
          .eq('date', today)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (hydrationError && hydrationError.code !== 'PGRST116') {
          console.error('Error fetching hydration:', hydrationError)
        }

        // Get last 7 days average hydration
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const { data: weekHydration, error: weekHydrationError } = await supabase
          .from('hydration_logs')
          .select('water_ml, hydration_percent')
          .eq('user_id', basicInfo.id)  // Use the ID from users table
          .gte('date', sevenDaysAgo.toISOString().split('T')[0])
          .lte('date', today)

        if (weekHydrationError) {
          console.error('Error fetching week hydration:', weekHydrationError)
        }

        // Calculate weekly averages
        const weeklyAvg = weekHydration?.length ? {
          water_ml: Math.round(weekHydration.reduce((sum, log) => sum + (log.water_ml > 0 ? log.water_ml : 0), 0) / weekHydration.length),
          hydration_percent: Math.round(weekHydration.reduce((sum, log) => sum + Number(log.hydration_percent), 0) / weekHydration.length)
        } : null

        // Then, try to upsert the fitness profile
        const { error: upsertError } = await supabase
          .from('user_fitness_profiles')
          .upsert(
            {
              user_id: user.id,
              age: basicInfo?.age || 0,
              height_cm: basicInfo?.height || 0,
              weight_kg: basicInfo?.weight || 0,
              ...DEFAULT_PROFILE
            },
            { 
              onConflict: 'user_id'
            }
          )

        if (upsertError) {
          console.error('Error upserting profile:', upsertError)
          return
        }

        // Finally, fetch the complete profile
        const { data: profile, error: fetchError } = await supabase
          .from('user_fitness_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (fetchError) {
          console.error('Error fetching profile:', fetchError)
          return
        }

        if (!profile) {
          console.error('Profile not found after upsert')
          return
        }

        const userData = {
          age: profile.age || basicInfo?.age || 0,
          height_cm: profile.height_cm || basicInfo?.height || 0,
          weight_kg: profile.weight_kg || basicInfo?.weight || 0,
          fitness_level: profile.fitness_level || DEFAULT_PROFILE.fitness_level!,
          fitness_goals: profile.fitness_goals || DEFAULT_PROFILE.fitness_goals!,
          health_conditions: profile.health_conditions || DEFAULT_PROFILE.health_conditions!,
          dietary_restrictions: profile.dietary_restrictions || DEFAULT_PROFILE.dietary_restrictions!,
          preferred_workout_days: profile.preferred_workout_days || DEFAULT_PROFILE.preferred_workout_days!,
          preferred_workout_time: profile.preferred_workout_time || DEFAULT_PROFILE.preferred_workout_time!,
          ...(hydrationData || weeklyAvg ? {
            hydration: {
              ...(hydrationData ? {
                today: {
                  water_ml: Math.max(0, hydrationData.water_ml), // Ensure non-negative
                  hydration_percent: Number(hydrationData.hydration_percent),
                  temperature_c: hydrationData.temperature_c
                }
              } : {}),
              ...(weeklyAvg ? {
                weeklyAverage: {
                  water_ml: weeklyAvg.water_ml,
                  hydration_percent: weeklyAvg.hydration_percent
                }
              } : {})
            }
          } : {})
        }

        setUserData(userData)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchUserData()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const userContext = userData ? {
        bmi: userData.weight_kg > 0 && userData.height_cm > 0 
          ? (userData.weight_kg / Math.pow(userData.height_cm / 100, 2)).toFixed(1)
          : null,
        ...userData
      } : null

      const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: `<s>[INST] You are a professional fitness trainer and nutritionist. Keep responses concise and practical. Use the following user context if available to personalize advice: ${JSON.stringify(userContext)}

Question: ${input} [/INST]</s>`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.2,
            truncate: 1000,
            return_full_text: false
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const result = await response.json()
      // Clean up the response by removing any system prompts or instruction tags
      const cleanedResponse = result[0].generated_text
        .replace(/\[INST\].*?\[\/INST\]/gs, '')
        .replace(/<s>|<\/s>/g, '')
        .trim()
      
      const assistantMessage: Message = { 
        role: "assistant", 
        content: cleanedResponse
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-3 p-4 rounded-lg",
                message.role === "assistant"
                  ? "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20"
                  : "bg-accent/50"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
                message.role === "assistant" 
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" 
                  : "bg-accent-foreground"
              )}>
                {message.role === "assistant" ? (
                  <Bot className="h-5 w-5 text-white" />
                ) : (
                  <User className="h-5 w-5 text-background" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="prose prose-neutral dark:prose-invert">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 p-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                <Bot className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="prose prose-neutral dark:prose-invert">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about fitness, nutrition, or your health goals..."
            className="flex-1 bg-background/50 backdrop-blur-sm border-violet-500/20"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-shadow"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
} 