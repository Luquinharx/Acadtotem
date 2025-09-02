import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

export interface User {
  cpf: string
  nome: string
  idade: string
  peso: string
  altura: string
  frequenciaExercicio: string
  frequenciaSemanal: string
  nivelCondicionamento: string
  intensidadeDesejada: string
  intensidadeTreino: string
  objetivos: string[]
  limitacoesFisicas: string[]
  frequenciaAtividade: string
  frequenciaDesejada: string
  createdAt: string
  lastLogin?: string
}

export const firebaseAuth = {
  async getUserByCPF(cpf: string): Promise<User | null> {
    try {
      console.log("[v0] Searching for user with CPF:", cpf)
      const userDoc = await getDoc(doc(db, "users", cpf))

      if (userDoc.exists()) {
        const userData = userDoc.data() as User
        console.log("[v0] User found:", userData.nome)
        return userData
      } else {
        console.log("[v0] User not found in Firebase")
        return null
      }
    } catch (error) {
      console.error("[v0] Error fetching user:", error)
      return null
    }
  },

  async saveUser(user: User): Promise<boolean> {
    try {
      console.log("[v0] Saving user to Firebase:", user.cpf)
      await setDoc(doc(db, "users", user.cpf), {
        ...user,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      })
      console.log("[v0] User saved successfully")
      return true
    } catch (error) {
      console.error("[v0] Error saving user:", error)
      return false
    }
  },

  async updateLastLogin(cpf: string): Promise<void> {
    try {
      await updateDoc(doc(db, "users", cpf), {
        lastLogin: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Error updating last login:", error)
    }
  },
}
