import { GoogleGenerativeAI } from "@google/generative-ai"
import type { StoredUser } from "@/lib/user-storage"

const genAI = new GoogleGenerativeAI("AIzaSyDBQMG83aOtmBStInIfeMN1sSg4jAJSmW0")

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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
Você é um personal trainer virtual ESPECIALISTA com 15+ anos de experiência, responsável por criar treinos personalizados de ALTA QUALIDADE. Você deve analisar profundamente cada aspecto do perfil do aluno e criar um treino que seja SEGURO, EFICAZ e PROGRESSIVO.

ANÁLISE DETALHADA DO ALUNO:
- Nome: ${user.nome}
- Idade: ${user.idade} anos
  * Se 18-25 anos: Foco em desenvolvimento muscular e força, recuperação rápida
  * Se 26-35 anos: Equilibrio entre força e resistência, atenção à postura
  * Se 36-45 anos: Priorizar mobilidade, prevenção de lesões, exercícios funcionais
  * Se 46+ anos: Enfase em estabilidade, baixo impacto, fortalecimento do core
- Peso: ${user.peso}kg (Calcular IMC e ajustar intensidade)
- Altura: ${user.altura}cm
- Frequência atual: ${user.frequenciaExercicio}
- Tipos preferidos: ${user.tipoTreino.join(", ")}
- Objetivos: ${user.objetivos.join(", ")}
- Limitações: ${user.limitacoesFisicas || "Nenhuma"}
- Condicionamento: ${user.nivelCondicionamento}

PROTOCOLO DE INTENSIDADE CIENTÍFICA:
${
  user.nivelCondicionamento === "Iniciante"
    ? `
- INICIANTE (Adaptação Anatômica - 4-6 semanas):
  * Repetições: 12-15 (aprendizado motor)
  * Descanso: 60-90s (recuperação completa)
  * Séries: 2-3 (volume moderado)
  * Carga: 50-65% 1RM estimado
  * Foco: Técnica perfeita, estabilização, mobilidade
`
    : user.nivelCondicionamento === "Intermediário"
      ? `
- INTERMEDIÁRIO (Hipertrofia/Força - 6-8 semanas):
  * Repetições: 8-12 (zona de hipertrofia)
  * Descanso: 60-90s (otimização metabólica)
  * Séries: 3-4 (volume progressivo)
  * Carga: 65-80% 1RM estimado
  * Foco: Sobrecarga progressiva, variação de estímulos
`
      : `
- AVANÇADO (Especialização - 8-12 semanas):
  * Repetições: 6-8 (força máxima) ou 12-15 (resistência)
  * Descanso: 90-120s (recuperação neural)
  * Séries: 4-5 (alto volume)
  * Carga: 80-90% 1RM estimado
  * Foco: Periodização, técnicas avançadas, especificidade
`
}

ESTRUTURA CIENTÍFICA DO TREINO:
1. AQUECIMENTO ESPECÍFICO (8-12 min):
   - Ativação cardiovascular: 3-5 min (FC 60-70% máx)
   - Mobilidade articular: 2-3 min (principais articulações)
   - Ativação neuromuscular: 3-4 min (movimentos específicos)

2. TREINO PRINCIPAL (35-45 min):
   - Exercícios compostos primeiro (maior demanda neural)
   - Progressão: Grande → Pequenos grupos musculares
   - 6-8 exercícios balanceados
   - Alternância: Agonista/Antagonista quando possível

3. FINALIZAÇÃO (8-12 min):
   - Cardio específico: ${user.tipoTreino.includes("cardio") ? "15-20 min zona aeróbica" : "5-8 min recuperação ativa"}
   - Alongamento estático: 5-7 min (músculos trabalhados)

CONSIDERAÇÕES BIOMECÂNICAS E FISIOLÓGICAS:
- Idade ${user.idade} anos: ${Number.parseInt(user.idade) > 40 ? "Priorizar exercícios de baixo impacto, fortalecer estabilizadores, atenção especial à coluna vertebral" : "Pode incluir exercícios de alto impacto, foco em desenvolvimento de força e potência"}
- Peso ${user.peso}kg: ${Number.parseInt(user.peso) > 90 ? "Reduzir impacto articular, priorizar exercícios sentados/apoiados, progressão gradual" : "Pode incluir exercícios de peso corporal e impacto moderado"}
- Limitações: ${user.limitacoesFisicas || "Nenhuma"} - ${user.limitacoesFisicas ? "ADAPTAR TODOS OS EXERCÍCIOS para evitar agravamento" : "Sem restrições específicas"}

PRESCRIÇÃO PERSONALIZADA:
- Volume semanal ideal: ${user.frequenciaExercicio === "3x" ? "12-16 séries por grupo muscular" : user.frequenciaExercicio === "4x" ? "16-20 séries" : "20-24 séries"}
- Densidade: ${user.nivelCondicionamento === "Iniciante" ? "Baixa (mais descanso)" : user.nivelCondicionamento === "Intermediário" ? "Moderada" : "Alta (superseries, circuitos)"}
- Progressão: Aumentar 2.5-5% carga/semana ou +1 rep/série

FORMATO DE RESPOSTA OBRIGATÓRIO (JSON):
{
  "name": "Treino Personalizado - [Foco Principal]",
  "exercises": [
    {
      "name": "Nome Técnico do Exercício",
      "description": "Descrição biomecânica detalhada, músculos primários e secundários, benefícios específicos para o perfil do aluno",
      "sets": [número baseado no protocolo],
      "reps": "[faixa específica baseada no objetivo]",
      "restTime": [tempo em segundos baseado na intensidade],
      "muscleGroups": ["Músculo Primário", "Músculo Secundário"],
      "difficulty": "[Iniciante/Intermediário/Avançado]",
      "instructions": [
        "Posição inicial detalhada com pontos anatômicos",
        "Fase concêntrica (movimento principal) com respiração",
        "Fase excêntrica (retorno) controlada",
        "Pontos de atenção para execução perfeita",
        "Variações para progressão/regressão"
      ],
      "tips": [
        "Dica de segurança específica para a idade/condição",
        "Erro comum a evitar baseado no perfil",
        "Como progredir no exercício",
        "Sinal de que deve parar/modificar"
      ]
    }
  ],
  "duration": "[tempo total baseado no protocolo]",
  "estimatedCalories": [cálculo baseado em peso, idade, intensidade],
  "totalSets": [soma de todas as séries],
  "difficulty": "[nível do usuário]",
  "focus": ["Objetivo Primário", "Objetivo Secundário", "Benefício Adicional"]
}

VALIDAÇÃO FINAL:
- Todos os exercícios são seguros para a idade ${user.idade}?
- O volume total é apropriado para ${user.nivelCondicionamento}?
- As limitações ${user.limitacoesFisicas || "inexistentes"} foram consideradas?
- A progressão está clara e mensurável?

Crie um treino EXCEPCIONAL que transforme a vida deste aluno. Responda APENAS com o JSON válido, sem texto adicional.
`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Clean the response to extract only JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from Gemini")
      }

      const workoutPlan = JSON.parse(jsonMatch[0])
      return workoutPlan
    } catch (error) {
      console.error("Error generating workout with Gemini:", error)

      // Fallback workout if Gemini fails
      return {
        name: "Treino Personalizado",
        exercises: [
          {
            name: "Caminhada na Esteira",
            description: "Aquecimento cardiovascular",
            sets: 1,
            reps: "10 min",
            restTime: 0,
            muscleGroups: ["Cardiovascular"],
            difficulty: "Iniciante",
            instructions: [
              "Mantenha postura ereta",
              "Comece devagar e aumente gradualmente",
              "Respire de forma controlada",
            ],
            tips: ["Hidrate-se durante o exercício", "Use tênis adequado"],
          },
          {
            name: "Agachamento Livre",
            description: "Exercício para pernas e glúteos",
            sets: 3,
            reps: "12-15",
            restTime: 60,
            muscleGroups: ["Quadríceps", "Glúteos"],
            difficulty: "Intermediário",
            instructions: ["Pés na largura dos ombros", "Desça até 90 graus", "Mantenha o peito ereto"],
            tips: ["Não deixe os joelhos passarem da ponta dos pés", "Controle a descida"],
          },
        ],
        duration: "45 min",
        estimatedCalories: 300,
        totalSets: 4,
        difficulty: "Intermediário",
        focus: ["Condicionamento Geral"],
      }
    }
  },

  async generateWeeklyWorkout(
    user: StoredUser,
    intensity: "low" | "medium" | "high" = "medium",
    distribution: "sequential" | "alternating" = "sequential",
  ): Promise<any> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const frequency = user.frequenciaDesejada
      ? Number.parseInt(user.frequenciaDesejada)
      : user.frequenciaSemanal
        ? Number.parseInt(user.frequenciaSemanal)
        : 3

    const intensitySettings = {
      low: {
        reps: "12-15",
        rest: "45-60s",
        sets: "2-3",
        cardio: "20-25 min baixa intensidade",
        load: "50-65% 1RM",
        description: "Foco em aprendizado motor e condicionamento base",
      },
      medium: {
        reps: "8-12",
        rest: "60-90s",
        sets: "3-4",
        cardio: "25-30 min moderada intensidade",
        load: "65-80% 1RM",
        description: "Zona de hipertrofia e força moderada",
      },
      high: {
        reps: "6-8",
        rest: "90-120s",
        sets: "4-5",
        cardio: "15-20 min alta intensidade HIIT",
        load: "80-90% 1RM",
        description: "Força máxima e condicionamento avançado",
      },
    }

    const settings = intensitySettings[intensity]

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
    const distributionText =
      distribution === "alternating"
        ? "DIAS ALTERNADOS (com descanso entre treinos)"
        : "DIAS SEQUENCIAIS (consecutivos)"

    const prompt = `
Você é um personal trainer ESPECIALISTA em periodização e deve criar um PLANO SEMANAL CIENTÍFICO de ${frequency} treinos para ${distributionText}.

PERFIL COMPLETO DO ALUNO:
- Nome: ${user.nome}
- Idade: ${user.idade} anos (Considerar capacidade de recuperação e adaptações fisiológicas)
- Peso: ${user.peso}kg | Altura: ${user.altura}cm
- Frequência: ${frequency}x por semana em ${distributionText}
- Tipos preferidos: ${user.tipoTreino.join(", ")}
- Objetivos: ${user.objetivos.join(", ")}
- Limitações: ${user.limitacoesFisicas || "Nenhuma"}
- Nível: ${user.nivelCondicionamento}

PROTOCOLO DE INTENSIDADE SELECIONADO: ${intensity.toUpperCase()}
${settings.description}
- Repetições: ${settings.reps}
- Descanso: ${settings.rest}
- Séries: ${settings.sets}
- Carga: ${settings.load}
- Cardio: ${settings.cardio}

DIVISÃO CIENTÍFICA PARA ${frequency} TREINOS (${distributionText}):
${
  frequency === 3
    ? `
DIVISÃO ABC (3x semana):
- DIA 1: Peito + Tríceps + Ombro Anterior
- DIA 2: Costas + Bíceps + Ombro Posterior  
- DIA 3: Pernas + Glúteos + Core
`
    : frequency === 4
      ? `
DIVISÃO ABCD (4x semana):
- DIA 1: Peito + Tríceps
- DIA 2: Costas + Bíceps
- DIA 3: Pernas + Glúteos
- DIA 4: Ombros + Core + Cardio
`
      : `
DIVISÃO ABCDE (5x semana):
- DIA 1: Peito + Tríceps
- DIA 2: Costas + Bíceps
- DIA 3: Pernas + Glúteos
- DIA 4: Ombros + Trapézio
- DIA 5: Core + Funcional + Cardio
`
}

DIAS DE TREINO: ${workoutDays.join(", ")}
${distribution === "alternating" ? "VANTAGEM DOS DIAS ALTERNADOS: Melhor recuperação muscular, redução do overtraining, maior qualidade de cada sessão." : "VANTAGEM DOS DIAS SEQUENCIAIS: Melhor aderência, rotina consistente, aproveitamento da adaptação neural."}

ESTRUTURA OBRIGATÓRIA PARA CADA DIA:
1. AQUECIMENTO ESPECÍFICO (8-10 min)
2. EXERCÍCIOS PRINCIPAIS (6-8 exercícios por dia)
3. CARDIO DIRECIONADO (conforme intensidade)
4. ALONGAMENTO ESPECÍFICO (5-8 min)

CONSIDERAÇÕES ESPECIAIS:
- Idade ${user.idade}: ${Number.parseInt(user.idade) > 40 ? "Aquecimento mais longo, exercícios de baixo impacto, foco em mobilidade" : "Pode incluir exercícios explosivos e de alta intensidade"}
- Distribuição ${distributionText}: ${distribution === "alternating" ? "Treinos mais intensos (mais volume por sessão)" : "Treinos moderados (distribuir volume)"}
- Recuperação: ${distribution === "alternating" ? "48h entre sessões permite recuperação completa" : "24h entre sessões requer gestão de fadiga"}

FORMATO JSON OBRIGATÓRIO:
{
${workoutDays
  .map((day, index) => {
    const dayNames = {
      segunda: "Segunda-feira",
      terça: "Terça-feira",
      quarta: "Quarta-feira",
      quinta: "Quinta-feira",
      sexta: "Sexta-feira",
    }

    const focuses =
      frequency === 3
        ? [
            ["Peitoral", "Tríceps"],
            ["Costas", "Bíceps"],
            ["Pernas", "Glúteos"],
          ]
        : frequency === 4
          ? [
              ["Peitoral", "Tríceps"],
              ["Costas", "Bíceps"],
              ["Pernas", "Glúteos"],
              ["Ombros", "Core"],
            ]
          : [
              ["Peitoral", "Tríceps"],
              ["Costas", "Bíceps"],
              ["Pernas", "Glúteos"],
              ["Ombros", "Trapézio"],
              ["Funcional", "Cardio"],
            ]

    return `  "${day}": {
    "name": "${dayNames[day]} - ${focuses[index]?.join(" e ") || "Treino Completo"}",
    "exercises": [
      {
        "name": "Exercício Específico para ${focuses[index]?.[0] || "Corpo Todo"}",
        "description": "Descrição biomecânica detalhada",
        "sets": ${settings.sets.split("-")[0]},
        "reps": "${settings.reps}",
        "restTime": ${settings.rest.split("-")[0].replace("s", "")},
        "muscleGroups": ${JSON.stringify(focuses[index] || ["Corpo Todo"])},
        "difficulty": "${user.nivelCondicionamento}",
        "instructions": [
          "Instrução técnica detalhada 1",
          "Instrução técnica detalhada 2",
          "Instrução técnica detalhada 3",
          "Instrução técnica detalhada 4"
        ],
        "tips": [
          "Dica de segurança específica",
          "Erro comum a evitar",
          "Como progredir"
        ]
      }
    ],
    "duration": "50-60 min",
    "estimatedCalories": ${350 + index * 25},
    "totalSets": ${Number.parseInt(settings.sets.split("-")[1] || settings.sets) * 7},
    "difficulty": "${user.nivelCondicionamento}",
    "focus": ${JSON.stringify(focuses[index] || ["Condicionamento Geral"])}
  }`
  })
  .join(",\n")}
}

VALIDAÇÃO FINAL:
- Cada dia tem foco muscular específico sem sobreposição excessiva?
- O volume total respeita a capacidade de recuperação para ${distributionText}?
- A intensidade ${intensity} está adequada para ${user.nivelCondicionamento}?
- As limitações ${user.limitacoesFisicas || "inexistentes"} foram consideradas?

Crie um plano semanal EXCEPCIONAL e CIENTÍFICO. Responda APENAS com o JSON válido, sem texto adicional.
`

    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Clean the response to extract only JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from Gemini")
      }

      const weeklyPlan = JSON.parse(jsonMatch[0])
      return weeklyPlan
    } catch (error) {
      console.error("Error generating weekly workout with Gemini:", error)

      // Fallback weekly plan if Gemini fails
      return {
        segunda: {
          name: "Peito e Tríceps",
          exercises: [
            {
              name: "Supino Reto",
              description: "Exercício fundamental para peitoral",
              sets: 3,
              reps: settings.reps,
              restTime: 60,
              muscleGroups: ["Peitoral", "Tríceps"],
              difficulty: user.nivelCondicionamento,
              instructions: ["Deite no banco", "Segure a barra", "Desça controladamente", "Empurre para cima"],
              tips: ["Mantenha ombros retraídos", "Não quique no peito"],
            },
          ],
          duration: "50 min",
          estimatedCalories: 400,
          totalSets: 24,
          difficulty: user.nivelCondicionamento,
          focus: ["Peitoral", "Tríceps"],
        },
        terça: {
          name: "Costas e Bíceps",
          exercises: [
            {
              name: "Puxada Frontal",
              description: "Exercício para desenvolvimento das costas",
              sets: 3,
              reps: settings.reps,
              restTime: 60,
              muscleGroups: ["Costas", "Bíceps"],
              difficulty: user.nivelCondicionamento,
              instructions: ["Sente-se no equipamento", "Segure a barra", "Puxe até o peito", "Controle a subida"],
              tips: ["Mantenha peito erguido", "Aperte as escápulas"],
            },
          ],
          duration: "50 min",
          estimatedCalories: 380,
          totalSets: 24,
          difficulty: user.nivelCondicionamento,
          focus: ["Costas", "Bíceps"],
        },
        quarta: {
          name: "Pernas e Glúteos",
          exercises: [
            {
              name: "Agachamento",
              description: "Exercício composto para pernas",
              sets: 4,
              reps: settings.reps,
              restTime: 90,
              muscleGroups: ["Quadríceps", "Glúteos"],
              difficulty: user.nivelCondicionamento,
              instructions: [
                "Pés na largura dos ombros",
                "Desça flexionando quadris",
                "Mantenha peito erguido",
                "Suba empurrando o chão",
              ],
              tips: ["Não deixe joelhos passarem dos pés", "Desça até 90 graus"],
            },
          ],
          duration: "55 min",
          estimatedCalories: 450,
          totalSets: 28,
          difficulty: user.nivelCondicionamento,
          focus: ["Quadríceps", "Glúteos"],
        },
        quinta: {
          name: "Ombros e Abdômen",
          exercises: [
            {
              name: "Desenvolvimento com Halteres",
              description: "Exercício para ombros",
              sets: 3,
              reps: settings.reps,
              restTime: 60,
              muscleGroups: ["Ombros"],
              difficulty: user.nivelCondicionamento,
              instructions: ["Sente-se no banco", "Segure os halteres", "Empurre para cima", "Desça controladamente"],
              tips: ["Não trave os cotovelos", "Mantenha core contraído"],
            },
          ],
          duration: "45 min",
          estimatedCalories: 350,
          totalSets: 22,
          difficulty: user.nivelCondicionamento,
          focus: ["Ombros", "Abdômen"],
        },
        sexta: {
          name: "Treino Funcional",
          exercises: [
            {
              name: "Burpees",
              description: "Exercício funcional completo",
              sets: 3,
              reps: "10-12",
              restTime: 45,
              muscleGroups: ["Corpo Todo"],
              difficulty: user.nivelCondicionamento,
              instructions: ["Agache e apoie as mãos", "Estenda as pernas", "Flexão", "Volte e pule"],
              tips: ["Mantenha ritmo constante", "Respire adequadamente"],
            },
          ],
          duration: "40 min",
          estimatedCalories: 400,
          totalSets: 20,
          difficulty: user.nivelCondicionamento,
          focus: ["Funcional", "Cardio"],
        },
      }
    }
  },
}
