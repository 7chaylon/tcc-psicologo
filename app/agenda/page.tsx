"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Clock, User, CalendarIcon, Edit2, X } from 'lucide-react'
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function AgendaPage() {
  const appointments = useAppStore((state) => state.appointments)
  const updateAppointment = useAppStore((state) => state.updateAppointment)
  const deleteAppointment = useAppStore((state) => state.deleteAppointment)
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const hasAppointment = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return appointments.some((apt) => apt.date === dateStr)
  }

  const getAppointmentsForDate = () => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    return appointments.filter((apt) => apt.date === dateStr)
  }

  const selectedDateAppointments = getAppointmentsForDate()

  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isSelected = day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()
    
    calendarDays.push(
      <button
        key={day}
        onClick={() => setSelectedDate(new Date(year, month, day))}
        className={cn(
          "aspect-square rounded-lg p-2 text-sm font-medium transition-colors hover:bg-accent",
          isToday(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
          isSelected && !isToday(day) && "bg-secondary ring-2 ring-primary",
          hasAppointment(day) &&
            !isToday(day) &&
            "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary",
        )}
      >
        {day}
      </button>,
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Agenda</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus agendamentos e consultas</p>
          </div>
          <Button asChild>
            <Link href="/agenda/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {monthNames[month]} {year}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {calendarDays}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
              </CardTitle>
              <CardDescription>
                {selectedDateAppointments.length} {selectedDateAppointments.length === 1 ? "consulta" : "consultas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhuma consulta agendada</p>
                  <p className="text-xs mt-1">Selecione outra data ou crie um novo agendamento</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateAppointments.map((apt) => {
                    const appointmentDateTime = new Date(`${apt.date}T${apt.time}`)
                    const isPast = appointmentDateTime < new Date()
                    const isEditing = editingId === apt.id

                    return (
                      <div
                        key={apt.id}
                        className="rounded-lg border border-border p-3 hover:border-primary transition-colors"
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-date-${apt.id}`}>Nova Data</Label>
                              <Input
                                id={`edit-date-${apt.id}`}
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-time-${apt.id}`}>Novo Horário</Label>
                              <Input
                                id={`edit-time-${apt.id}`}
                                type="time"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (editDate && editTime) {
                                    updateAppointment(apt.id, { date: editDate, time: editTime })
                                    setEditingId(null)
                                  }
                                }}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{apt.patientName}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {apt.time}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant={apt.status === "scheduled" ? "default" : "secondary"} className="text-xs">
                                  {apt.status === "scheduled" ? "Agendado" : "Cancelado"}
                                </Badge>
                                {!isPast && apt.status === "scheduled" && (
                                  <>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7"
                                      onClick={() => {
                                        setEditingId(apt.id)
                                        setEditDate(apt.date)
                                        setEditTime(apt.time)
                                      }}
                                      title="Remarcar"
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-destructive hover:text-destructive"
                                      onClick={() => {
                                        if (confirm('Deseja cancelar este agendamento?')) {
                                          updateAppointment(apt.id, { status: "cancelled" })
                                        }
                                      }}
                                      title="Cancelar"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
