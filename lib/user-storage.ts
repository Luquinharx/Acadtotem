// Simple local storage simulation for user data
// In production, this would be replaced with Firebase integration

export interface StoredUser {
  cpf: string
  nome: string
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
  registeredAt: string
  lastLogin?: string
}

export interface WorkoutHistory {
  workoutId: string
  userId: string
  completedAt: string
  duration: number
  exercisesCompleted: number
  totalExercises: number
  workoutName: string
  estimatedCalories: number
}

class UserStorage {
  private readonly USERS_KEY = "gym_totem_users"
  private readonly WORKOUT_HISTORY_KEY = "gym_totem_workout_history"

  // User management
  saveUser(user: StoredUser): void {
    const users = this.getAllUsers()
    const existingIndex = users.findIndex((u) => u.cpf === user.cpf)

    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  getUserByCPF(cpf: string): StoredUser | null {
    const users = this.getAllUsers()
    return users.find((user) => user.cpf === cpf) || null
  }

  getAllUsers(): StoredUser[] {
    try {
      const stored = localStorage.getItem(this.USERS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  updateLastLogin(cpf: string): void {
    const user = this.getUserByCPF(cpf)
    if (user) {
      user.lastLogin = new Date().toISOString()
      this.saveUser(user)
    }
  }

  // Workout history management
  saveWorkoutHistory(workout: WorkoutHistory): void {
    const history = this.getWorkoutHistory()
    history.push(workout)
    localStorage.setItem(this.WORKOUT_HISTORY_KEY, JSON.stringify(history))
  }

  getWorkoutHistory(userId?: string): WorkoutHistory[] {
    try {
      const stored = localStorage.getItem(this.WORKOUT_HISTORY_KEY)
      const history: WorkoutHistory[] = stored ? JSON.parse(stored) : []

      if (userId) {
        return history.filter((w) => w.userId === userId)
      }

      return history
    } catch {
      return []
    }
  }

  getUserStats(userId: string): {
    totalWorkouts: number
    totalMinutes: number
    totalCalories: number
    averageWorkoutDuration: number
    lastWorkout?: WorkoutHistory
  } {
    const userWorkouts = this.getWorkoutHistory(userId)

    if (userWorkouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        averageWorkoutDuration: 0,
      }
    }

    const totalMinutes = userWorkouts.reduce((sum, w) => sum + w.duration, 0)
    const totalCalories = userWorkouts.reduce((sum, w) => sum + w.estimatedCalories, 0)
    const lastWorkout = userWorkouts.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )[0]

    return {
      totalWorkouts: userWorkouts.length,
      totalMinutes,
      totalCalories,
      averageWorkoutDuration: Math.round(totalMinutes / userWorkouts.length),
      lastWorkout,
    }
  }

  // Generate today's workout for returning user
  getLastWorkoutDate(userId: string): string | null {
    const userWorkouts = this.getWorkoutHistory(userId)
    if (userWorkouts.length === 0) return null

    const lastWorkout = userWorkouts.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    )[0]

    return lastWorkout.completedAt.split("T")[0] // Return just the date part
  }

  hasWorkedOutToday(userId: string): boolean {
    const today = new Date().toISOString().split("T")[0]
    const lastWorkoutDate = this.getLastWorkoutDate(userId)
    return lastWorkoutDate === today
  }
}

export const userStorage = new UserStorage()
