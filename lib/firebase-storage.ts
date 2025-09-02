import { db, isFirebaseAvailable } from "@/lib/firebase"
import type { StoredUser, WorkoutHistory } from "@/lib/user-storage"

const localStorageBackup = {
  async saveUser(user: StoredUser): Promise<void> {
    try {
      console.log("[v0] Saving user to localStorage:", user.cpf)

      if (typeof window === "undefined" || !window.localStorage) {
        throw new Error("localStorage is not available")
      }

      const users = JSON.parse(localStorage.getItem("gym_users") || "{}")
      users[user.cpf] = {
        ...user,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      }
      localStorage.setItem("gym_users", JSON.stringify(users))

      setTimeout(() => {
        const savedUsers = JSON.parse(localStorage.getItem("gym_users") || "{}")
        console.log("[v0] Verification - User saved successfully. Total users:", Object.keys(savedUsers).length)
        console.log("[v0] Verification - Available CPFs:", Object.keys(savedUsers))

        // Force another save if user wasn't found
        if (!savedUsers[user.cpf]) {
          console.log("[v0] User not found in verification, forcing save again")
          savedUsers[user.cpf] = {
            ...user,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          }
          localStorage.setItem("gym_users", JSON.stringify(savedUsers))
        }
      }, 100)
    } catch (error) {
      console.error("Error saving user to localStorage:", error)
      throw error
    }
  },

  async getUserByCPF(cpf: string): Promise<StoredUser | null> {
    try {
      console.log("[v0] Attempting to find user with CPF:", cpf)

      if (typeof window === "undefined" || !window.localStorage) {
        console.log("[v0] localStorage not available")
        return null
      }

      const rawData = localStorage.getItem("gym_users")
      console.log("[v0] Direct localStorage check - Raw data:", rawData)

      const users = JSON.parse(rawData || "{}")
      console.log("[v0] Direct localStorage check - Available users:", Object.keys(users))

      const user = users[cpf]
      if (user) {
        console.log("[v0] User found:", user.nome)
        users[cpf].lastLogin = new Date().toISOString()
        localStorage.setItem("gym_users", JSON.stringify(users))

        return {
          ...user,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        }
      }
      console.log("[v0] User not found")
      return null
    } catch (error) {
      console.error("Error getting user from localStorage:", error)
      return null
    }
  },

  async updateLastLogin(cpf: string): Promise<void> {
    try {
      const users = JSON.parse(localStorage.getItem("gym_users") || "{}")
      if (users[cpf]) {
        users[cpf].lastLogin = new Date().toISOString()
        localStorage.setItem("gym_users", JSON.stringify(users))
        console.log("[v0] Last login updated for:", cpf)
      }
    } catch (error) {
      console.error("Error updating last login in localStorage:", error)
    }
  },

  async saveWorkoutHistory(workout: WorkoutHistory): Promise<void> {
    try {
      const history = JSON.parse(localStorage.getItem("gym_workout_history") || "[]")
      history.push({
        ...workout,
        completedAt: new Date(workout.completedAt).toISOString(),
      })
      localStorage.setItem("gym_workout_history", JSON.stringify(history))
      console.log("[v0] Workout history saved to localStorage")
    } catch (error) {
      console.error("Error saving workout history to localStorage:", error)
      throw error
    }
  },

  async getWorkoutHistory(userId: string): Promise<WorkoutHistory[]> {
    try {
      const history = JSON.parse(localStorage.getItem("gym_workout_history") || "[]")
      return history
        .filter((w: WorkoutHistory) => w.userId === userId)
        .sort(
          (a: WorkoutHistory, b: WorkoutHistory) =>
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
        )
    } catch (error) {
      console.error("Error getting workout history from localStorage:", error)
      return []
    }
  },

  async hasWorkedOutToday(userId: string): Promise<boolean> {
    try {
      const history = await this.getWorkoutHistory(userId)
      const today = new Date().toDateString()
      return history.some((w) => new Date(w.completedAt).toDateString() === today)
    } catch (error) {
      console.error("Error checking today's workout in localStorage:", error)
      return false
    }
  },

  async getUserStats(userId: string): Promise<any> {
    try {
      const workouts = await this.getWorkoutHistory(userId)

      if (workouts.length === 0) {
        return {
          totalWorkouts: 0,
          totalMinutes: 0,
          totalCalories: 0,
          averageWorkoutDuration: 0,
          lastWorkout: null,
        }
      }

      const totalWorkouts = workouts.length
      const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0)
      const totalCalories = workouts.reduce((sum, w) => sum + w.estimatedCalories, 0)
      const averageWorkoutDuration = Math.round(totalMinutes / totalWorkouts)
      const lastWorkout = workouts[0]

      return {
        totalWorkouts,
        totalMinutes,
        totalCalories,
        averageWorkoutDuration,
        lastWorkout,
      }
    } catch (error) {
      console.error("Error getting user stats from localStorage:", error)
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        averageWorkoutDuration: 0,
        lastWorkout: null,
      }
    }
  },

  async saveWeeklyWorkout(userId: string, weeklyWorkout: any): Promise<void> {
    try {
      const weekKey = this.getWeekKey()
      const workouts = JSON.parse(localStorage.getItem("gym_weekly_workouts") || "{}")
      workouts[`${userId}_${weekKey}`] = {
        ...weeklyWorkout,
        createdAt: new Date().toISOString(),
        weekKey,
      }
      localStorage.setItem("gym_weekly_workouts", JSON.stringify(workouts))
      console.log("[v0] Weekly workout saved to localStorage for week:", weekKey)
    } catch (error) {
      console.error("Error saving weekly workout to localStorage:", error)
      throw error
    }
  },

  async getWeeklyWorkout(userId: string): Promise<any | null> {
    try {
      const weekKey = this.getWeekKey()
      const workouts = JSON.parse(localStorage.getItem("gym_weekly_workouts") || "{}")
      const workout = workouts[`${userId}_${weekKey}`]
      return workout || null
    } catch (error) {
      console.error("Error getting weekly workout from localStorage:", error)
      return null
    }
  },

  async clearWeeklyWorkout(userId: string): Promise<void> {
    try {
      const weekKey = this.getWeekKey()
      const workouts = JSON.parse(localStorage.getItem("gym_weekly_workouts") || "{}")
      delete workouts[`${userId}_${weekKey}`]
      localStorage.setItem("gym_weekly_workouts", JSON.stringify(workouts))
      console.log("[v0] Weekly workout cleared from localStorage for week:", weekKey)
    } catch (error) {
      console.error("Error clearing weekly workout from localStorage:", error)
      throw error
    }
  },

  getWeekKey(): string {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)) // Monday
    return startOfWeek.toISOString().split("T")[0] // YYYY-MM-DD format
  },
}

const firebaseImplementation = {
  async saveUser(user: StoredUser): Promise<void> {
    try {
      const { doc, setDoc, Timestamp } = await import("firebase/firestore")
      await setDoc(doc(db, "users", user.cpf), {
        ...user,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      })
      console.log("[v0] User saved to Firebase:", user.cpf)
    } catch (error) {
      console.error("Error saving user to Firebase:", error)
      throw error
    }
  },

  async getUserByCPF(cpf: string): Promise<StoredUser | null> {
    try {
      const { doc, getDoc } = await import("firebase/firestore")
      const userDoc = await getDoc(doc(db, "users", cpf))
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          lastLogin: data.lastLogin?.toDate?.() || new Date(),
        } as StoredUser
      }
      return null
    } catch (error) {
      console.error("Error getting user from Firebase:", error)
      return null
    }
  },

  async updateLastLogin(cpf: string): Promise<void> {
    try {
      const { doc, updateDoc, Timestamp } = await import("firebase/firestore")
      await updateDoc(doc(db, "users", cpf), {
        lastLogin: Timestamp.now(),
      })
    } catch (error) {
      console.error("Error updating last login in Firebase:", error)
    }
  },

  async saveWorkoutHistory(workout: WorkoutHistory): Promise<void> {
    try {
      const { collection, addDoc, Timestamp } = await import("firebase/firestore")
      await addDoc(collection(db, "workoutHistory"), {
        ...workout,
        completedAt: Timestamp.fromDate(new Date(workout.completedAt)),
      })
    } catch (error) {
      console.error("Error saving workout history to Firebase:", error)
      throw error
    }
  },

  async getWorkoutHistory(userId: string): Promise<WorkoutHistory[]> {
    try {
      const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")
      const q = query(collection(db, "workoutHistory"), where("userId", "==", userId), orderBy("completedAt", "desc"))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          ...data,
          completedAt: data.completedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as WorkoutHistory
      })
    } catch (error) {
      console.error("Error getting workout history from Firebase:", error)
      return []
    }
  },

  async hasWorkedOutToday(userId: string): Promise<boolean> {
    try {
      const { collection, query, where, getDocs, Timestamp } = await import("firebase/firestore")
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const q = query(
        collection(db, "workoutHistory"),
        where("userId", "==", userId),
        where("completedAt", ">=", Timestamp.fromDate(today)),
        where("completedAt", "<", Timestamp.fromDate(tomorrow)),
      )

      const querySnapshot = await getDocs(q)
      return !querySnapshot.empty
    } catch (error) {
      console.error("Error checking today's workout in Firebase:", error)
      return false
    }
  },

  async getUserStats(userId: string): Promise<any> {
    try {
      const workouts = await this.getWorkoutHistory(userId)

      if (workouts.length === 0) {
        return {
          totalWorkouts: 0,
          totalMinutes: 0,
          totalCalories: 0,
          averageWorkoutDuration: 0,
          lastWorkout: null,
        }
      }

      const totalWorkouts = workouts.length
      const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0)
      const totalCalories = workouts.reduce((sum, w) => sum + w.estimatedCalories, 0)
      const averageWorkoutDuration = Math.round(totalMinutes / totalWorkouts)
      const lastWorkout = workouts[0]

      return {
        totalWorkouts,
        totalMinutes,
        totalCalories,
        averageWorkoutDuration,
        lastWorkout,
      }
    } catch (error) {
      console.error("Error getting user stats from Firebase:", error)
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        averageWorkoutDuration: 0,
        lastWorkout: null,
      }
    }
  },

  async saveWeeklyWorkout(userId: string, weeklyWorkout: any): Promise<void> {
    try {
      const { doc, setDoc, Timestamp } = await import("firebase/firestore")
      const weekKey = this.getWeekKey()
      await setDoc(doc(db, "weeklyWorkouts", `${userId}_${weekKey}`), {
        ...weeklyWorkout,
        userId,
        weekKey,
        createdAt: Timestamp.now(),
      })
      console.log("[v0] Weekly workout saved to Firebase for week:", weekKey)
    } catch (error) {
      console.error("Error saving weekly workout to Firebase:", error)
      throw error
    }
  },

  async getWeeklyWorkout(userId: string): Promise<any | null> {
    try {
      const { doc, getDoc } = await import("firebase/firestore")
      const weekKey = this.getWeekKey()
      const workoutDoc = await getDoc(doc(db, "weeklyWorkouts", `${userId}_${weekKey}`))
      if (workoutDoc.exists()) {
        const data = workoutDoc.data()
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        }
      }
      return null
    } catch (error) {
      console.error("Error getting weekly workout from Firebase:", error)
      return null
    }
  },

  async clearWeeklyWorkout(userId: string): Promise<void> {
    try {
      const { doc, deleteDoc } = await import("firebase/firestore")
      const weekKey = this.getWeekKey()
      await deleteDoc(doc(db, "weeklyWorkouts", `${userId}_${weekKey}`))
      console.log("[v0] Weekly workout cleared from Firebase for week:", weekKey)
    } catch (error) {
      console.error("Error clearing weekly workout from Firebase:", error)
      throw error
    }
  },

  getWeekKey(): string {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)) // Monday
    return startOfWeek.toISOString().split("T")[0] // YYYY-MM-DD format
  },
}

export const firebaseStorage = isFirebaseAvailable ? firebaseImplementation : localStorageBackup

console.log(`[v0] Using ${isFirebaseAvailable ? "Firebase" : "localStorage"} for data storage`)
