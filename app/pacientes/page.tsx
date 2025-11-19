"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Phone, Mail, Calendar, FileText, UserPlus } from 'lucide-react'
import Link from "next/link"
import { useState, useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PacientesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"todos" | "ativos" | "ociosos">("todos")
  const patients = useAppStore((state) => state.patients)
  const appointments = useAppStore((state) => state.appointments)

  const patientsWithStatus = useMemo(() => {
    return patients.map((patient) => {
      // Find all appointments for this patient
      const patientAppointments = appointments.filter(
        (apt) => apt.patientId === patient.id && apt.status === "scheduled"
      )

      // Get the most recent appointment
      const lastAppointment = patientAppointments.sort(
        (a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime()
      )[0]

      // Calculate if patient is idle (no appointment in last 45 days)
      let isIdle = true
      if (lastAppointment) {
        const lastAppointmentDate = new Date(`${lastAppointment.date} ${lastAppointment.time}`)
        const daysSinceLastAppointment = Math.floor(
          (Date.now() - lastAppointmentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        isIdle = daysSinceLastAppointment > 45
      }

      return {
        ...patient,
        isIdle,
        status: isIdle ? "ocioso" : "ativo",
      }
    })
  }, [patients, appointments])

  const filteredPatients = patientsWithStatus.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "todos" ||
      (statusFilter === "ativos" && !patient.isIdle) ||
      (statusFilter === "ociosos" && patient.isIdle)
    return matchesSearch && matchesStatus
  })

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Pacientes</h1>
            <p className="text-muted-foreground mt-1">Gerencie informações dos seus pacientes</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/pacientes/novo">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="ativos">Ativos</TabsTrigger>
                <TabsTrigger value="ociosos">Ociosos</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pacientes por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{patient.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {patient.isIdle ? (
                          <span className="text-orange-600">Paciente ocioso</span>
                        ) : (
                          <span className="text-primary">Paciente ativo</span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Nascimento: {new Date(patient.dateOfBirth).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/pacientes/${patient.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhum paciente encontrado</p>
              <p className="text-sm text-muted-foreground">Tente ajustar sua busca ou filtro</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
