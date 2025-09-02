export interface Exercise {
  id: string
  name: string
  description: string
  sets: number
  reps: string
  weight?: string
  duration?: string
  restTime: string
  muscleGroups: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  equipment: string[]
  gifUrl?: string
}

export interface WorkoutPlan {
  id: string
  userId: string
  date: string
  name: string
  duration: string
  exercises: Exercise[]
  totalSets: number
  estimatedCalories: number
  difficulty: "beginner" | "intermediate" | "advanced"
  workoutType: string[]
}

export interface UserProfile {
  nome: string
  cpf: string
  idade: string
  peso: string
  altura: string
  frequenciaAtividade: string
  praticaAtividade: string
  frequenciaSemanal?: string
  intensidadeTreino?: string
  frequenciaDesejada?: string
  intensidadeDesejada?: string
  tipoTreino: string[]
}

// Exercise database
const EXERCISE_DATABASE: Exercise[] = [
  // Cardio exercises
  {
    id: "cardio-1",
    name: "Esteira - Caminhada",
    description: "Caminhada em ritmo moderado na esteira. Mantenha postura ereta e respiração controlada.",
    sets: 1,
    reps: "",
    duration: "15-20 min",
    restTime: "2 min",
    muscleGroups: ["cardio"],
    difficulty: "beginner",
    equipment: ["esteira"],
    gifUrl: "/person-on-treadmill.png",
  },
  {
    id: "cardio-2",
    name: "Bicicleta Ergométrica",
    description: "Pedalada em ritmo constante. Ajuste a resistência conforme seu condicionamento.",
    sets: 1,
    reps: "",
    duration: "20-25 min",
    restTime: "2 min",
    muscleGroups: ["cardio", "pernas"],
    difficulty: "beginner",
    equipment: ["bicicleta"],
    gifUrl: "/person-on-exercise-bike.png",
  },
  {
    id: "cardio-3",
    name: "Elíptico",
    description: "Movimento coordenado de braços e pernas. Mantenha ritmo constante.",
    sets: 1,
    reps: "",
    duration: "15-20 min",
    restTime: "2 min",
    muscleGroups: ["cardio", "corpo todo"],
    difficulty: "intermediate",
    equipment: ["elíptico"],
    gifUrl: "/person-on-elliptical.png",
  },

  // Musculação - Peito
  {
    id: "chest-1",
    name: "Supino Reto",
    description:
      "Deite no banco, segure a barra com pegada média. Desça controladamente até o peito e empurre para cima.",
    sets: 3,
    reps: "8-12",
    weight: "Ajustar conforme capacidade",
    restTime: "60-90s",
    muscleGroups: ["peito", "tríceps", "ombros"],
    difficulty: "intermediate",
    equipment: ["banco", "barra", "anilhas"],
    gifUrl: "/bench-press-demonstration.png",
  },
  {
    id: "chest-2",
    name: "Flexão de Braço",
    description: "Posição de prancha, desça o corpo até quase tocar o chão e empurre para cima.",
    sets: 3,
    reps: "8-15",
    restTime: "45-60s",
    muscleGroups: ["peito", "tríceps", "core"],
    difficulty: "beginner",
    equipment: [],
    gifUrl: "/push-up-demonstration.png",
  },

  // Musculação - Costas
  {
    id: "back-1",
    name: "Puxada Frontal",
    description: "Sente-se no equipamento, puxe a barra até a altura do peito mantendo as costas retas.",
    sets: 3,
    reps: "8-12",
    weight: "Ajustar conforme capacidade",
    restTime: "60-90s",
    muscleGroups: ["costas", "bíceps"],
    difficulty: "beginner",
    equipment: ["polia alta"],
    gifUrl: "/lat-pulldown-demonstration.png",
  },
  {
    id: "back-2",
    name: "Remada Curvada",
    description: "Incline o tronco, puxe a barra em direção ao abdômen mantendo cotovelos próximos ao corpo.",
    sets: 3,
    reps: "8-12",
    weight: "Ajustar conforme capacidade",
    restTime: "60-90s",
    muscleGroups: ["costas", "bíceps"],
    difficulty: "intermediate",
    equipment: ["barra", "anilhas"],
    gifUrl: "/bent-over-row-demo.png",
  },

  // Musculação - Pernas
  {
    id: "legs-1",
    name: "Agachamento",
    description:
      "Pés na largura dos ombros, desça como se fosse sentar em uma cadeira, mantenha o peso nos calcanhares.",
    sets: 3,
    reps: "10-15",
    weight: "Peso corporal ou com barra",
    restTime: "60-90s",
    muscleGroups: ["quadríceps", "glúteos", "core"],
    difficulty: "beginner",
    equipment: [],
    gifUrl: "/squat-demonstration.png",
  },
  {
    id: "legs-2",
    name: "Leg Press",
    description: "Sente-se no equipamento, empurre a plataforma com os pés na largura dos ombros.",
    sets: 3,
    reps: "10-15",
    weight: "Ajustar conforme capacidade",
    restTime: "60-90s",
    muscleGroups: ["quadríceps", "glúteos"],
    difficulty: "beginner",
    equipment: ["leg press"],
    gifUrl: "/leg-press-demonstration.png",
  },

  // HIIT
  {
    id: "hiit-1",
    name: "Burpees",
    description: "Agachamento, prancha, flexão, pulo. Movimento explosivo e contínuo.",
    sets: 4,
    reps: "30s trabalho / 30s descanso",
    restTime: "30s",
    muscleGroups: ["corpo todo"],
    difficulty: "advanced",
    equipment: [],
    gifUrl: "/burpee-demonstration.png",
  },
  {
    id: "hiit-2",
    name: "Mountain Climbers",
    description: "Posição de prancha, alterne rapidamente os joelhos em direção ao peito.",
    sets: 4,
    reps: "30s trabalho / 30s descanso",
    restTime: "30s",
    muscleGroups: ["core", "cardio"],
    difficulty: "intermediate",
    equipment: [],
    gifUrl: "/placeholder-42kx7.png",
  },

  // Funcional
  {
    id: "functional-1",
    name: "Prancha",
    description: "Mantenha o corpo reto apoiado nos antebraços e pés. Contraia o abdômen.",
    sets: 3,
    reps: "30-60s",
    restTime: "45s",
    muscleGroups: ["core", "ombros"],
    difficulty: "beginner",
    equipment: [],
    gifUrl: "/plank-exercise.png",
  },
  {
    id: "functional-2",
    name: "Afundo",
    description: "Passo à frente, desça o joelho traseiro quase até o chão, volte à posição inicial.",
    sets: 3,
    reps: "10-12 cada perna",
    restTime: "45s",
    muscleGroups: ["quadríceps", "glúteos"],
    difficulty: "beginner",
    equipment: [],
    gifUrl: "/lunge-demonstration.png",
  },
]

export class WorkoutGenerator {
  private getUserDifficulty(profile: UserProfile): "beginner" | "intermediate" | "advanced" {
    const { frequenciaAtividade, praticaAtividade, intensidadeTreino, intensidadeDesejada } = profile

    if (praticaAtividade === "nao" || frequenciaAtividade === "sedentario") {
      return "beginner"
    }

    if (praticaAtividade === "sim") {
      if (intensidadeTreino === "intenso" && frequenciaAtividade === "intenso") {
        return "advanced"
      }
      if (intensidadeTreino === "moderado" || frequenciaAtividade === "moderado") {
        return "intermediate"
      }
    }

    if (intensidadeDesejada === "intenso") {
      return "intermediate" // Start intermediate for ambitious beginners
    }

    return "beginner"
  }

  private getWorkoutFrequency(profile: UserProfile): number {
    if (profile.praticaAtividade === "sim" && profile.frequenciaSemanal) {
      return Number.parseInt(profile.frequenciaSemanal)
    }
    if (profile.frequenciaDesejada) {
      return Number.parseInt(profile.frequenciaDesejada)
    }
    return 3 // Default
  }

  private filterExercisesByType(workoutTypes: string[]): Exercise[] {
    return EXERCISE_DATABASE.filter((exercise) => {
      return workoutTypes.some((type) => {
        switch (type) {
          case "cardio":
            return exercise.muscleGroups.includes("cardio")
          case "musculacao":
            return exercise.muscleGroups.some((mg) =>
              ["peito", "costas", "quadríceps", "glúteos", "bíceps", "tríceps", "ombros"].includes(mg),
            )
          case "hiit":
            return exercise.id.startsWith("hiit-")
          case "funcional":
            return exercise.id.startsWith("functional-")
          case "yoga":
            return exercise.muscleGroups.includes("flexibilidade")
          case "crossfit":
            return exercise.difficulty === "advanced" || exercise.muscleGroups.includes("corpo todo")
          default:
            return true
        }
      })
    })
  }

  private calculateEstimatedCalories(exercises: Exercise[], userWeight: number): number {
    // Simple calorie estimation based on exercise type and duration
    let totalCalories = 0

    exercises.forEach((exercise) => {
      if (exercise.duration) {
        const minutes = Number.parseInt(exercise.duration.split("-")[0]) || 15
        if (exercise.muscleGroups.includes("cardio")) {
          totalCalories += minutes * 8 // ~8 cal/min for cardio
        } else {
          totalCalories += minutes * 5 // ~5 cal/min for strength
        }
      } else {
        // Strength exercises
        totalCalories += exercise.sets * 15 // ~15 cal per set
      }
    })

    // Adjust for user weight (heavier users burn more calories)
    const weightFactor = userWeight / 70 // 70kg as baseline
    return Math.round(totalCalories * weightFactor)
  }

  generateWorkout(profile: UserProfile): WorkoutPlan {
    const difficulty = this.getUserDifficulty(profile)
    const availableExercises = this.filterExercisesByType(profile.tipoTreino)

    // Filter by difficulty
    const suitableExercises = availableExercises.filter((exercise) => {
      if (difficulty === "beginner") {
        return exercise.difficulty === "beginner" || exercise.difficulty === "intermediate"
      }
      if (difficulty === "intermediate") {
        return (
          exercise.difficulty === "beginner" ||
          exercise.difficulty === "intermediate" ||
          exercise.difficulty === "advanced"
        )
      }
      return true // Advanced users can do all exercises
    })

    // Select 4-6 exercises for a balanced workout
    const selectedExercises: Exercise[] = []
    const exerciseCount = difficulty === "beginner" ? 4 : difficulty === "intermediate" ? 5 : 6

    // Ensure variety in muscle groups
    const usedMuscleGroups: string[] = []
    const shuffledExercises = [...suitableExercises].sort(() => Math.random() - 0.5)

    for (const exercise of shuffledExercises) {
      if (selectedExercises.length >= exerciseCount) break

      // Check if this exercise targets new muscle groups or if we need more exercises
      const hasNewMuscleGroup = exercise.muscleGroups.some((mg) => !usedMuscleGroups.includes(mg))

      if (hasNewMuscleGroup || selectedExercises.length < 3) {
        selectedExercises.push(exercise)
        usedMuscleGroups.push(...exercise.muscleGroups)
      }
    }

    // If we don't have enough exercises, add more regardless of muscle group overlap
    while (selectedExercises.length < exerciseCount && selectedExercises.length < suitableExercises.length) {
      const remaining = suitableExercises.filter((ex) => !selectedExercises.includes(ex))
      if (remaining.length > 0) {
        selectedExercises.push(remaining[0])
      } else {
        break
      }
    }

    const totalSets = selectedExercises.reduce((sum, ex) => sum + ex.sets, 0)
    const userWeight = Number.parseFloat(profile.peso) || 70
    const estimatedCalories = this.calculateEstimatedCalories(selectedExercises, userWeight)

    // Calculate estimated duration
    const estimatedMinutes = selectedExercises.reduce((total, exercise) => {
      if (exercise.duration) {
        const minutes = Number.parseInt(exercise.duration.split("-")[0]) || 15
        return total + minutes
      } else {
        // Estimate 2 minutes per set (including rest)
        return total + exercise.sets * 2
      }
    }, 0)

    const workoutPlan: WorkoutPlan = {
      id: `workout-${Date.now()}`,
      userId: profile.cpf,
      date: new Date().toISOString().split("T")[0],
      name: `Treino ${profile.tipoTreino.join(" + ")}`,
      duration: `${estimatedMinutes} min`,
      exercises: selectedExercises,
      totalSets,
      estimatedCalories,
      difficulty,
      workoutType: profile.tipoTreino,
    }

    return workoutPlan
  }

  generateWeeklyPlan(profile: UserProfile): WorkoutPlan[] {
    const frequency = this.getWorkoutFrequency(profile)
    const plans: WorkoutPlan[] = []

    for (let day = 0; day < frequency; day++) {
      const date = new Date()
      date.setDate(date.getDate() + day)

      const dayProfile = { ...profile }
      // Vary workout types throughout the week
      if (profile.tipoTreino.length > 1) {
        const typeIndex = day % profile.tipoTreino.length
        dayProfile.tipoTreino = [profile.tipoTreino[typeIndex]]
      }

      const workout = this.generateWorkout(dayProfile)
      workout.date = date.toISOString().split("T")[0]
      workout.name = `Treino Dia ${day + 1} - ${dayProfile.tipoTreino.join(" + ")}`

      plans.push(workout)
    }

    return plans
  }
}

export const workoutGenerator = new WorkoutGenerator()
