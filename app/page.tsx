"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, UserPlus, Clock, User } from 'lucide-react'
import Link from "next/link"
import { useAppStore } from "@/lib/store"

export default function HomePage() {
  const appointments = useAppStore((state) => state.appointments)
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(apt => apt.date === today && apt.status === 'scheduled')

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dr. Angélia</h1>
          <p className="text-muted-foreground mt-1">O que você quer fazer hoje?</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/pacientes/novo" className="group">
            <Card className="border-2 border-transparent hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      Novo Paciente
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Cadastrar novo paciente no sistema
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agenda/novo" className="group">
            <Card className="border-2 border-transparent hover:border-accent/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      Agendar Nova Consulta
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Criar novo agendamento para paciente
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Consultas de hoje:</h2>
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{apt.patientName}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Hoje, {apt.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Nenhuma consulta agendada para hoje</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
