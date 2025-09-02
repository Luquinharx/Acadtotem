"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, LogIn, HelpCircle } from "lucide-react"
import { UserRegistration } from "@/components/user-registration"
import { UserLogin } from "@/components/user-login"
import { ExerciseHelp } from "@/components/exercise-help"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "register" | "login" | "exercise-help">("home")
  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

  if (currentView === "register") {
    return <UserRegistration onBack={() => setCurrentView("home")} />
  }

  if (currentView === "login") {
    return <UserLogin onBack={() => setCurrentView("home")} />
  }

  if (currentView === "exercise-help") {
    return <ExerciseHelp onBack={() => setCurrentView("home")} />
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-[family-name:var(--font-space-grotesk)]">
            Personal Trainer Digital
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Seu treino personalizado te espera</p>
          <p className="text-lg text-accent font-medium">{currentDate}</p>
        </div>

        {/* Main Actions Grid - Updated styling for more rounded mobile UX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* New User Registration */}
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-accent rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
                <UserPlus className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-[family-name:var(--font-space-grotesk)] mb-2">Novo Usuário</CardTitle>
              <CardDescription className="text-base">Faça seu cadastro e comece sua jornada fitness</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full h-16 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                size="lg"
                onClick={() => setCurrentView("register")}
              >
                Cadastrar-se
              </Button>
            </CardContent>
          </Card>

          {/* Existing User Login */}
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-accent rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-lg">
                <LogIn className="w-10 h-10 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl font-[family-name:var(--font-space-grotesk)] mb-2">
                Já sou cadastrado
              </CardTitle>
              <CardDescription className="text-base">Acesse com seu CPF e continue seu treino</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                className="w-full h-16 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                size="lg"
                onClick={() => setCurrentView("login")}
              >
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-orange rounded-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-orange rounded-full flex items-center justify-center mb-6 shadow-lg">
                <HelpCircle className="w-10 h-10 text-orange-foreground" />
              </div>
              <CardTitle className="text-2xl font-[family-name:var(--font-space-grotesk)] mb-2 text-orange">
                Ajuda com Exercício
              </CardTitle>
              <CardDescription className="text-base">
                Pesquise exercícios e veja demonstrações em vídeo com instruções detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full h-16 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all bg-orange hover:bg-orange/90 text-orange-foreground"
                size="lg"
                onClick={() => setCurrentView("exercise-help")}
              >
                Pesquisar Exercícios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Quote */}
        <div className="mt-16 text-center">
          <Card className="bg-muted/50 border-0 rounded-2xl">
            <CardContent className="pt-8 pb-8">
              <blockquote className="text-xl italic text-muted-foreground font-medium">
                "O sucesso é a soma de pequenos esforços repetidos dia após dia."
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
