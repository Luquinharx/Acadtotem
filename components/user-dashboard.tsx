"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Dumbbell, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { firebaseStorage } from "@/lib/firebase-storage"
import type { StoredUser, WorkoutHistory } from "@/lib/user-storage"
import { WorkoutDisplay } from "@/components/workout-display"
import { ProgressCalendar } from "@/components/progress-calendar"

interface UserDashboardProps {
  user: StoredUser
  onBack: () => void
  onLogout: () => void
}

export function UserDashboard({ user, onBack, onLogout }: UserDashboardProps) {
  const [currentView, setCurrentView] = useState<"dashboard" | "workout" | "progress">("dashboard")
  const [userStats, setUserStats] = useState<any>(null)
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([])
  const [hasWorkedOutToday, setHasWorkedOutToday] = useState(false)
  const [workoutIntensity, setWorkoutIntensity] = useState<"low" | "medium" | "high">("medium")
  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stats = await firebaseStorage.getUserStats(user.cpf)
        setUserStats(stats)

        const history = await firebaseStorage.getWorkoutHistory(user.cpf)
        setWorkoutHistory(history)

        const workedOutToday = await firebaseStorage.hasWorkedOutToday(user.cpf)
        setHasWorkedOutToday(workedOutToday)
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    loadUserData()
  }, [user.cpf])

  const handleWorkoutComplete = async (completedWorkout: any) => {
    // Refresh stats after workout completion
    try {
      const newStats = await firebaseStorage.getUserStats(user.cpf)
      setUserStats(newStats)

      const newHistory = await firebaseStorage.getWorkoutHistory(user.cpf)
      setWorkoutHistory(newHistory)

      const workedOutToday = await firebaseStorage.hasWorkedOutToday(user.cpf)
      setHasWorkedOutToday(workedOutToday)
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }

    setCurrentView("dashboard")
  }

  const handleIncreaseIntensity = () => {
    if (workoutIntensity === "low") setWorkoutIntensity("medium")
    else if (workoutIntensity === "medium") setWorkoutIntensity("high")
  }

  const handleDecreaseIntensity = () => {
    if (workoutIntensity === "high") setWorkoutIntensity("medium")
    else if (workoutIntensity === "medium") setWorkoutIntensity("low")
  }

  if (currentView === "workout") {
    return (
      <WorkoutDisplay
        user={user}
        intensity={workoutIntensity}
        onBack={() => setCurrentView("dashboard")}
        onStartWorkout={handleWorkoutComplete}
      />
    )
  }

  if (currentView === "progress") {
    return <ProgressCalendar user={user} workoutHistory={workoutHistory} onBack={() => setCurrentView("dashboard")} />
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
                Olá, {user.nome.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">{currentDate}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Sair
          </Button>
        </div>

        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total de Treinos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange">{userStats.totalWorkouts}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Calorias Queimadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange">{userStats.totalCalories}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sequência Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange">{userStats.currentStreak} dias</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("workout")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-orange" />
                Visualizar Treino
              </CardTitle>
              <CardDescription>Veja seu treino semanal personalizado e execute o treino de hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full bg-orange hover:bg-orange/90 text-orange-foreground">
                Ver Treino da Semana
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("progress")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange" />
                Meu Progresso
              </CardTitle>
              <CardDescription>Acompanhe seu calendário de treinos e evolução</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full bg-orange hover:bg-orange/90 text-orange-foreground">
                Ver Calendário
              </Button>
            </CardContent>
          </Card>
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
            <CardTitle className="flex items-center">
              <Dumbbell className="w-5 h-5 mr-2 text-orange" />
              {hasWorkedOutToday ? "Treino de Hoje - Concluído!" : "Seu Treino de Hoje"}
            </CardTitle>
            <CardDescription>
              {hasWorkedOutToday
                ? "Parabéns! Você já treinou hoje. Que tal dar uma olhada no seu progresso?"
                : "Treino personalizado gerado pela IA baseado no seu perfil"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setCurrentView("workout")}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-orange hover:bg-orange/90 text-orange-foreground"
              disabled={hasWorkedOutToday}
            >
              {hasWorkedOutToday ? "Treino Já Realizado Hoje" : "Treino de Hoje"}
            </Button>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        <Card className="bg-muted/50 border-0 rounded-2xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-lg text-muted-foreground font-medium">
              {hasWorkedOutToday
                ? "Excelente trabalho hoje! Continue assim e alcance seus objetivos."
                : "Está na hora de treinar! Seu corpo e mente agradecem."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
