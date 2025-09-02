"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, FileText } from "lucide-react"
import { FitnessQuestionnaire } from "@/components/fitness-questionnaire"
import { firebaseStorage } from "@/lib/firebase-storage" // Import Firebase storage instead of local storage
import type { StoredUser } from "@/lib/user-storage"

interface UserRegistrationProps {
  onBack: () => void
}

interface UserData {
  nome: string
  cpf: string
  idade: string
  peso: string
  altura: string
  frequenciaAtividade: string
}

export function UserRegistration({ onBack }: UserRegistrationProps) {
  const [currentStep, setCurrentStep] = useState<"form" | "questionnaire">("form")
  const [userData, setUserData] = useState<UserData>({
    nome: "",
    cpf: "",
    idade: "",
    peso: "",
    altura: "",
    frequenciaAtividade: "",
  })
  const [errors, setErrors] = useState<Partial<UserData>>({})
  const [isLoading, setIsLoading] = useState(false) // Add loading state for Firebase operations

  const validateForm = async () => {
    const newErrors: Partial<UserData> = {}

    if (!userData.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!userData.cpf.trim()) newErrors.cpf = "CPF é obrigatório"
    if (!userData.idade.trim()) newErrors.idade = "Idade é obrigatória"
    if (!userData.peso.trim()) newErrors.peso = "Peso é obrigatório"
    if (!userData.altura.trim()) newErrors.altura = "Altura é obrigatória"
    if (!userData.frequenciaAtividade) newErrors.frequenciaAtividade = "Frequência é obrigatória"

    // CPF basic validation (11 digits)
    if (userData.cpf && !/^\d{11}$/.test(userData.cpf.replace(/\D/g, ""))) {
      newErrors.cpf = "CPF deve ter 11 dígitos"
    }

    if (userData.cpf && !newErrors.cpf) {
      try {
        const existingUser = await firebaseStorage.getUserByCPF(userData.cpf.replace(/\D/g, ""))
        if (existingUser) {
          newErrors.cpf = "CPF já cadastrado. Faça login para acessar."
        }
      } catch (error) {
        console.error("Error checking existing user:", error)
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const isValid = await validateForm()
      if (isValid) {
        console.log("[v0] Form validation passed, moving to questionnaire")
        setCurrentStep("questionnaire")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegistrationComplete = async (questionnaireData: any) => {
    setIsLoading(true)

    try {
      const completeUser: StoredUser = {
        ...userData,
        ...questionnaireData,
        cpf: userData.cpf.replace(/\D/g, ""), // Store CPF without formatting
        registeredAt: new Date().toISOString(),
      }

      await firebaseStorage.saveUser(completeUser)
      console.log("[v0] User registration completed successfully")

      // Redirect back to home
      onBack()
    } catch (error) {
      console.error("Error saving user:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  if (currentStep === "questionnaire") {
    return (
      <FitnessQuestionnaire
        userData={userData}
        onBack={() => setCurrentStep("form")}
        onComplete={handleRegistrationComplete}
        isLoading={isLoading} // Pass loading state to questionnaire
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="lg" onClick={onBack} className="mr-4" disabled={isLoading}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
              Cadastro de Usuário
            </h1>
            <p className="text-muted-foreground">Preencha seus dados para começar</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">Dados Pessoais</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-muted-foreground">Questionário</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-accent" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Todos os campos são obrigatórios para gerar seu treino personalizado</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={userData.nome}
                    onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                    className={errors.nome ? "border-destructive" : ""}
                    placeholder="Digite seu nome completo"
                  />
                  {errors.nome && <p className="text-sm text-destructive mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={userData.cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value)
                      if (formatted.length <= 14) {
                        setUserData({ ...userData, cpf: formatted })
                      }
                    }}
                    className={errors.cpf ? "border-destructive" : ""}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf}</p>}
                </div>

                <div>
                  <Label htmlFor="idade">Idade *</Label>
                  <Input
                    id="idade"
                    type="number"
                    value={userData.idade}
                    onChange={(e) => setUserData({ ...userData, idade: e.target.value })}
                    className={errors.idade ? "border-destructive" : ""}
                    placeholder="Ex: 35"
                    min="16"
                    max="100"
                  />
                  {errors.idade && <p className="text-sm text-destructive mt-1">{errors.idade}</p>}
                </div>

                <div>
                  <Label htmlFor="peso">Peso (kg) *</Label>
                  <Input
                    id="peso"
                    type="number"
                    value={userData.peso}
                    onChange={(e) => setUserData({ ...userData, peso: e.target.value })}
                    className={errors.peso ? "border-destructive" : ""}
                    placeholder="Ex: 70"
                    min="30"
                    max="300"
                    step="0.1"
                  />
                  {errors.peso && <p className="text-sm text-destructive mt-1">{errors.peso}</p>}
                </div>

                <div>
                  <Label htmlFor="altura">Altura (cm) *</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={userData.altura}
                    onChange={(e) => setUserData({ ...userData, altura: e.target.value })}
                    className={errors.altura ? "border-destructive" : ""}
                    placeholder="Ex: 175"
                    min="100"
                    max="250"
                  />
                  {errors.altura && <p className="text-sm text-destructive mt-1">{errors.altura}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="frequencia">Frequência de Atividade Física *</Label>
                  <Select
                    value={userData.frequenciaAtividade}
                    onValueChange={(value) => setUserData({ ...userData, frequenciaAtividade: value })}
                  >
                    <SelectTrigger className={errors.frequenciaAtividade ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione sua frequência atual" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentario">Sedentário - Pouca ou nenhuma atividade</SelectItem>
                      <SelectItem value="leve">Leve - 1-2 vezes por semana</SelectItem>
                      <SelectItem value="moderado">Moderado - 3-4 vezes por semana</SelectItem>
                      <SelectItem value="intenso">Intenso - 5+ vezes por semana</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.frequenciaAtividade && (
                    <p className="text-sm text-destructive mt-1">{errors.frequenciaAtividade}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" className="px-8" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Continuar para Questionário"}
                  {!isLoading && <FileText className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
