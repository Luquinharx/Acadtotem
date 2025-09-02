"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Play, BookOpen } from "lucide-react"

interface ExerciseHelpProps {
  onBack: () => void
}

interface Exercise {
  name: string
  description: string
  muscleGroups: string[]
  instructions: string[]
  tips: string[]
  videoUrl?: string
  gifUrl?: string
}

export function ExerciseHelp({ onBack }: ExerciseHelpProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [searchResults, setSearchResults] = useState<Exercise[]>([])

  const exerciseDatabase: Exercise[] = [
    {
      name: "Supino Reto",
      description: "Exercício fundamental para desenvolvimento do peitoral, ombros e tríceps.",
      muscleGroups: ["Peitoral", "Ombros", "Tríceps"],
      instructions: [
        "Deite-se no banco com os pés apoiados no chão",
        "Segure a barra com pegada ligeiramente mais larga que os ombros",
        "Desça a barra controladamente até tocar o peito",
        "Empurre a barra de volta à posição inicial",
      ],
      tips: [
        "Mantenha os ombros retraídos durante todo o movimento",
        "Não deixe a barra quicar no peito",
        "Expire ao empurrar a barra para cima",
      ],
      gifUrl: "/bench-press-demonstration.png",
    },
    {
      name: "Agachamento",
      description: "Exercício composto que trabalha principalmente quadríceps, glúteos e core.",
      muscleGroups: ["Quadríceps", "Glúteos", "Core"],
      instructions: [
        "Posicione os pés na largura dos ombros",
        "Desça flexionando quadris e joelhos simultaneamente",
        "Mantenha o peito erguido e o peso nos calcanhares",
        "Suba empurrando o chão com os pés",
      ],
      tips: [
        "Não deixe os joelhos ultrapassarem muito a linha dos pés",
        "Desça até os quadris ficarem abaixo dos joelhos",
        "Mantenha o core contraído durante todo o movimento",
      ],
      gifUrl: "/woman-doing-squat.png",
    },
    {
      name: "Flexão de Braço",
      description: "Exercício de peso corporal para peitoral, ombros e tríceps.",
      muscleGroups: ["Peitoral", "Ombros", "Tríceps"],
      instructions: [
        "Posicione-se em prancha com mãos na largura dos ombros",
        "Desça o corpo mantendo-o alinhado",
        "Empurre o corpo de volta à posição inicial",
        "Mantenha o core contraído",
      ],
      tips: [
        "Não deixe o quadril subir ou descer",
        "Desça até o peito quase tocar o chão",
        "Se for difícil, apoie os joelhos no chão",
      ],
      gifUrl: "/push-up-demonstration.png",
    },
  ]

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    const results = exerciseDatabase.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some((muscle) => muscle.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setSearchResults(results)
    setSelectedExercise(null)
  }

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="lg" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
              Ajuda com Exercícios
            </h1>
            <p className="text-muted-foreground">Pesquise e aprenda a executar exercícios corretamente</p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-accent" />
              Pesquisar Exercício
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Digite o nome do exercício ou grupo muscular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Pesquisar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && !selectedExercise && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resultados da Pesquisa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {searchResults.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors"
                    onClick={() => handleExerciseSelect(exercise)}
                  >
                    <h3 className="font-semibold text-lg mb-2">{exercise.name}</h3>
                    <p className="text-muted-foreground mb-2">{exercise.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscleGroups.map((muscle) => (
                        <span key={muscle} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Exercise Details */}
        {selectedExercise && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exercise Video/GIF */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="w-5 h-5 mr-2 text-accent" />
                  Demonstração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  {selectedExercise.gifUrl ? (
                    <img
                      src={selectedExercise.gifUrl || "/placeholder.svg"}
                      alt={`Demonstração ${selectedExercise.name}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Vídeo demonstrativo</p>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{selectedExercise.name}</h3>
                <p className="text-muted-foreground">{selectedExercise.description}</p>
              </CardContent>
            </Card>

            {/* Exercise Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-accent" />
                  Como Executar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Muscle Groups */}
                <div>
                  <h4 className="font-semibold mb-2">Músculos Trabalhados:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.muscleGroups.map((muscle) => (
                      <span key={muscle} className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-2">Passo a Passo:</h4>
                  <ol className="space-y-2">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                <div className="bg-accent/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-accent">Dicas Importantes:</h4>
                  <ul className="space-y-1">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="mr-2">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" onClick={() => setSelectedExercise(null)} className="w-full">
                  Voltar aos Resultados
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popular Exercises */}
        {searchResults.length === 0 && !selectedExercise && (
          <Card>
            <CardHeader>
              <CardTitle>Exercícios Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exerciseDatabase.slice(0, 3).map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors text-center"
                    onClick={() => handleExerciseSelect(exercise)}
                  >
                    <h3 className="font-semibold mb-2">{exercise.name}</h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {exercise.muscleGroups.map((muscle) => (
                        <span key={muscle} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
