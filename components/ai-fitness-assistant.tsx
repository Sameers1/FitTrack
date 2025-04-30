import { useState, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  const [messages, setMessages] = useState<Message[]>([])
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
          : "not available",
        profile: `
${userData.age > 0 ? `- Age: ${userData.age} years` : ""}
${userData.height_cm > 0 ? `- Height: ${userData.height_cm}cm` : ""}
${userData.weight_kg > 0 ? `- Weight: ${userData.weight_kg}kg` : ""}
${userData.weight_kg > 0 && userData.height_cm > 0 ? `- BMI: ${(userData.weight_kg / Math.pow(userData.height_cm / 100, 2)).toFixed(1)}` : ""}
- Fitness Level: ${userData.fitness_level}
- Fitness Goals: ${userData.fitness_goals.join(", ")}
${userData.health_conditions?.length ? `- Health Conditions: ${userData.health_conditions.join(", ")}` : ""}
${userData.dietary_restrictions?.length ? `- Dietary Restrictions: ${userData.dietary_restrictions.join(", ")}` : ""}
- Preferred Workout Days: ${userData.preferred_workout_days.join(", ")}
- Preferred Workout Time: ${userData.preferred_workout_time}
${userData.hydration?.today ? `
Hydration Today:
- Water Intake: ${userData.hydration.today.water_ml}ml
- Hydration Level: ${userData.hydration.today.hydration_percent}%
- Temperature: ${userData.hydration.today.temperature_c}°C` : ""}
${userData.hydration?.weeklyAverage ? `
Weekly Hydration Average:
- Water Intake: ${userData.hydration.weeklyAverage.water_ml}ml
- Hydration Level: ${userData.hydration.weeklyAverage.hydration_percent}%` : ""}`
      } : {
        bmi: "not available",
        profile: "No user data available. Providing general advice."
      }

      const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: `<|system|>You are a professional fitness trainer who provides concise, practical advice. Always consider the user's profile when giving advice:
${userContext.profile}

Keep responses under 3 sentences and reference relevant user data when appropriate. If data is missing or shows 0 values, provide general advice while encouraging the user to complete their profile. For hydration advice, consider temperature and current hydration levels when making recommendations.</s>
<|user|>${input}</s>
<|assistant|>`,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.5,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Model not found or unavailable. Please try again later.")
        }
        throw new Error(`API request failed with status: ${response.status}`)
      }

      const data = await response.json()
      
      let aiResponseText = ""
      if (Array.isArray(data) && data[0]?.generated_text) {
        aiResponseText = data[0].generated_text
      } else if (typeof data === 'object' && data.generated_text) {
        aiResponseText = data.generated_text
      } else if (typeof data === 'string') {
        aiResponseText = data
      } else {
        console.error("Unexpected response format:", data)
        throw new Error('Unexpected response format from the API')
      }

      // Clean up the response
      aiResponseText = aiResponseText
        .replace(/<\|assistant\|>/g, '')
        .replace(/<\|user\|>/g, '')
        .replace(/<\|system\|>/g, '')
        .replace(/<\/s>/g, '')
        .trim()

      const aiResponse: Message = { 
        role: "assistant", 
        content: aiResponseText
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error("Error calling AI API:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error 
          ? `Sorry, there was an error: ${error.message}. Please try again in a moment.`
          : "Sorry, an unexpected error occurred. Please try again in a moment."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI Fitness Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4 mb-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Ask me anything about fitness, workouts, or health!</p>
                <div className="mt-2 text-sm">
                  Try questions like:
                  <ul className="mt-1 space-y-1">
                    <li>"What's the best workout for my fitness level?"</li>
                    <li>"How many calories should I eat to reach my goals?"</li>
                    <li>"What exercises are safe for my age and fitness level?"</li>
                  </ul>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {message.role === "assistant" ? (
                      <Bot className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground ml-auto"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a fitness question..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 