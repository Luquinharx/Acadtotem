"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, SkipForward, CheckCircle, Clock } from "lucide-react"
import type { WorkoutPlan } from "@/lib/workout-generator"

interface WorkoutExecutionProps {
  workout: WorkoutPlan
  onBack: () => void
  onComplete: (completedWorkout: CompletedWorkout) => void
}

interface CompletedWorkout {
  workoutId: string
  userId: string
  completedAt: string
  duration: number
  exercisesCompleted: number
  totalExercises: number
  exerciseResults: ExerciseResult[]
}

interface ExerciseResult {
  exerciseId: string
  setsCompleted: number
  totalSets: number
  weight?: number
  notes?: string
}

export function WorkoutExecution({ workout, onBack, onComplete }: WorkoutExecutionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isResting, setIsResting] = useState(false)
  const [restTimeLeft, setRestTimeLeft] = useState(0)
  const [workoutStartTime] = useState(Date.now())
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([])
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)

  const currentExercise = workout.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + currentSet / currentExercise.sets) / workout.exercises.length) * 100

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isResting, restTimeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const parseRestTime = (restTime: string): number => {
    const match = restTime.match(/(\d+)/)
    return match ? Number.parseInt(match[1]) : 60
  }

  const handleSetComplete = () => {
    if (currentSet < currentExercise.sets) {
      // Start rest period
      const restSeconds = parseRestTime(currentExercise.restTime)
      setRestTimeLeft(restSeconds)
      setIsResting(true)
      setCurrentSet(currentSet + 1)
    } else {
      // Exercise complete, move to next
      handleExerciseComplete()
    }
  }

  const handleExerciseComplete = () => {
    // Record exercise result
    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      setsCompleted: currentExercise.sets,
      totalSets: currentExercise.sets,
    }

    setExerciseResults((prev) => [...prev, result])

    if (currentExerciseIndex < workout.exercises.length - 1) {
      // Move to next exercise
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setIsResting(false)
      setRestTimeLeft(0)
    } else {
      // Workout complete
      handleWorkoutComplete()
    }
  }

  const handleWorkoutComplete = () => {
    const completedWorkout: CompletedWorkout = {
      workoutId: workout.id,
      userId: workout.userId,
      completedAt: new Date().toISOString(),
      duration: Math.round((Date.now() - workoutStartTime) / 1000 / 60), // minutes
      exercisesCompleted: workout.exercises.length,
      totalExercises: workout.exercises.length,
      exerciseResults: exerciseResults,
    }

    setIsWorkoutComplete(true)
    onComplete(completedWorkout)
  }

  const handleSkipRest = () => {
    setIsResting(false)
    setRestTimeLeft(0)
  }

  const handleSkipExercise = () => {
    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      setsCompleted: currentSet - 1,
      totalSets: currentExercise.sets,
    }

    setExerciseResults((prev) => [...prev, result])

    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setIsResting(false)
      setRestTimeLeft(0)
    } else {
      handleWorkoutComplete()
    }
  }

  if (isWorkoutComplete) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-accent-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
                Parabéns!
              </CardTitle>
              <p className="text-muted-foreground text-lg">Treino concluído com sucesso!</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{workout.exercises.length}</div>
                  <div className="text-sm text-muted-foreground">Exercícios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round((Date.now() - workoutStartTime) / 1000 / 60)}
                  </div>
                  <div className="text-sm text-muted-foreground">Minutos</div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-lg font-medium text-foreground">
                  Você queimou aproximadamente {workout.estimatedCalories} calorias!
                </p>
                <p className="text-muted-foreground">Continue assim e você alcançará seus objetivos em pouco tempo.</p>
              </div>

              <Button onClick={onBack} size="lg" className="w-full">
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
              <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
                Executando Treino
              </h1>
              <p className="text-muted-foreground">
                Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {Math.round(progress)}% Concluído
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
        </div>

        {/* Rest Timer */}
        {isResting && (
          <Card className="mb-8 bg-accent/10 border-accent">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">Descansando</h2>
                <div className="text-6xl font-bold text-accent mb-4">{formatTime(restTimeLeft)}</div>
                <p className="text-muted-foreground mb-6">Prepare-se para a próxima série</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleSkipRest} variant="outline" size="lg">
                    Pular Descanso
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Exercise */}
        {!isResting && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exercise Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mr-3">
                    {currentExerciseIndex + 1}
                  </div>
                  {currentExercise.name}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {currentExercise.muscleGroups.map((muscle) => (
                    <Badge key={muscle} variant="outline">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Set Info */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      Série {currentSet} de {currentExercise.sets}
                    </div>
                    {currentExercise.reps && (
                      <div className="text-lg text-muted-foreground">{currentExercise.reps} repetições</div>
                    )}
                    {currentExercise.duration && (
                      <div className="text-lg text-muted-foreground">Duração: {currentExercise.duration}</div>
                    )}
                    {currentExercise.weight && (
                      <div className="text-lg text-muted-foreground">Carga: {currentExercise.weight}</div>
                    )}
                  </div>
                </div>

                {/* Exercise Description */}
                <div>
                  <h3 className="font-semibold mb-2">Como executar:</h3>
                  <p className="text-muted-foreground leading-relaxed">{currentExercise.description}</p>
                </div>

                {/* Equipment */}
                {currentExercise.equipment.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Equipamentos:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.equipment.map((equipment) => (
                        <Badge key={equipment} variant="secondary">
                          {equipment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSetComplete} size="lg" className="flex-1">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Série Concluída
                  </Button>
                  <Button onClick={handleSkipExercise} variant="outline" size="lg">
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Demonstration */}
            <Card>
              <CardHeader>
                <CardTitle>Demonstração</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-6 text-center">
                  <img
                    src={currentExercise.gifUrl || "/placeholder.svg"}
                    alt={`Demonstração do exercício ${currentExercise.name}`}
                    className="mx-auto rounded-lg max-w-full h-auto"
                    style={{ maxHeight: "400px" }}
                  />
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-accent mb-2">Dica:</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantenha a respiração controlada e execute o movimento de forma lenta e controlada. A qualidade é
                    mais importante que a velocidade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exercise List Progress */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Progresso dos Exercícios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index < currentExerciseIndex
                      ? "bg-accent/10 border border-accent/20"
                      : index === currentExerciseIndex
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        index < currentExerciseIndex
                          ? "bg-accent text-accent-foreground"
                          : index === currentExerciseIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentExerciseIndex ? "✓" : index + 1}
                    </div>
                    <span
                      className={`font-medium ${
                        index === currentExerciseIndex ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {exercise.name}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {index < currentExerciseIndex
                      ? "Concluído"
                      : index === currentExerciseIndex
                        ? `Série ${currentSet}/${exercise.sets}`
                        : `${exercise.sets} séries`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
