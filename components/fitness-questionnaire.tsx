"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Activity, Target, Zap } from "lucide-react"

interface FitnessQuestionnaireProps {
  userData: any
  onBack: () => void
  onComplete: (questionnaireData: any) => void
  isLoading?: boolean // Add loading prop for Firebase operations
}

interface QuestionnaireData {
  praticaAtividade: string
  frequenciaSemanal: string
  intensidadeTreino: string
  frequenciaDesejada: string
  intensidadeDesejada: string
  tipoTreino: string[]
  objetivos: string[]
  limitacoesFisicas: string
  nivelCondicionamento: string
  frequenciaExercicio: string
}

export function FitnessQuestionnaire({ userData, onBack, onComplete, isLoading = false }: FitnessQuestionnaireProps) {
  const [answers, setAnswers] = useState<QuestionnaireData>({
    praticaAtividade: "",
    frequenciaSemanal: "",
    intensidadeTreino: "",
    frequenciaDesejada: "",
    intensidadeDesejada: "",
    tipoTreino: [],
    objetivos: [],
    limitacoesFisicas: "",
    nivelCondicionamento: "",
    frequenciaExercicio: "",
  })

  const handleTipoTreinoChange = (tipo: string, checked: boolean) => {
    if (checked) {
      setAnswers({ ...answers, tipoTreino: [...answers.tipoTreino, tipo] })
    } else {
      setAnswers({ ...answers, tipoTreino: answers.tipoTreino.filter((t) => t !== tipo) })
    }
  }

  const handleObjetivosChange = (objetivo: string, checked: boolean) => {
    if (checked) {
      setAnswers({ ...answers, objetivos: [...answers.objetivos, objetivo] })
    } else {
      setAnswers({ ...answers, objetivos: answers.objetivos.filter((o) => o !== objetivo) })
    }
  }

  const handleSubmit = () => {
    const mappedData = {
      ...answers,
      nivelCondicionamento:
        answers.praticaAtividade === "sim" ? answers.intensidadeTreino : answers.intensidadeDesejada,
      frequenciaExercicio: answers.praticaAtividade === "sim" ? answers.frequenciaSemanal : answers.frequenciaDesejada,
    }
    onComplete(mappedData)
  }

  const isFormValid = () => {
    if (!answers.praticaAtividade) return false
    if (answers.praticaAtividade === "sim" && (!answers.frequenciaSemanal || !answers.intensidadeTreino)) return false
    if (answers.praticaAtividade === "nao" && (!answers.frequenciaDesejada || !answers.intensidadeDesejada))
      return false
    return answers.tipoTreino.length > 0 && answers.objetivos.length > 0
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
              Questionário de Atividade Física
            </h1>
            <p className="text-muted-foreground">Ajude-nos a criar o treino perfeito para você</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-muted-foreground">Dados Pessoais</span>
            </div>
            <div className="w-8 h-0.5 bg-accent"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-foreground">Questionário</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question 1: Current Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-accent" />
                Atividade Física Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-base font-medium mb-4 block">Você já pratica atividade física regularmente?</Label>
              <RadioGroup
                value={answers.praticaAtividade}
                onValueChange={(value) => setAnswers({ ...answers, praticaAtividade: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="sim" />
                  <Label htmlFor="sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao">Não</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Conditional Questions for Current Practitioners */}
          {answers.praticaAtividade === "sim" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequência Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label className="text-base font-medium mb-4 block">Quantas vezes por semana você treina?</Label>
                  <Select
                    value={answers.frequenciaSemanal}
                    onValueChange={(value) => setAnswers({ ...answers, frequenciaSemanal: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "vez" : "vezes"} por semana
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intensidade Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label className="text-base font-medium mb-4 block">Qual a intensidade do seu treino atual?</Label>
                  <RadioGroup
                    value={answers.intensidadeTreino}
                    onValueChange={(value) => setAnswers({ ...answers, intensidadeTreino: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="leve" id="int-leve" />
                      <Label htmlFor="int-leve">Leve - Exercícios básicos, pouco suor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderado" id="int-moderado" />
                      <Label htmlFor="int-moderado">Moderado - Exercícios intermediários, suor moderado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intenso" id="int-intenso" />
                      <Label htmlFor="int-intenso">Intenso - Exercícios avançados, muito suor</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Conditional Questions for Non-Practitioners */}
          {answers.praticaAtividade === "nao" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequência Desejada</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label className="text-base font-medium mb-4 block">
                    Quantas vezes por semana você gostaria de treinar?
                  </Label>
                  <Select
                    value={answers.frequenciaDesejada}
                    onValueChange={(value) => setAnswers({ ...answers, frequenciaDesejada: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência desejada" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "vez" : "vezes"} por semana
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intensidade Desejada</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label className="text-base font-medium mb-4 block">Qual intensidade você gostaria de começar?</Label>
                  <RadioGroup
                    value={answers.intensidadeDesejada}
                    onValueChange={(value) => setAnswers({ ...answers, intensidadeDesejada: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="leve" id="des-leve" />
                      <Label htmlFor="des-leve">Leve - Começar devagar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderado" id="des-moderado" />
                      <Label htmlFor="des-moderado">Moderado - Desafio equilibrado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intenso" id="des-intenso" />
                      <Label htmlFor="des-intenso">Intenso - Quero me desafiar</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                Seus Objetivos
              </CardTitle>
              <CardDescription>Quais são seus principais objetivos? (pode escolher mais de um)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "perder-peso", label: "Perder Peso", desc: "Queimar calorias e gordura" },
                  { id: "ganhar-massa", label: "Ganhar Massa", desc: "Aumentar músculos" },
                  { id: "condicionamento", label: "Condicionamento", desc: "Melhorar resistência" },
                  { id: "forca", label: "Força", desc: "Aumentar força muscular" },
                  { id: "flexibilidade", label: "Flexibilidade", desc: "Melhorar mobilidade" },
                  { id: "saude-geral", label: "Saúde Geral", desc: "Bem-estar e qualidade de vida" },
                ].map((objetivo) => (
                  <div key={objetivo.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <input
                      type="checkbox"
                      id={objetivo.id}
                      checked={answers.objetivos.includes(objetivo.id)}
                      onChange={(e) => handleObjetivosChange(objetivo.id, e.target.checked)}
                      className="mt-1"
                      disabled={isLoading}
                    />
                    <div>
                      <Label htmlFor={objetivo.id} className="font-medium cursor-pointer">
                        {objetivo.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{objetivo.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workout Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-accent" />
                Tipo de Treino
              </CardTitle>
              <CardDescription>
                Selecione os tipos de treino que mais te interessam (pode escolher mais de um)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "cardio", label: "Cardio", desc: "Corrida, bike, elíptico" },
                  { id: "musculacao", label: "Musculação", desc: "Pesos livres e máquinas" },
                  { id: "hiit", label: "HIIT", desc: "Alta intensidade intervalada" },
                  { id: "funcional", label: "Funcional", desc: "Movimentos naturais" },
                  { id: "yoga", label: "Yoga/Pilates", desc: "Flexibilidade e core" },
                  { id: "crossfit", label: "CrossFit", desc: "Treino variado e intenso" },
                ].map((tipo) => (
                  <div key={tipo.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                    <input
                      type="checkbox"
                      id={tipo.id}
                      checked={answers.tipoTreino.includes(tipo.id)}
                      onChange={(e) => handleTipoTreinoChange(tipo.id, e.target.checked)}
                      className="mt-1"
                      disabled={isLoading}
                    />
                    <div>
                      <Label htmlFor={tipo.id} className="font-medium cursor-pointer">
                        {tipo.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{tipo.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-6">
            <Button onClick={handleSubmit} size="lg" className="px-8" disabled={!isFormValid() || isLoading}>
              {isLoading ? "Salvando..." : "Finalizar Cadastro"}
              {!isLoading && <Zap className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
