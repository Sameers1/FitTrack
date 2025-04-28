"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { User, MapPin, ThermometerSun, Weight, Ruler, Activity, Heart, Bell, Moon, Droplets } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().min(1, { message: "Age is required." }),
  gender: z.string({ required_error: "Please select a gender." }),
  location: z.string().optional(),
  height: z.string().min(1, { message: "Height is required." }),
  weight: z.string().min(1, { message: "Weight is required." }),
  bodyFat: z.string().optional(),
  activityLevel: z.string({ required_error: "Please select an activity level." }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      location: "",
      height: "",
      weight: "",
      bodyFat: "",
      activityLevel: "",
    },
  })

  useEffect(() => {
    // Load user profile from Supabase
    supabase.auth.getUser().then(async ({ data }: { data: any }) => {
      if (!data.user) {
        router.replace("/auth/login")
        return
      }
      const { data: userProfile } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", data.user.id)
        .single()
      if (userProfile) {
        form.reset({
          name: userProfile.name || "",
          age: userProfile.age?.toString() || "",
          gender: userProfile.gender || "",
          location: userProfile.location || "",
          height: userProfile.height?.toString() || "",
          weight: userProfile.weight?.toString() || "",
          bodyFat: userProfile.body_fat?.toString() || "",
          activityLevel: userProfile.activity_level || "",
        })
      }
      setLoading(false)
    })
  }, [form, router])

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true)
    const user = await supabase.auth.getUser()
    if (!user.data.user) {
      router.replace("/auth/login")
      return
    }
    const { error } = await supabase.from("users").upsert({
      auth_id: user.data.user.id,
      email: user.data.user.email,
      name: data.name,
      age: data.age ? parseInt(data.age) : null,
      gender: data.gender,
      location: data.location,
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
      body_fat: data.bodyFat ? parseFloat(data.bodyFat) : null,
      activity_level: data.activityLevel,
      updated_at: new Date().toISOString(),
    })
    setIsSaving(false)
    if (error) {
      toast({ title: "Error", description: error.message })
    } else {
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." })
    }
  }

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-xl">Loading profile...</div>
  }

  return (
    <div className="animate-in fade-in duration-500">
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Personal</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Health Metrics</span>
          </TabsTrigger>
        </TabsList>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Your age" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Your location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                  <CardDescription>Update your health metrics and activity level.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Height in cm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Weight in kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bodyFat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Fat (%)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Body fat %" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary</SelectItem>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="very_active">Very Active</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="mt-4">
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
