"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Dumbbell, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Sample workout data
const workoutHistory = [
  {
    id: 1,
    name: "Upper Body Strength",
    date: new Date(2023, 3, 15),
    duration: 45,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 10, weight: 70 },
      { name: "Pull-ups", sets: 3, reps: 8, weight: 0 },
      { name: "Shoulder Press", sets: 3, reps: 12, weight: 20 },
    ],
    calories: 320,
  },
  {
    id: 2,
    name: "Leg Day",
    date: new Date(2023, 3, 17),
    duration: 60,
    exercises: [
      { name: "Squats", sets: 4, reps: 12, weight: 80 },
      { name: "Leg Press", sets: 3, reps: 15, weight: 120 },
      { name: "Lunges", sets: 3, reps: 10, weight: 15 },
    ],
    calories: 450,
  },
  {
    id: 3,
    name: "Cardio Session",
    date: new Date(2023, 3, 19),
    duration: 30,
    exercises: [
      { name: "Treadmill", sets: 1, reps: 1, weight: 0, duration: 20, distance: 3.5 },
      { name: "Jump Rope", sets: 3, reps: 1, weight: 0, duration: 3 },
    ],
    calories: 280,
  },
]

// Exercise library
const exerciseLibrary = [
  { id: 1, name: "Bench Press", category: "Chest", equipment: "Barbell" },
  { id: 2, name: "Squats", category: "Legs", equipment: "Barbell" },
  { id: 3, name: "Pull-ups", category: "Back", equipment: "Bodyweight" },
  { id: 4, name: "Shoulder Press", category: "Shoulders", equipment: "Dumbbell" },
  { id: 5, name: "Deadlift", category: "Back", equipment: "Barbell" },
  { id: 6, name: "Leg Press", category: "Legs", equipment: "Machine" },
  { id: 7, name: "Bicep Curls", category: "Arms", equipment: "Dumbbell" },
  { id: 8, name: "Tricep Extensions", category: "Arms", equipment: "Cable" },
  { id: 9, name: "Lunges", category: "Legs", equipment: "Bodyweight" },
  { id: 10, name: "Lat Pulldown", category: "Back", equipment: "Cable" },
  { id: 11, name: "Treadmill", category: "Cardio", equipment: "Machine" },
  { id: 12, name: "Jump Rope", category: "Cardio", equipment: "Bodyweight" },
]

// Workout categories
const workoutCategories = ["Strength", "Cardio", "HIIT", "Flexibility", "Recovery"]

export function WorkoutTracker() {
  const [activeTab, setActiveTab] = useState("history")
  const [searchTerm, setSearchTerm] = useState("")
  const [newWorkoutOpen, setNewWorkoutOpen] = useState(false)
  const [selectedExercises, setSelectedExercises] = useState<any[]>([])
  const [workoutName, setWorkoutName] = useState("")
  const [workoutCategory, setWorkoutCategory] = useState("")

  // Filter exercises based on search term
  const filteredExercises = exerciseLibrary.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add exercise to workout
  const addExerciseToWorkout = (exercise: any) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        ...exercise,
        sets: 3,
        reps: 10,
        weight: 0,
      },
    ])
  }

  // Remove exercise from workout
  const removeExerciseFromWorkout = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter((ex) => ex.id !== exerciseId))
  }

  // Save new workout
  const saveWorkout = () => {
    // In a real app, this would save to a database
    console.log({
      name: workoutName,
      category: workoutCategory,
      exercises: selectedExercises,
      date: new Date(),
    })

    // Reset form
    setWorkoutName("")
    setWorkoutCategory("")
    setSelectedExercises([])
    setNewWorkoutOpen(false)

    // Show success message or redirect
    alert("Workout saved successfully!")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <Dialog open={newWorkoutOpen} onOpenChange={setNewWorkoutOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Workout</DialogTitle>
                <DialogDescription>
                  Add exercises to your workout routine. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4">
                    <Label htmlFor="workout-name">Workout Name</Label>
                    <Input
                      id="workout-name"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      placeholder="e.g., Upper Body Strength"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="workout-category">Category</Label>
                    <Select value={workoutCategory} onValueChange={setWorkoutCategory}>
                      <SelectTrigger id="workout-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {workoutCategories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label>Selected Exercises</Label>
                  {selectedExercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-2">No exercises selected yet.</p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {selectedExercises.map((exercise) => (
                        <div key={exercise.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {exercise.category} • {exercise.equipment}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={exercise.sets}
                                onChange={(e) => {
                                  const newExercises = [...selectedExercises]
                                  const index = newExercises.findIndex((ex) => ex.id === exercise.id)
                                  newExercises[index].sets = Number.parseInt(e.target.value)
                                  setSelectedExercises(newExercises)
                                }}
                                className="w-12 h-8 text-center"
                              />
                              <span className="text-xs">sets</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={exercise.reps}
                                onChange={(e) => {
                                  const newExercises = [...selectedExercises]
                                  const index = newExercises.findIndex((ex) => ex.id === exercise.id)
                                  newExercises[index].reps = Number.parseInt(e.target.value)
                                  setSelectedExercises(newExercises)
                                }}
                                className="w-12 h-8 text-center"
                              />
                              <span className="text-xs">reps</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={exercise.weight}
                                onChange={(e) => {
                                  const newExercises = [...selectedExercises]
                                  const index = newExercises.findIndex((ex) => ex.id === exercise.id)
                                  newExercises[index].weight = Number.parseInt(e.target.value)
                                  setSelectedExercises(newExercises)
                                }}
                                className="w-16 h-8 text-center"
                              />
                              <span className="text-xs">kg</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeExerciseFromWorkout(exercise.id)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Add Exercises</Label>
                    <div className="relative w-1/2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search exercises..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex justify-between items-center p-2 border rounded-md hover:bg-accent/50 cursor-pointer"
                        onClick={() => addExerciseToWorkout(exercise)}
                      >
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {exercise.category} • {exercise.equipment}
                          </p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setNewWorkoutOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveWorkout} disabled={!workoutName || selectedExercises.length === 0}>
                  Save Workout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="history" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutHistory.map((workout) => (
              <Card key={workout.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{workout.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(workout.date, "MMM d, yyyy")}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {workout.duration} min
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{exercise.name}</span>
                          {exercise.duration ? (
                            <span className="text-muted-foreground">{exercise.duration} min</span>
                          ) : (
                            <span className="text-muted-foreground">
                              {exercise.sets} × {exercise.reps} {exercise.weight > 0 ? `@ ${exercise.weight}kg` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-between">
                  <span className="text-sm text-muted-foreground">{workout.exercises.length} exercises</span>
                  <span className="text-sm font-medium">{workout.calories} calories</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Exercise Library</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <Badge variant="outline">{exercise.category}</Badge>
                  </div>
                  <CardDescription>{exercise.equipment}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 bg-accent/20 rounded-md">
                    <Dumbbell className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedExercises([
                        ...selectedExercises,
                        {
                          ...exercise,
                          sets: 3,
                          reps: 10,
                          weight: 0,
                        },
                      ])
                      setNewWorkoutOpen(true)
                    }}
                  >
                    Add to Workout
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workout Summary</CardTitle>
                <CardDescription>Your workout activity over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="8"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-primary stroke-current"
                            strokeWidth="8"
                            strokeLinecap="round"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                            strokeDasharray="264, 264"
                            strokeDashoffset="198"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold">25%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium">3 of 12 workouts</p>
                      <p className="text-sm text-muted-foreground">completed this month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workout Distribution</CardTitle>
                <CardDescription>Types of workouts you've completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Strength</span>
                      <span className="text-sm text-muted-foreground">2 workouts</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "66%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Cardio</span>
                      <span className="text-sm text-muted-foreground">1 workout</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "33%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">HIIT</span>
                      <span className="text-sm text-muted-foreground">0 workouts</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Flexibility</span>
                      <span className="text-sm text-muted-foreground">0 workouts</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Your workout volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-2 pt-10">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = Math.floor(Math.random() * 80) + 20
                    return (
                      <div key={i} className="relative flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-primary rounded-t-sm"
                          style={{ height: `${i < 3 ? height : 0}%` }}
                        ></div>
                        <span className="absolute -top-6 text-xs font-medium">
                          {i < 3 ? `${Math.floor(height * 10)}kg` : ""}
                        </span>
                        <span className="mt-2 text-xs text-muted-foreground">
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
