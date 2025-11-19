"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react'

// Sample data for charts
const monthlySessionsData = [
  { month: "Jan", sessions: 15 },
  { month: "Fev", sessions: 18 },
  { month: "Mar", sessions: 22 },
  { month: "Abr", sessions: 20 },
  { month: "Mai", sessions: 25 },
  { month: "Jun", sessions: 28 },
  { month: "Jul", sessions: 30 },
  { month: "Ago", sessions: 27 },
  { month: "Set", sessions: 32 },
  { month: "Out", sessions: 35 },
  { month: "Nov", sessions: 12 },
]

const patientGrowthData = [
  { month: "Jan", patients: 1 },
  { month: "Fev", patients: 2 },
  { month: "Mar", patients: 3 },
  { month: "Abr", patients: 3 },
  { month: "Mai", patients: 3 },
  { month: "Jun", patients: 3 },
  { month: "Jul", patients: 3 },
  { month: "Ago", patients: 3 },
  { month: "Set", patients: 3 },
  { month: "Out", patients: 3 },
  { month: "Nov", patients: 3 },
]

const diagnosisDistribution = [
  { name: "Ansiedade", value: 35, color: "#00aa6f" },
  { name: "Depressão", value: 28, color: "#6cbec2" },
  { name: "Fobias", value: 20, color: "#89cbcd" },
  { name: "Estresse", value: 12, color: "#a0d4d6" },
  { name: "Outros", value: 5, color: "#b5e0e1" },
]

const averageMoodData = [
  { week: "Sem 1", mood: 6.2 },
  { week: "Sem 2", mood: 6.5 },
  { week: "Sem 3", mood: 6.8 },
  { week: "Sem 4", mood: 7.0 },
  { week: "Sem 5", mood: 7.2 },
  { week: "Sem 6", mood: 7.4 },
  { week: "Sem 7", mood: 7.5 },
  { week: "Sem 8", mood: 7.3 },
]

export default function RelatoriosPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">Análise e estatísticas da sua prática clínica</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+0% desde último mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões este Ano</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">267</div>
              <p className="text-xs text-muted-foreground">Média de 24/mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Comparecimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">+2% desde último mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humor Médio Geral</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.3/10</div>
              <p className="text-xs text-muted-foreground">Tendência positiva</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="mood">Humor</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnósticos</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sessões por Mês</CardTitle>
                <CardDescription>Número de sessões realizadas em cada mês do ano</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlySessionsData}>
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-xs text-muted-foreground">Sessões:</span>
                                <span className="text-xs font-bold">{payload[0].value}</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="sessions" fill="#00aa6f" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Pacientes</CardTitle>
                <CardDescription>Evolução do número de pacientes ativos ao longo do ano</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={patientGrowthData}>
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-xs text-muted-foreground">Pacientes:</span>
                                <span className="text-xs font-bold">{payload[0].value}</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke="#6cbec2"
                      strokeWidth={2}
                      dot={{ fill: "#6cbec2", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mood" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Humor</CardTitle>
                <CardDescription>Humor médio de todos os pacientes nas últimas 8 semanas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={averageMoodData}>
                    <XAxis
                      dataKey="week"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 10]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-xs text-muted-foreground">Humor:</span>
                                <span className="text-xs font-bold">{payload[0].value}/10</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#89cbcd"
                      strokeWidth={3}
                      dot={{ fill: "#89cbcd", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnosis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Diagnósticos</CardTitle>
                <CardDescription>Porcentagem de cada tipo de diagnóstico na sua prática</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={diagnosisDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {diagnosisDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
                                <div className="grid gap-1">
                                  <span className="text-xs font-medium">{payload[0].name}</span>
                                  <span className="text-xs text-muted-foreground">{payload[0].value}%</span>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col justify-center space-y-3">
                    {diagnosisDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
