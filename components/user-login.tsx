"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogIn, User, Dumbbell, TrendingUp } from "lucide-react"
import { firebaseAuth, type User as FirebaseUser } from "@/lib/firebase-auth"
import { WorkoutDisplay } from "@/components/workout-display"
import { ProgressCalendar } from "@/components/progress-calendar"

interface UserLoginProps {
  onBack: () => void
}

export function UserLogin({ onBack }: UserLoginProps) {
  const [currentView, setCurrentView] = useState<"login" | "menu" | "workout" | "progress">("login")
  const [loggedInUser, setLoggedInUser] = useState<FirebaseUser | null>(null)
  const [cpf, setCpf] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!cpf.trim()) {
      setError("CPF é obrigatório")
      return
    }

    const cleanCPF = cpf.replace(/\D/g, "")
    if (!/^\d{11}$/.test(cleanCPF)) {
      setError("CPF deve ter 11 dígitos")
      return
    }

    setIsLoading(true)

    try {
      const user = await firebaseAuth.getUserByCPF(cleanCPF)

      if (user) {
        await firebaseAuth.updateLastLogin(user.cpf)
        setLoggedInUser(user)
        setCurrentView("menu")
      } else {
        setError("Usuário não encontrado. Verifique seu CPF ou faça o cadastro.")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("Erro ao conectar com o banco de dados. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    setCurrentView("login")
    setCpf("")
    setError("")
  }

  if (currentView === "workout" && loggedInUser) {
    return <WorkoutDisplay user={loggedInUser} onBack={() => setCurrentView("menu")} onLogout={handleLogout} />
  }

  if (currentView === "progress" && loggedInUser) {
    return <ProgressCalendar user={loggedInUser} onBack={() => setCurrentView("menu")} onLogout={handleLogout} />
  }

  if (currentView === "menu" && loggedInUser) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button variant="ghost" size="lg" onClick={onBack} className="mr-4">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
                  Olá, {loggedInUser.displayName?.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">O que você gostaria de fazer?</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>

          {/* Menu Options */}
          <div className="space-y-4">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-orange"
              onClick={() => setCurrentView("workout")}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Dumbbell className="w-8 h-8 text-orange mr-4" />
                <div>
                  <CardTitle className="text-xl">Visualizar Treino</CardTitle>
                  <CardDescription>Veja seu treino semanal e execute o treino de hoje</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-orange"
              onClick={() => setCurrentView("progress")}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <TrendingUp className="w-8 h-8 text-orange mr-4" />
                <div>
                  <CardTitle className="text-xl">Meu Progresso</CardTitle>
                  <CardDescription>Acompanhe seu histórico e calendário de treinos</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="lg" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">Login</h1>
            <p className="text-muted-foreground">Acesse com seu CPF</p>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-secondary-foreground" />
            </div>
            <CardTitle>Bem-vindo de volta!</CardTitle>
            <CardDescription>Digite seu CPF para acessar seus treinos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value)
                    if (formatted.length <= 14) {
                      setCpf(formatted)
                    }
                  }}
                  className={error ? "border-destructive" : ""}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-orange hover:bg-orange/90 text-orange-foreground"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
                {!isLoading && <LogIn className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Primeira vez aqui?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={onBack}>
                  Faça seu cadastro
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
