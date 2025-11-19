"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"

// Sample treatment plans data
const treatmentPlans = [
  {
    id: "1",
    patientId: "1",
    patientName: "Maria Silva",
    diagnosis: "Transtorno de Ansiedade Generalizada",
    approach: "Terapia Cognitivo-Comportamental",
    startDate: "2024-01-10",
    estimatedDuration: "6 meses",
    progress: 65,
    status: "active",
    goals: [
      { id: "1", text: "Reduzir sintomas de ansiedade em situações sociais", completed: true },
      { id: "2", text: "Desenvolver técnicas de enfrentamento eficazes", completed: true },
      { id: "3", text: "Melhorar qualidade do sono", completed: false },
      { id: "4", text: "Fortalecer autoestima e confiança", completed: false },
    ],
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Carlos Santos",
    diagnosis: "Depressão Leve a Moderada",
    approach: "Terapia Interpessoal",
    startDate: "2024-02-05",
    estimatedDuration: "4 meses",
    progress: 45,
    status: "active",
    goals: [
      { id: "1", text: "Identificar padrões de pensamento negativo", completed: true },
      { id: "2", text: "Melhorar relacionamentos interpessoais", completed: false },
      { id: "3", text: "Aumentar atividades prazerosas", completed: false },
      { id: "4", text: "Estabelecer rotina saudável", completed: false },
    ],
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Ana Paula Costa",
    diagnosis: "Fobia Social",
    approach: "Terapia de Aceitação e Compromisso",
    startDate: "2024-03-20",
    estimatedDuration: "8 meses",
    progress: 30,
    status: "active",
    goals: [
      { id: "1", text: "Aceitar pensamentos e sentimentos desconfortáveis", completed: true },
      { id: "2", text: "Identificar valores pessoais", completed: false },
      { id: "3", text: "Realizar ações alinhadas com valores", completed: false },
      { id: "4", text: "Participar de eventos sociais", completed: false },
    ],
  },
]

export default function PlanosPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Planos Terapêuticos</h1>
            <p className="text-muted-foreground mt-1">Acompanhe o progresso dos tratamentos</p>
          </div>
          <Button asChild>
            <Link href="/planos/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{treatmentPlans.filter((p) => p.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(treatmentPlans.reduce((acc, plan) => acc + plan.progress, 0) / treatmentPlans.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Todos os planos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objetivos Alcançados</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {treatmentPlans.reduce((acc, plan) => acc + plan.goals.filter((g) => g.completed).length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                de {treatmentPlans.reduce((acc, plan) => acc + plan.goals.length, 0)} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Treatment Plans List */}
        <div className="space-y-4">
          {treatmentPlans.map((plan) => (
            <Card key={plan.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {plan.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.patientName}</CardTitle>
                        <CardDescription>{plan.diagnosis}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Abordagem Terapêutica</p>
                    <p className="text-sm text-muted-foreground">{plan.approach}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Duração Estimada</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {plan.estimatedDuration}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progresso</span>
                    <span className="text-muted-foreground">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Objetivos Terapêuticos</p>
                  <div className="space-y-2">
                    {plan.goals.map((goal) => (
                      <div key={goal.id} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 mt-0.5 ${goal.completed ? "text-primary" : "text-muted-foreground"}`}
                        />
                        <span className={`text-sm ${goal.completed ? "line-through text-muted-foreground" : ""}`}>
                          {goal.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/planos/${plan.id}`}>Ver Detalhes Completos</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
