"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Play,
  Clock,
  Zap,
  Target,
  Loader2,
  Calendar,
  Dumbbell,
  Download,
  Share,
  TrendingUp,
  TrendingDown,
  Settings,
} from "lucide-react"
import { geminiWorkoutGenerator, type GeminiWorkoutPlan } from "@/lib/gemini-workout-generator"
import { firebaseStorage } from "@/lib/firebase-storage"
import type { StoredUser } from "@/lib/user-storage"
import { WorkoutExecution } from "@/components/workout-execution"

interface WorkoutDisplayProps {
  user: StoredUser
  onBack: () => void
  onLogout: () => void
}

export function WorkoutDisplay({ user, onBack, onLogout }: WorkoutDisplayProps) {
  const [weeklyWorkout, setWeeklyWorkout] = useState<any>(null)
  const [currentDayWorkout, setCurrentDayWorkout] = useState<GeminiWorkoutPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [workoutIntensity, setWorkoutIntensity] = useState<"low" | "medium" | "high">("medium")
  const [showIntensityDialog, setShowIntensityDialog] = useState(false)
  const [pendingIntensity, setPendingIntensity] = useState<"low" | "medium" | "high" | null>(null)
  const [intensityAction, setIntensityAction] = useState<"increase" | "decrease" | null>(null)
  const [workoutDistribution, setWorkoutDistribution] = useState<"sequential" | "alternating">("sequential")
  const [showDistributionDialog, setShowDistributionDialog] = useState(false)
  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

  const getUserWorkoutDays = () => {
    const frequency = user.frequenciaDesejada
      ? Number.parseInt(user.frequenciaDesejada)
      : user.frequenciaSemanal
        ? Number.parseInt(user.frequenciaSemanal)
        : 3

    console.log("[v0] User workout frequency:", frequency)
    console.log("[v0] Workout distribution:", workoutDistribution)

    const allDays = [
      { key: "segunda", label: "Segunda-feira" },
      { key: "terça", label: "Terça-feira" },
      { key: "quarta", label: "Quarta-feira" },
      { key: "quinta", label: "Quinta-feira" },
      { key: "sexta", label: "Sexta-feira" },
    ]

    if (workoutDistribution === "alternating") {
      // For alternating days, skip one day between workouts
      const alternatingDays = []
      let dayIndex = 0
      for (let i = 0; i < frequency && dayIndex < allDays.length; i++) {
        alternatingDays.push(allDays[dayIndex])
        dayIndex += 2 // Skip one day
      }
      return alternatingDays
    } else {
      // Sequential days (default)
      return allDays.slice(0, frequency)
    }
  }

  const getCurrentDay = () => {
    const days = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]
    return days[new Date().getDay()]
  }

  useEffect(() => {
    const loadOrGenerateWeeklyWorkout = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("[v0] Loading workout for user:", user.cpf)
        console.log("[v0] User workout frequency:", user.frequenciaDesejada || user.frequenciaSemanal)

        let weeklyPlan = await firebaseStorage.getWeeklyWorkout(user.cpf)

        if (!weeklyPlan) {
          console.log("[v0] No existing workout found, generating new weekly workout...")

          // Check if distribution preference exists
          const savedDistribution = localStorage.getItem(`workout-distribution-${user.cpf}`)
          if (!savedDistribution && !showDistributionDialog) {
            setShowDistributionDialog(true)
            setIsLoading(false)
            return
          }

          try {
            weeklyPlan = await geminiWorkoutGenerator.generateWeeklyWorkout(user, workoutIntensity, workoutDistribution)
            await firebaseStorage.saveWeeklyWorkout(user.cpf, weeklyPlan)
            console.log("[v0] Weekly workout generated and saved successfully")
          } catch (genError) {
            console.error("[v0] Error generating workout with Gemini:", genError)
            // Fallback to basic workout if Gemini fails
            weeklyPlan = generateFallbackWorkout(user)
            await firebaseStorage.saveWeeklyWorkout(user.cpf, weeklyPlan)
            console.log("[v0] Using fallback workout due to generation error")
          }
        } else {
          console.log("[v0] Using existing weekly workout")
        }

        setWeeklyWorkout(weeklyPlan)

        const today = getCurrentDay()
        const userWorkoutDays = getUserWorkoutDays()
        const todayHasWorkout = userWorkoutDays.some((day) => day.key === today)

        if (todayHasWorkout && weeklyPlan[today]) {
          setCurrentDayWorkout(weeklyPlan[today])
          setSelectedDay(today)
        } else {
          // If today doesn't have a workout, select the first available day
          const firstWorkoutDay = userWorkoutDays[0]
          if (weeklyPlan[firstWorkoutDay.key]) {
            setCurrentDayWorkout(weeklyPlan[firstWorkoutDay.key])
            setSelectedDay(firstWorkoutDay.key)
          }
        }
      } catch (err) {
        console.error("[v0] Error loading/generating weekly workout:", err)
        setError("Erro ao carregar treino semanal. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }

    loadOrGenerateWeeklyWorkout()
  }, [user, workoutIntensity, workoutDistribution])

  const generateFallbackWorkout = (user: StoredUser) => {
    const frequency = user.frequenciaDesejada
      ? Number.parseInt(user.frequenciaDesejada)
      : Number.parseInt(user.frequenciaSemanal || "3")
    const days = ["segunda", "terça", "quarta", "quinta", "sexta"].slice(0, frequency)

    const fallbackWorkout: any = {}

    days.forEach((day, index) => {
      fallbackWorkout[day] = {
        name: `Treino ${index + 1}`,
        focus: ["Corpo Todo"],
        difficulty: "Iniciante",
        duration: "30-40 min",
        estimatedCalories: 250,
        totalSets: 12,
        exercises: [
          {
            name: "Agachamento",
            sets: 3,
            reps: "12-15",
            restTime: 60,
            muscleGroups: ["Pernas"],
            description: "Exercício básico para fortalecimento das pernas",
            instructions: [
              "Mantenha os pés afastados na largura dos ombros",
              "Desça como se fosse sentar em uma cadeira",
            ],
            tips: ["Mantenha o peito ereto", "Não deixe os joelhos passarem da ponta dos pés"],
          },
          {
            name: "Flexão de Braço",
            sets: 3,
            reps: "8-12",
            restTime: 60,
            muscleGroups: ["Peito", "Braços"],
            description: "Exercício para fortalecimento do peito e braços",
            instructions: ["Mantenha o corpo alinhado", "Desça até o peito quase tocar o chão"],
            tips: ["Contraia o abdômen", "Mantenha a respiração controlada"],
          },
          {
            name: "Prancha",
            sets: 3,
            reps: "30-45s",
            restTime: 45,
            muscleGroups: ["Abdômen"],
            description: "Exercício isométrico para fortalecimento do core",
            instructions: ["Mantenha o corpo reto", "Apoie-se nos antebraços e pontas dos pés"],
            tips: ["Não deixe o quadril subir ou descer", "Respire normalmente"],
          },
        ],
      }
    })

    return fallbackWorkout
  }

  const handleWorkoutComplete = async (completedWorkout: any) => {
    console.log("Workout completed:", completedWorkout)
    setIsExecuting(false)

    try {
      await firebaseStorage.saveWorkoutHistory({
        workoutId: `workout_${Date.now()}`,
        userId: user.cpf,
        completedAt: new Date().toISOString(),
        duration: completedWorkout.duration || 45,
        exercisesCompleted: completedWorkout.exercisesCompleted || currentDayWorkout?.exercises.length || 0,
        totalExercises: currentDayWorkout?.exercises.length || 0,
        workoutName: currentDayWorkout?.name || "Treino Personalizado",
        estimatedCalories: currentDayWorkout?.estimatedCalories || 300,
      })
    } catch (error) {
      console.error("Error saving workout history:", error)
    }
  }

  const handleStartExecution = () => {
    setIsExecuting(true)
  }

  const handleIncreaseIntensity = () => {
    let newIntensity: "low" | "medium" | "high"
    if (workoutIntensity === "low") {
      newIntensity = "medium"
    } else if (workoutIntensity === "medium") {
      newIntensity = "high"
    } else {
      return // Already at highest intensity
    }

    setPendingIntensity(newIntensity)
    setIntensityAction("increase")
    setShowIntensityDialog(true)
  }

  const handleDecreaseIntensity = () => {
    let newIntensity: "low" | "medium" | "high"
    if (workoutIntensity === "high") {
      newIntensity = "medium"
    } else if (workoutIntensity === "medium") {
      newIntensity = "low"
    } else {
      return // Already at lowest intensity
    }

    setPendingIntensity(newIntensity)
    setIntensityAction("decrease")
    setShowIntensityDialog(true)
  }

  const confirmIntensityChange = async () => {
    if (!pendingIntensity) return

    setShowIntensityDialog(false)
    setIsLoading(true)

    try {
      // Clear existing workout to force regeneration
      await firebaseStorage.clearWeeklyWorkout(user.cpf)

      // Update intensity
      setWorkoutIntensity(pendingIntensity)

      // Generate new workout with updated intensity
      const newWeeklyPlan = await geminiWorkoutGenerator.generateWeeklyWorkout(
        user,
        pendingIntensity,
        workoutDistribution,
      )
      await firebaseStorage.saveWeeklyWorkout(user.cpf, newWeeklyPlan)

      setWeeklyWorkout(newWeeklyPlan)

      // Update current day workout if applicable
      const today = getCurrentDay()
      const userWorkoutDays = getUserWorkoutDays()
      const todayHasWorkout = userWorkoutDays.some((day) => day.key === today)

      if (todayHasWorkout && newWeeklyPlan[today]) {
        setCurrentDayWorkout(newWeeklyPlan[today])
        setSelectedDay(today)
      }

      console.log("[v0] Workout regenerated with new intensity:", pendingIntensity)
    } catch (error) {
      console.error("Error regenerating workout:", error)
      setError("Erro ao ajustar intensidade. Tente novamente.")
    } finally {
      setIsLoading(false)
      setPendingIntensity(null)
      setIntensityAction(null)
    }
  }

  const handleDistributionChange = (distribution: "sequential" | "alternating") => {
    setWorkoutDistribution(distribution)
    setShowDistributionDialog(false)

    // Regenerate workout with new distribution
    setIsLoading(true)
    setTimeout(async () => {
      try {
        await firebaseStorage.clearWeeklyWorkout(user.cpf)
        const newWeeklyPlan = await geminiWorkoutGenerator.generateWeeklyWorkout(user, workoutIntensity, distribution)
        await firebaseStorage.saveWeeklyWorkout(user.cpf, newWeeklyPlan)
        setWeeklyWorkout(newWeeklyPlan)
      } catch (error) {
        console.error("Error regenerating workout with new distribution:", error)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  const exportWorkoutAsPDF = () => {
    if (!currentDayWorkout) return

    const printContent = `
      <html>
        <head>
          <title>Treino - ${currentDayWorkout.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .exercise { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .exercise-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .exercise-details { margin-bottom: 10px; }
            .instructions { margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${currentDayWorkout.name}</h1>
            <p>Usuário: ${user.nome}</p>
            <p>Data: ${new Date().toLocaleDateString("pt-BR")}</p>
            <p>Duração: ${currentDayWorkout.duration} | Calorias: ${currentDayWorkout.estimatedCalories}</p>
          </div>
          ${currentDayWorkout.exercises
            .map(
              (exercise, index) => `
            <div class="exercise">
              <div class="exercise-title">${index + 1}. ${exercise.name}</div>
              <div class="exercise-details">
                <strong>Séries:</strong> ${exercise.sets} | 
                <strong>Repetições:</strong> ${exercise.reps} | 
                <strong>Descanso:</strong> ${exercise.restTime}s
              </div>
              <div class="instructions">
                <strong>Descrição:</strong> ${exercise.description}
              </div>
            </div>
          `,
            )
            .join("")}
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const exportWorkoutAsImage = async () => {
    if (!currentDayWorkout) return

    try {
      // Create a canvas element to generate the image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = 800
      canvas.height = 1000

      // Set background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.fillStyle = "#000000"
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"

      // Title
      ctx.fillText(currentDayWorkout.name, canvas.width / 2, 50)

      // User info
      ctx.font = "16px Arial"
      ctx.fillText(`Usuário: ${user.nome}`, canvas.width / 2, 80)
      ctx.fillText(`Data: ${new Date().toLocaleDateString("pt-BR")}`, canvas.width / 2, 100)

      // Workout details
      ctx.fillText(
        `Duração: ${currentDayWorkout.duration} | Calorias: ${currentDayWorkout.estimatedCalories}`,
        canvas.width / 2,
        130,
      )

      // Exercises
      let yPosition = 180
      ctx.textAlign = "left"

      currentDayWorkout.exercises.forEach((exercise, index) => {
        ctx.font = "bold 18px Arial"
        ctx.fillText(`${index + 1}. ${exercise.name}`, 50, yPosition)
        yPosition += 25

        ctx.font = "14px Arial"
        ctx.fillText(
          `Séries: ${exercise.sets} | Repetições: ${exercise.reps} | Descanso: ${exercise.restTime}s`,
          70,
          yPosition,
        )
        yPosition += 40
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `treino-${currentDayWorkout.name.replace(/\s+/g, "-").toLowerCase()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }, "image/png")
    } catch (error) {
      console.error("Error exporting workout as image:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">Gerando seu treino personalizado...</h2>
            <p className="text-muted-foreground">Estamos criando o treino perfeito para você com base no seu perfil.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !weeklyWorkout) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Erro ao gerar treino</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="lg" onClick={onBack}>
                Voltar
              </Button>
              <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isExecuting && currentDayWorkout) {
    return (
      <WorkoutExecution
        workout={currentDayWorkout}
        onBack={() => setIsExecuting(false)}
        onComplete={handleWorkoutComplete}
      />
    )
  }

  const weekDays = getUserWorkoutDays()
  const currentDay = getCurrentDay()
  const todayHasWorkout = weekDays.some((day) => day.key === currentDay)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "iniciante":
        return "bg-green-500"
      case "intermediário":
        return "bg-yellow-500"
      case "avançado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="lg" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
                Visualizar Treino
              </h1>
              <p className="text-muted-foreground">{currentDate}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDistributionDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleIncreaseIntensity}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-orange" />
                Aumentar Intensidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                className="w-full bg-orange hover:bg-orange/90 text-orange-foreground"
                disabled={workoutIntensity === "high"}
              >
                Nível: {workoutIntensity === "low" ? "Baixo" : workoutIntensity === "medium" ? "Médio" : "Alto"}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleDecreaseIntensity}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingDown className="w-5 h-5 mr-2 text-orange" />
                Reduzir Intensidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                className="w-full bg-orange hover:bg-orange/90 text-orange-foreground"
                disabled={workoutIntensity === "low"}
              >
                Ajustar para Baixo
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-accent" />
                Plano da Semana ({weekDays.length}x por semana)
              </CardTitle>
              <Badge className="bg-primary">
                Intensidade: {workoutIntensity === "low" ? "Baixa" : workoutIntensity === "medium" ? "Média" : "Alta"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 gap-4 ${weekDays.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-5"}`}>
              {weekDays.map(({ key, label }) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedDay === key ? "ring-2 ring-primary" : ""
                  } ${getCurrentDay() === key ? "bg-accent/10" : ""}`}
                  onClick={() => {
                    setSelectedDay(key)
                    setCurrentDayWorkout(weeklyWorkout?.[key] || null)
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="font-semibold text-sm mb-1">{label.split("-")[0]}</div>
                    <div className="text-xs text-muted-foreground">{weeklyWorkout?.[key]?.focus?.[0] || "Treino"}</div>
                    {getCurrentDay() === key && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Hoje
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {todayHasWorkout && weeklyWorkout?.[currentDay] && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-accent" />
                Treino de Hoje
              </CardTitle>
              <CardDescription>{weeklyWorkout?.[currentDay]?.name || "Treino personalizado para hoje"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setSelectedDay(currentDay)
                  setCurrentDayWorkout(weeklyWorkout?.[currentDay] || null)
                  setIsExecuting(true)
                }}
                size="lg"
                className="w-full h-14 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Treino de Hoje
              </Button>
            </CardContent>
          </Card>
        )}

        {!todayHasWorkout && (
          <Card className="mb-8 bg-accent/10">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Dia de Descanso</h2>
              <p className="text-muted-foreground">
                Hoje não há treino programado. Aproveite para descansar e se recuperar!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Selected Day Workout Details */}
        {currentDayWorkout && (
          <>
            {/* Workout Overview */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange" />
                    Resumo do Treino
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportWorkoutAsImage}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Foto
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportWorkoutAsPDF}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Share className="w-4 h-4" />
                      PDF
                    </Button>
                    <Badge className={getDifficultyColor(currentDayWorkout.difficulty)}>
                      {currentDayWorkout.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange">{currentDayWorkout.exercises.length}</div>
                    <div className="text-sm text-muted-foreground">Exercícios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange">{currentDayWorkout.totalSets}</div>
                    <div className="text-sm text-muted-foreground">Séries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange">{currentDayWorkout.duration}</div>
                    <div className="text-sm text-muted-foreground">Duração</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange">{currentDayWorkout.estimatedCalories}</div>
                    <div className="text-sm text-muted-foreground">Calorias</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {currentDayWorkout.focus.map((focus) => (
                    <Badge key={focus} variant="secondary">
                      {focus}
                    </Badge>
                  ))}
                </div>

                <Button
                  onClick={handleStartExecution}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-orange hover:bg-orange/90 text-orange-foreground"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Treino
                </Button>
              </CardContent>
            </Card>

            {/* Exercise List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-4">Exercícios</h2>
              {currentDayWorkout.exercises.map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} index={index + 1} />
              ))}
            </div>
          </>
        )}

        {/* Motivational Message */}
        <Card className="mt-8 bg-accent/10 border-accent">
          <CardContent className="pt-6">
            <div className="text-center">
              <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-lg font-medium text-foreground">Você está pronto para conquistar seus objetivos!</p>
              <p className="text-muted-foreground mt-1">Lembre-se: a consistência é a chave para o sucesso.</p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showIntensityDialog} onOpenChange={setShowIntensityDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{intensityAction === "increase" ? "Aumentar" : "Reduzir"} Intensidade do Treino</DialogTitle>
              <DialogDescription>
                Você está prestes a {intensityAction === "increase" ? "aumentar" : "reduzir"} a intensidade do seu
                treino para{" "}
                <strong>
                  {pendingIntensity === "low" ? "Baixa" : pendingIntensity === "medium" ? "Média" : "Alta"}
                </strong>
                . Isso irá gerar um novo plano de treino semanal com exercícios ajustados.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-accent/10 rounded-lg p-4">
                <h4 className="font-medium mb-2">O que mudará:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {intensityAction === "increase" ? (
                    <>
                      <li>• Mais séries e repetições</li>
                      <li>• Exercícios mais desafiadores</li>
                      <li>• Menor tempo de descanso</li>
                      <li>• Maior queima calórica</li>
                    </>
                  ) : (
                    <>
                      <li>• Menos séries e repetições</li>
                      <li>• Exercícios mais básicos</li>
                      <li>• Maior tempo de descanso</li>
                      <li>• Foco na recuperação</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowIntensityDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmIntensityChange} className="bg-orange hover:bg-orange/90">
                Confirmar e Gerar Novo Treino
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDistributionDialog} onOpenChange={setShowDistributionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Como você prefere distribuir seus treinos?</DialogTitle>
              <DialogDescription>
                Escolha como deseja organizar seus {getUserWorkoutDays().length} dias de treino na semana.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-orange"
                onClick={() => handleDistributionChange("sequential")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Dias Sequenciais</h3>
                    <Badge variant="secondary">Recomendado</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Treinos em dias consecutivos (Ex: Segunda, Terça, Quarta)
                  </p>
                  <div className="text-xs text-muted-foreground">
                    ✓ Melhor para criar rotina
                    <br />✓ Ideal para iniciantes
                    <br />✓ Facilita o planejamento
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-orange"
                onClick={() => handleDistributionChange("alternating")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Dias Alternados</h3>
                    <Badge variant="outline">Avançado</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Treinos com um dia de descanso entre eles (Ex: Segunda, Quarta, Sexta)
                  </p>
                  <div className="text-xs text-muted-foreground">
                    ✓ Melhor recuperação muscular
                    <br />✓ Ideal para treinos intensos
                    <br />✓ Reduz risco de lesões
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

interface ExerciseCardProps {
  exercise: any
  index: number
}

function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center text-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold mr-3">
                {index}
              </div>
              {exercise.name}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {exercise.muscleGroups.map((muscle: string) => (
                <Badge key={muscle} variant="outline" className="text-xs">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Target className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Séries:</span>
              <span className="ml-1">{exercise.sets}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="font-medium">Repetições:</span>
              <span className="ml-1">{exercise.reps}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="font-medium">Descanso:</span>
              <span className="ml-1">{exercise.restTime}s</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <span className="font-medium">Dificuldade:</span>
              <span className="ml-1">{exercise.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
        </div>

        {exercise.instructions && exercise.instructions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Instruções:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {exercise.instructions.map((instruction: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {exercise.tips && exercise.tips.length > 0 && (
          <div className="bg-accent/10 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2 text-accent">Dicas:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {exercise.tips.map((tip: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
