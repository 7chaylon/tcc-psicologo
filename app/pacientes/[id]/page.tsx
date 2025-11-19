"use client"

import type React from "react"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Phone, Mail, User, Smile, Frown, Activity, Wind, Flame, Search, X } from 'lucide-react'
import Link from "next/link"
import { useState, useMemo } from "react"
import { useParams } from 'next/navigation'
import { mockDailyReports } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"

const getFeelingEmoji = (feeling: string) => {
  const emojiMap: Record<string, React.ReactNode> = {
    feliz: <Smile className="h-5 w-5 text-green-500" />,
    triste: <Frown className="h-5 w-5 text-blue-500" />,
    ansioso: <Activity className="h-5 w-5 text-yellow-500" />,
    calmo: <Wind className="h-5 w-5 text-cyan-500" />,
    raiva: <Flame className="h-5 w-5 text-red-500" />,
  }
  return emojiMap[feeling] || <Smile className="h-5 w-5" />
}

const getFeelingColor = (feeling: string) => {
  const colorMap: Record<string, string> = {
    feliz: "bg-green-500/10 text-green-700 border-green-200",
    triste: "bg-blue-500/10 text-blue-700 border-blue-200",
    ansioso: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    calmo: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
    raiva: "bg-red-500/10 text-red-700 border-red-200",
  }
  return colorMap[feeling] || "bg-gray-500/10 text-gray-700 border-gray-200"
}

export default function PatientDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const { patients } = useAppStore()
  const patient = patients.find(p => p.id === id)

  if (!patient) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Paciente não encontrado</CardTitle>
              <CardDescription>O paciente solicitado não existe.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/pacientes">Voltar para lista de pacientes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [editedName, setEditedName] = useState(patient.name)
  const [editedEmail, setEditedEmail] = useState(patient.email)
  const [editedPhone, setEditedPhone] = useState(patient.phone)
  const [editedDateOfBirth, setEditedDateOfBirth] = useState(patient.dateOfBirth)

  const mockSessions = [
    {
      id: "1",
      date: "2024-11-01",
      notes: "Paciente relatou melhora significativa nos sintomas de ansiedade. Discutimos técnicas de respiração.",
      mood: 8,
    },
    {
      id: "2",
      date: "2024-10-18",
      notes: "Sessão focada em identificação de pensamentos automáticos negativos. Homework: diário de pensamentos.",
      mood: 6,
    },
    {
      id: "3",
      date: "2024-10-04",
      notes: "Introdução à técnica de reestruturação cognitiva. Paciente demonstrou boa compreensão.",
      mood: 7,
    },
  ]

  const [editedSessions, setEditedSessions] = useState(mockSessions)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)

  const [editedDiagnosis, setEditedDiagnosis] = useState("Transtorno de Ansiedade Generalizada")
  const [editedTreatment, setEditedTreatment] = useState("Terapia Cognitivo-Comportamental")
  const [editedGoals, setEditedGoals] = useState([
    "Reduzir sintomas de ansiedade em situações sociais",
    "Desenvolver técnicas de enfrentamento eficazes",
    "Melhorar qualidade do sono",
    "Fortalecer autoestima e confiança",
  ])
  const [isEditingTreatment, setIsEditingTreatment] = useState(false)

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTag, setSearchTag] = useState("")

  const patientReports = mockDailyReports.filter((report) => report.patientId === id)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    patientReports.forEach((report) => {
      report.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [patientReports])

  const filteredReports = useMemo(() => {
    if (selectedTags.length === 0) return patientReports
    return patientReports.filter((report) => selectedTags.some((selectedTag) => report.tags.includes(selectedTag)))
  }, [patientReports, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSearchTag("")
  }

  const filteredTagOptions = useMemo(() => {
    if (!searchTag) return allTags
    return allTags.filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
  }, [allTags, searchTag])

  const updateSessionNotes = (sessionId: string, newNotes: string) => {
    setEditedSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, notes: newNotes } : s)))
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pacientes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{editedName}</h1>
            <p className="text-muted-foreground mt-1">Informações completas do paciente</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{editedSessions.length}</div>
              <p className="text-xs text-muted-foreground">
                Desde {new Date(editedDateOfBirth).toLocaleDateString("pt-BR")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="sessions">Sessões</TabsTrigger>
            <TabsTrigger value="reports">Relatórios Diários</TabsTrigger>
            <TabsTrigger value="treatment">Tratamento</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Informações de contato e identificação (editável)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Nome</p>
                      <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Data de Nascimento</p>
                      <Input
                        type="date"
                        value={editedDateOfBirth}
                        onChange={(e) => setEditedDateOfBirth(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Email</p>
                      <Input value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Telefone</p>
                      <Input value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            {editedSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Sessão - {new Date(session.date).toLocaleDateString("pt-BR")}
                    </CardTitle>
                    <Badge variant="outline">Humor: {session.mood}/10</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm font-medium">Descrição da Sessão:</p>
                  <Textarea
                    value={session.notes}
                    onChange={(e) => updateSessionNotes(session.id, e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Diários do Paciente</CardTitle>
                <CardDescription>Acompanhamento do estado emocional e situações do dia a dia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar tags..."
                      value={searchTag}
                      onChange={(e) => setSearchTag(e.target.value)}
                      className="flex-1"
                    />
                    {selectedTags.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </div>

                  {filteredTagOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {filteredTagOptions.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {selectedTags.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Mostrando {filteredReports.length} de {patientReports.length} relatórios
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getFeelingEmoji(report.feeling)}
                        {new Date(report.date).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getFeelingColor(report.feeling)} variant="outline">
                          {report.feeling.charAt(0).toUpperCase() + report.feeling.slice(1)}
                        </Badge>
                        <Badge variant="secondary">Intensidade: {report.intensity}/5</Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Registrado em {new Date(report.createdAt).toLocaleString("pt-BR")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-foreground leading-relaxed">{report.description}</p>
                    {report.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {report.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    {selectedTags.length > 0
                      ? "Nenhum relatório encontrado com as tags selecionadas."
                      : "Nenhum relatório diário registrado ainda."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="treatment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plano de Tratamento</CardTitle>
                <CardDescription>Diagnóstico e abordagem terapêutica (editável)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Diagnóstico</p>
                  <Input value={editedDiagnosis} onChange={(e) => setEditedDiagnosis(e.target.value)} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Abordagem Terapêutica</p>
                  <Textarea
                    value={editedTreatment}
                    onChange={(e) => setEditedTreatment(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Objetivos Terapêuticos</p>
                  <div className="space-y-2">
                    {editedGoals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-sm text-muted-foreground mt-2">•</span>
                        <Textarea
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...editedGoals]
                            newGoals[index] = e.target.value
                            setEditedGoals(newGoals)
                          }}
                          className="flex-1 min-h-[60px]"
                        />
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
