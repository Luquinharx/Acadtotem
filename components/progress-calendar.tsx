"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, CheckCircle, TrendingUp, BarChart3 } from "lucide-react"
import { firebaseStorage } from "@/lib/firebase-storage"
import type { StoredUser, WorkoutHistory } from "@/lib/user-storage"

interface ProgressCalendarProps {
  user: StoredUser
  onBack: () => void
  onLogout: () => void
}

export function ProgressCalendar({ user, onBack, onLogout }: ProgressCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [workoutDays, setWorkoutDays] = useState<Set<string>>(new Set())
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setIsLoading(true)

        const history = await firebaseStorage.getWorkoutHistory(user.cpf)
        setWorkoutHistory(history)

        const stats = await firebaseStorage.getUserStats(user.cpf)
        setUserStats(stats)

        const days = new Set(history.map((workout) => new Date(workout.completedAt).toDateString()))
        setWorkoutDays(days)
      } catch (error) {
        console.error("Error loading progress data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgressData()
  }, [user.cpf])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const isWorkoutDay = (date: Date | null) => {
    if (!date) return false
    return workoutDays.has(date.toDateString())
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    return date.toDateString() === new Date().toDateString()
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  // Enhanced stats cards with orange highlights
  const totalWorkouts = userStats ? userStats.totalWorkouts : 0
  const thisMonthWorkouts = workoutHistory.filter((workout) => {
    const workoutDate = new Date(workout.completedAt)
    return (
      workoutDate.getMonth() === currentMonth.getMonth() && workoutDate.getFullYear() === currentMonth.getFullYear()
    )
  }).length

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
                Meu Progresso
              </h1>
              <p className="text-muted-foreground">Acompanhe sua jornada fitness</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-orange" />
                  Total de Treinos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange">{userStats.totalWorkouts}</p>
                <p className="text-sm text-muted-foreground">Treinos realizados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange" />
                  Calorias Queimadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange">{userStats.totalCalories}</p>
                <p className="text-sm text-muted-foreground">Total de calorias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tempo Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange">{userStats.totalMinutes}min</p>
                <p className="text-sm text-muted-foreground">Minutos treinando</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Média por Treino</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange">{userStats.averageWorkoutDuration}min</p>
                <p className="text-sm text-muted-foreground">Duração média</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-accent" />
                Calendário de Treinos - {monthName}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  ←
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  →
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm relative
                    ${date ? "hover:bg-accent/20 cursor-pointer" : ""}
                    ${isToday(date) ? "bg-primary text-primary-foreground font-bold" : ""}
                    ${isWorkoutDay(date) && !isToday(date) ? "bg-green-100 text-green-800 font-medium" : ""}
                    ${!date ? "invisible" : ""}
                  `}
                >
                  {date && (
                    <>
                      <span>{date.getDate()}</span>
                      {isWorkoutDay(date) && <CheckCircle className="w-3 h-3 absolute top-1 right-1 text-green-600" />}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span>Hoje</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span>Treino realizado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
