import type { StoredUser } from "@/lib/user-storage"

// Simulação da API do Gemini para desenvolvimento
const mockGeminiAPI = {
  async generateContent(prompt: string) {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      response: {
        text: () => {
          // Retorna um JSON válido baseado no prompt
          return JSON.stringify({
            name: "Treino Personalizado - Força e Condicionamento",
            exercises: [
              {
                name: "Aquecimento - Caminhada",
                description: "Aquecimento cardiovascular leve para preparar o corpo para o treino. Ativa o sistema circulatório e aquece as articulações.",
                sets: 1,
                reps: "10 min",
                restTime: 120,
                muscleGroups: ["Cardiovascular"],
                difficulty: "Iniciante",
                instructions: [
                  "Mantenha postura ereta durante toda a caminhada",
                  "Comece em ritmo lento e aumente gradualmente",
                  "Respire de forma controlada e ritmada",
                  "Mantenha os braços relaxados ao lado do corpo"
                ],
                tips: [
                  "Hidrate-se antes e durante o exercício",
                  "Use tênis adequado para evitar lesões",
                  "Se sentir qualquer desconforto, reduza o ritmo"
                ]
              },
              {
                name: "Agachamento Livre",
                description: "Exercício fundamental para desenvolvimento de quadríceps, glúteos e core. Movimento funcional que melhora força e estabilidade.",
                sets: 3,
                reps: "12-15",
                restTime: 60,
                muscleGroups: ["Quadríceps", "Glúteos", "Core"],
                difficulty: "Intermediário",
                instructions: [
                  "Posicione os pés na largura dos ombros",
                  "Desça flexionando quadris e joelhos simultaneamente",
                  "Mantenha o peito erguido e olhar para frente",
                  "Desça até os quadris ficarem abaixo dos joelhos",
                  "Suba empurrando o chão com os pés"
                ],
                tips: [
                  "Não deixe os joelhos ultrapassarem a linha dos pés",
                  "Mantenha o peso nos calcanhares",
                  "Contraia o abdômen durante todo o movimento",
                  "Se for difícil, use uma cadeira como apoio"
                ]
              },
              {
                name: "Flexão de Braço",
                description: "Exercício de peso corporal para desenvolvimento do peitoral, ombros e tríceps. Fortalece a musculatura do tronco superior.",
                sets: 3,
                reps: "8-12",
                restTime: 60,
                muscleGroups: ["Peitoral", "Ombros", "Tríceps"],
                difficulty: "Intermediário",
                instructions: [
                  "Posicione-se em prancha com mãos na largura dos ombros",
                  "Mantenha o corpo alinhado da cabeça aos pés",
                  "Desça o corpo controladamente até o peito quase tocar o chão",
                  "Empurre o corpo de volta à posição inicial",
                  "Mantenha o core contraído durante todo o movimento"
                ],
                tips: [
                  "Não deixe o quadril subir ou descer",
                  "Se for difícil, apoie os joelhos no chão",
                  "Expire ao empurrar para cima",
                  "Mantenha o pescoço neutro"
                ]
              },
              {
                name: "Prancha Isométrica",
                description: "Exercício isométrico para fortalecimento do core, ombros e estabilizadores. Melhora postura e estabilidade central.",
                sets: 3,
                reps: "30-45s",
                restTime: 45,
                muscleGroups: ["Core", "Ombros"],
                difficulty: "Iniciante",
                instructions: [
                  "Apoie-se nos antebraços e pontas dos pés",
                  "Mantenha o corpo em linha reta",
                  "Contraia o abdômen e glúteos",
                  "Mantenha a respiração normal",
                  "Segure a posição pelo tempo determinado"
                ],
                tips: [
                  "Não deixe o quadril subir ou descer",
                  "Mantenha os cotovelos alinhados com os ombros",
                  "Se for difícil, apoie os joelhos",
                  "Foque na qualidade, não no tempo"
                ]
              },
              {
                name: "Afundo Alternado",
                description: "Exercício unilateral para pernas e glúteos. Melhora equilíbrio, coordenação e força funcional.",
                sets: 3,
                reps: "10-12 cada perna",
                restTime: 60,
                muscleGroups: ["Quadríceps", "Glúteos"],
                difficulty: "Intermediário",
                instructions: [
                  "Fique em pé com pés na largura dos quadris",
                  "Dê um passo à frente com uma perna",
                  "Desça o joelho traseiro em direção ao chão",
                  "Mantenha o tronco ereto durante o movimento",
                  "Volte à posição inicial e alterne as pernas"
                ],
                tips: [
                  "O joelho da frente não deve passar da ponta do pé",
                  "Desça até formar ângulo de 90 graus",
                  "Use uma parede para apoio se necessário",
                  "Mantenha o core ativado"
                ]
              },
              {
                name: "Alongamento Geral",
                description: "Sequência de alongamentos para relaxar a musculatura trabalhada e melhorar a flexibilidade.",
                sets: 1,
                reps: "10 min",
                restTime: 0,
                muscleGroups: ["Flexibilidade"],
                difficulty: "Iniciante",
                instructions: [
                  "Alongue cada grupo muscular por 30 segundos",
                  "Respire profundamente durante os alongamentos",
                  "Não force além do confortável",
                  "Mantenha movimentos suaves e controlados"
                ],
                tips: [
                  "Nunca force o alongamento até sentir dor",
                  "Respire profundamente para relaxar",
                  "Foque nos músculos que mais trabalharam",
                  "Termine sempre com relaxamento"
                ]
              }
            ],
            duration: "45-55 min",
            estimatedCalories: 320,
            totalSets: 14,
            difficulty: "Intermediário",
            focus: ["Condicionamento Geral", "Força Funcional", "Flexibilidade"]
          })
        }
      }
    }
  }
}

export interface GeminiWorkoutPlan {
  name: string
  exercises: Array<{
    name: string
    description: string
    sets: number
    reps: string
    restTime: number
    muscleGroups: string[]
    difficulty: string
    instructions: string[]
    tips: string[]
  }>
  duration: string
  estimatedCalories: number
  totalSets: number
  difficulty: string
  focus: string[]
}

export const geminiWorkoutGenerator = {
  async generateWorkout(user: StoredUser): Promise<GeminiWorkoutPlan> {
    console.log("[v0] Generating workout for user:", user.nome)
    
    try {
      // Usar API mock para desenvolvimento
      const result = await mockGeminiAPI.generateContent("workout prompt")
      const response = await result.response
      const text = response.text()
      
      console.log("[v0] Gemini response received")
      
      // Parse do JSON
      const workoutPlan = JSON.parse(text)
      console.log("[v0] Workout plan generated successfully:", workoutPlan.name)
      
      return workoutPlan
    } catch (error) {
      console.error("[v0] Error generating workout with Gemini:", error)
      
      // Fallback workout mais robusto
      return this.generateFallbackWorkout(user)
    }
  },

  async generateWeeklyWorkout(
    user: StoredUser,
    intensity: "low" | "medium" | "high" = "medium",
    distribution: "sequential" | "alternating" = "sequential",
  ): Promise<any> {
    console.log("[v0] Generating weekly workout for user:", user.nome)
    console.log("[v0] Intensity:", intensity, "Distribution:", distribution)
    
    const frequency = user.frequenciaDesejada
      ? Number.parseInt(user.frequenciaDesejada)
      : user.frequenciaSemanal
        ? Number.parseInt(user.frequenciaSemanal)
        : 3

    console.log("[v0] Workout frequency:", frequency)

    try {
      // Usar API mock para desenvolvimento
      const result = await mockGeminiAPI.generateContent("weekly workout prompt")
      const response = await result.response
      const text = response.text()
      
      console.log("[v0] Weekly workout response received")
      
      // Para treino semanal, vamos gerar um plano mais estruturado
      return this.generateStructuredWeeklyPlan(user, frequency, intensity, distribution)
    } catch (error) {
      console.error("[v0] Error generating weekly workout with Gemini:", error)
      return this.generateStructuredWeeklyPlan(user, frequency, intensity, distribution)
    }
  },

  generateFallbackWorkout(user: StoredUser): GeminiWorkoutPlan {
    const baseCalories = Number.parseInt(user.peso) * 4.5 // Estimativa baseada no peso
    
    return {
      name: "Treino Personalizado - Condicionamento Geral",
      exercises: [
        {
          name: "Aquecimento - Movimentação Articular",
          description: "Aquecimento completo para preparar o corpo. Movimentos circulares e alongamentos dinâmicos.",
          sets: 1,
          reps: "8 min",
          restTime: 60,
          muscleGroups: ["Aquecimento"],
          difficulty: "Iniciante",
          instructions: [
            "Comece com movimentos lentos e controlados",
            "Faça círculos com braços, quadris e tornozelos",
            "Aumente gradualmente a amplitude dos movimentos",
            "Respire profundamente durante todo o aquecimento"
          ],
          tips: [
            "Não force nenhum movimento",
            "Pare se sentir qualquer dor",
            "Foque em acordar o corpo gradualmente"
          ]
        },
        {
          name: "Agachamento Livre",
          description: "Exercício fundamental para pernas e glúteos. Movimento funcional que fortalece toda a cadeia posterior.",
          sets: 3,
          reps: "12-15",
          restTime: 60,
          muscleGroups: ["Quadríceps", "Glúteos", "Core"],
          difficulty: "Intermediário",
          instructions: [
            "Pés na largura dos ombros, pontas ligeiramente para fora",
            "Desça flexionando quadris e joelhos simultaneamente",
            "Mantenha o peito erguido e core contraído",
            "Desça até os quadris ficarem abaixo dos joelhos",
            "Suba empurrando o chão com força"
          ],
          tips: [
            "Mantenha o peso nos calcanhares",
            "Joelhos devem seguir a direção dos pés",
            "Se for difícil, use uma cadeira como referência",
            "Respire fundo na descida, expire na subida"
          ]
        },
        {
          name: "Flexão de Braço",
          description: "Exercício clássico para peito, ombros e tríceps. Fortalece toda a musculatura do tronco superior.",
          sets: 3,
          reps: "8-12",
          restTime: 60,
          muscleGroups: ["Peitoral", "Ombros", "Tríceps"],
          difficulty: "Intermediário",
          instructions: [
            "Posição de prancha com mãos na largura dos ombros",
            "Corpo alinhado da cabeça aos pés",
            "Desça controladamente até o peito quase tocar o chão",
            "Empurre com força para voltar à posição inicial",
            "Mantenha o core sempre contraído"
          ],
          tips: [
            "Se for difícil, apoie os joelhos no chão",
            "Não deixe o quadril subir ou descer",
            "Mantenha o pescoço em posição neutra",
            "Qualidade é mais importante que quantidade"
          ]
        },
        {
          name: "Prancha Isométrica",
          description: "Exercício de estabilização para core e ombros. Desenvolve resistência e força do centro do corpo.",
          sets: 3,
          reps: "30-45s",
          restTime: 45,
          muscleGroups: ["Core", "Ombros"],
          difficulty: "Iniciante",
          instructions: [
            "Apoie-se nos antebraços e pontas dos pés",
            "Mantenha o corpo em linha reta",
            "Contraia abdômen e glúteos",
            "Respire normalmente durante a sustentação",
            "Mantenha a posição pelo tempo determinado"
          ],
          tips: [
            "Não prenda a respiração",
            "Se for difícil, apoie os joelhos",
            "Foque na qualidade da postura",
            "Pare se sentir dor nas costas"
          ]
        },
        {
          name: "Caminhada de Recuperação",
          description: "Caminhada leve para recuperação ativa e volta à calma. Ajuda na remoção de metabólitos.",
          sets: 1,
          reps: "5 min",
          restTime: 0,
          muscleGroups: ["Recuperação"],
          difficulty: "Iniciante",
          instructions: [
            "Caminhe em ritmo lento e confortável",
            "Respire profundamente",
            "Relaxe os ombros e braços",
            "Diminua gradualmente o ritmo"
          ],
          tips: [
            "Use este tempo para se hidratar",
            "Respire profundamente para relaxar",
            "Prepare-se mentalmente para o alongamento"
          ]
        },
        {
          name: "Alongamento Completo",
          description: "Sequência de alongamentos para todos os grupos musculares trabalhados. Melhora flexibilidade e acelera recuperação.",
          sets: 1,
          reps: "8 min",
          restTime: 0,
          muscleGroups: ["Flexibilidade"],
          difficulty: "Iniciante",
          instructions: [
            "Alongue cada grupo muscular por 30-45 segundos",
            "Respire profundamente durante cada alongamento",
            "Não force além do ponto confortável",
            "Mantenha movimentos suaves e controlados"
          ],
          tips: [
            "Nunca force até sentir dor",
            "Respire para relaxar os músculos",
            "Foque nos músculos que mais trabalharam",
            "Termine sempre relaxado"
          ]
        }
      ],
      duration: "45-50 min",
      estimatedCalories: baseCalories,
      totalSets: 11,
      difficulty: "Intermediário",
      focus: ["Condicionamento Geral", "Força Funcional", "Flexibilidade"]
    }
  },

  generateStructuredWeeklyPlan(
    user: StoredUser,
    frequency: number,
    intensity: "low" | "medium" | "high",
    distribution: "sequential" | "alternating"
  ): any {
    console.log("[v0] Generating structured weekly plan")
    
    const getWorkoutDays = () => {
      const allDays = ["segunda", "terça", "quarta", "quinta", "sexta"]
      
      if (distribution === "alternating") {
        const alternatingDays = []
        let dayIndex = 0
        for (let i = 0; i < frequency && dayIndex < allDays.length; i++) {
          alternatingDays.push(allDays[dayIndex])
          dayIndex += 2
        }
        return alternatingDays
      } else {
        return allDays.slice(0, frequency)
      }
    }

    const workoutDays = getWorkoutDays()
    const weeklyPlan: any = {}

    // Configurações baseadas na intensidade
    const intensityConfig = {
      low: { sets: 2, reps: "12-15", rest: 45, calories: 250 },
      medium: { sets: 3, reps: "10-12", rest: 60, calories: 320 },
      high: { sets: 4, reps: "8-10", rest: 75, calories: 400 }
    }

    const config = intensityConfig[intensity]

    // Divisões de treino baseadas na frequência
    const workoutSplits = {
      3: [
        { name: "Peito e Tríceps", focus: ["Peitoral", "Tríceps"], exercises: this.getChestTricepsExercises(config) },
        { name: "Costas e Bíceps", focus: ["Costas", "Bíceps"], exercises: this.getBackBicepsExercises(config) },
        { name: "Pernas e Core", focus: ["Pernas", "Core"], exercises: this.getLegsExercises(config) }
      ],
      4: [
        { name: "Peito e Tríceps", focus: ["Peitoral", "Tríceps"], exercises: this.getChestTricepsExercises(config) },
        { name: "Costas e Bíceps", focus: ["Costas", "Bíceps"], exercises: this.getBackBicepsExercises(config) },
        { name: "Pernas", focus: ["Pernas"], exercises: this.getLegsExercises(config) },
        { name: "Ombros e Core", focus: ["Ombros", "Core"], exercises: this.getShouldersExercises(config) }
      ],
      5: [
        { name: "Peito", focus: ["Peitoral"], exercises: this.getChestExercises(config) },
        { name: "Costas", focus: ["Costas"], exercises: this.getBackExercises(config) },
        { name: "Pernas", focus: ["Pernas"], exercises: this.getLegsExercises(config) },
        { name: "Ombros", focus: ["Ombros"], exercises: this.getShouldersExercises(config) },
        { name: "Funcional", focus: ["Funcional"], exercises: this.getFunctionalExercises(config) }
      ]
    }

    const splits = workoutSplits[frequency as keyof typeof workoutSplits] || workoutSplits[3]

    workoutDays.forEach((day, index) => {
      const split = splits[index % splits.length]
      const baseCalories = Number.parseInt(user.peso) * 4.5
      
      weeklyPlan[day] = {
        name: `${this.getDayName(day)} - ${split.name}`,
        exercises: split.exercises,
        duration: intensity === "low" ? "35-40 min" : intensity === "medium" ? "45-50 min" : "55-60 min",
        estimatedCalories: Math.round(baseCalories * (intensity === "low" ? 0.8 : intensity === "medium" ? 1.0 : 1.2)),
        totalSets: split.exercises.reduce((sum, ex) => sum + ex.sets, 0),
        difficulty: user.nivelCondicionamento || "Intermediário",
        focus: split.focus
      }
    })

    console.log("[v0] Weekly plan generated for days:", workoutDays)
    return weeklyPlan
  },

  getDayName(day: string): string {
    const dayNames: { [key: string]: string } = {
      segunda: "Segunda-feira",
      terça: "Terça-feira", 
      quarta: "Quarta-feira",
      quinta: "Quinta-feira",
      sexta: "Sexta-feira"
    }
    return dayNames[day] || day
  },

  getChestTricepsExercises(config: any) {
    return [
      {
        name: "Flexão de Braço",
        description: "Exercício fundamental para peito e tríceps usando peso corporal.",
        sets: config.sets,
        reps: config.reps,
        restTime: config.rest,
        muscleGroups: ["Peitoral", "Tríceps"],
        difficulty: "Intermediário",
        instructions: [
          "Posição de prancha com mãos na largura dos ombros",
          "Desça controladamente até o peito quase tocar o chão",
          "Empurre com força para voltar à posição inicial"
        ],
        tips: ["Mantenha corpo alinhado", "Se difícil, apoie os joelhos"]
      },
      {
        name: "Mergulho em Cadeira",
        description: "Exercício para tríceps usando cadeira ou banco como apoio.",
        sets: config.sets,
        reps: config.reps,
        restTime: config.rest,
        muscleGroups: ["Tríceps", "Ombros"],
        difficulty: "Intermediário",
        instructions: [
          "Sente na borda da cadeira com mãos apoiadas",
          "Deslize o corpo para frente",
          "Desça flexionando os cotovelos",
          "Empurre para cima usando os tríceps"
        ],
        tips: ["Mantenha cotovelos próximos ao corpo", "Não desça muito se sentir desconforto"]
      }
    ]
  },

  getBackBicepsExercises(config: any) {
    return [
      {
        name: "Remada com Garrafa d'Água",
        description: "Exercício para costas usando garrafas d'água como peso.",
        sets: config.sets,
        reps: config.reps,
        restTime: config.rest,
        muscleGroups: ["Costas", "Bíceps"],
        difficulty: "Iniciante",
        instructions: [
          "Incline o tronco para frente",
          "Segure garrafas com os braços estendidos",
          "Puxe os cotovelos para trás",
          "Aperte as escápulas no final do movimento"
        ],
        tips: ["Mantenha core contraído", "Não balance o corpo"]
      },
      {
        name: "Superman",
        description: "Exercício para fortalecimento das costas e glúteos.",
        sets: config.sets,
        reps: config.reps,
        restTime: config.rest,
        muscleGroups: ["Costas", "Glúteos"],
        difficulty: "Iniciante",
        instructions: [
          "Deite de bruços no chão",
          "Estenda braços à frente",
          "Levante peito e pernas simultaneamente",
          "Mantenha por 2 segundos e desça"
        ],
        tips: ["Não force o pescoço", "Movimento controlado"]
      }
    ]
  },

  getLegsExercises(config: any) {
    return [
      {
        name: "Agachamento",
        description: "Exercício rei para pernas e glúteos.",
        sets: config.sets,
        reps: config.reps,
        restTime: config.rest,
        muscleGroups: ["Quadríceps", "Glúteos"],
        difficulty: "Intermediário",
        instructions: [
          "Pés na largura dos ombros",
          "Desça como se fosse sentar",
          "Mantenha peito erguido",
          "Suba empurrando o chão"
        ],
        tips: ["Peso nos calcanhares", "Joelhos alinhados com os pés"]
      },
      {
        name: "Afundo",
        description: "Exercício unilateral para pernas e equilíbrio.",
        sets: config.sets,
        reps: `${config.reps} cada perna`,
        restTime: config.rest,
        muscleGroups: ["Quadríceps", "Glúteos"],
        difficulty: "Intermediário",
        instructions: [
          "Passo à frente",
          "Desça o joelho traseiro",
          "Mantenha tronco ereto",
          "Volte à posição inicial"
        ],
        tips: ["Joelho não passa da ponta do pé", "Use parede para apoio se necessário"]
      }
    ]
  },

  getShouldersExercises(config: any) {
    return [
      {
        name: "Elevação Lateral com Garrafas",
        description: "Exercício para ombros usando garrafas d'água.",
        sets: config.sets,
        reps: config.reps,
        restTime: config.rest,
        muscleGroups: ["Ombros"],
        difficulty: "Iniciante",
        instructions: [
          "Segure garrafas ao lado do corpo",
          "Levante os braços lateralmente",
          "Pare na altura dos ombros",
          "Desça controladamente"
        ],
        tips: ["Não balance o corpo", "Movimento controlado"]
      },
      {
        name: "Prancha",
        description: "Exercício isométrico para core.",
        sets: config.sets,
        reps: "30-60s",
        restTime: config.rest,
        muscleGroups: ["Core"],
        difficulty: "Iniciante",
        instructions: [
          "Apoie antebraços e pés",
          "Corpo em linha reta",
          "Contraia abdômen",
          "Respire normalmente"
        ],
        tips: ["Não deixe quadril subir", "Qualidade sobre tempo"]
      }
    ]
  },

  getChestExercises(config: any) {
    return this.getChestTricepsExercises(config)
  },

  getBackExercises(config: any) {
    return this.getBackBicepsExercises(config)
  },

  getFunctionalExercises(config: any) {
    return [
      {
        name: "Burpee Modificado",
        description: "Exercício funcional completo adaptado.",
        sets: config.sets,
        reps: "8-10",
        restTime: config.rest,
        muscleGroups: ["Corpo Todo"],
        difficulty: "Avançado",
        instructions: [
          "Agache e apoie as mãos",
          "Estenda as pernas para trás",
          "Volte à posição de agachamento",
          "Levante-se (sem pular se for iniciante)"
        ],
        tips: ["Adapte conforme seu nível", "Mantenha ritmo constante"]
      },
      {
        name: "Prancha Dinâmica",
        description: "Variação da prancha com movimento.",
        sets: config.sets,
        reps: "10-12",
        restTime: config.rest,
        muscleGroups: ["Core", "Ombros"],
        difficulty: "Intermediário",
        instructions: [
          "Comece em prancha",
          "Suba para apoio nas mãos",
          "Volte para antebraços",
          "Alterne o braço que inicia"
        ],
        tips: ["Movimento controlado", "Mantenha quadril estável"]
      }
    ]
  }
}