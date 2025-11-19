"use client"

import type React from "react"

import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { useState, useMemo } from "react"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

const dayNames = ["D", "S", "T", "Q", "Q", "S", "S"]
const fullDayNames = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."]

export default function NovoAgendamentoPage() {
  const router = useRouter()
  const addAppointment = useAppStore((state) => state.addAppointment)
  const timeSlots = useAppStore((state) => state.timeSlots)
  const patients = useAppStore((state) => state.patients)
  const sessionDuration = useAppStore((state) => state.sessionDuration)
  const currentDate = new Date()

  const [calendarMonth, setCalendarMonth] = useState(currentDate.getMonth())
  const [calendarYear, setCalendarYear] = useState(currentDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    date: "",
    time: "",
    notes: "",
  })

  const [patientSearch, setPatientSearch] = useState("")
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)

  const filteredPatients = useMemo(() => {
    if (!patientSearch) return patients
    return patients.filter((patient) => patient.name.toLowerCase().includes(patientSearch.toLowerCase()))
  }, [patientSearch, patients])

  const getAvailableTimesForDay = (date: Date) => {
    const dayOfWeek = date.getDay()
    return timeSlots
      .filter((slot) => slot.day === dayOfWeek && slot.enabled)
      .map((slot) => slot.time)
      .sort()
  }

  const allAvailableTimes = useMemo(() => {
    const uniqueTimes = new Set<string>()
    timeSlots.filter(slot => slot.enabled).forEach(slot => {
      uniqueTimes.add(slot.time)
    })
    return Array.from(uniqueTimes).sort()
  }, [timeSlots])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.patientId || !formData.date || !formData.time) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }
    
    addAppointment({
      patientName: formData.patientName,
      patientId: formData.patientId,
      date: formData.date,
      time: formData.time,
      duration: sessionDuration,
      type: "Consulta Regular",
      status: "scheduled",
      notes: formData.notes,
    })
    
    alert("Agendamento confirmado com sucesso!")
    router.push("/agenda")
  }

  const selectPatient = (patient: { id: string; name: string }) => {
    setFormData({ ...formData, patientId: patient.id, patientName: patient.name })
    setPatientSearch(patient.name)
    setShowPatientDropdown(false)
  }

  const selectDate = (date: Date) => {
    setSelectedDate(date)
    const dateStr = date.toISOString().split("T")[0]
    setFormData({ ...formData, date: dateStr })
  }

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay()

  const getWeekDays = () => {
    const startDate = selectedDate || currentDate
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }

  const weekDays = getWeekDays()

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agenda">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Novo Agendamento</h1>
            <p className="text-muted-foreground mt-1">Agende uma nova consulta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Agendamento</CardTitle>
              <CardDescription>Selecione o paciente, data e horário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 relative">
                <Label htmlFor="patient">Paciente *</Label>
                <Input
                  placeholder="Buscar paciente por nome..."
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value)
                    setShowPatientDropdown(true)
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1">
                    <CardContent className="p-2">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => selectPatient(patient)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary transition-colors text-sm"
                        >
                          {patient.name}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {monthNames[calendarMonth]} de {calendarYear}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11)
                          setCalendarYear(calendarYear - 1)
                        } else {
                          setCalendarMonth(calendarMonth - 1)
                        }
                      }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0)
                          setCalendarYear(calendarYear + 1)
                        } else {
                          setCalendarMonth(calendarMonth + 1)
                        }
                      }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-64 flex-shrink-0">
                    <div className="bg-card border rounded-lg p-4">
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day, i) => (
                          <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                          <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1
                          const date = new Date(calendarYear, calendarMonth, day)
                          const isToday = date.toDateString() === currentDate.toDateString()
                          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => selectDate(date)}
                              className={cn(
                                "aspect-square rounded-full p-1 text-sm transition-colors hover:bg-secondary",
                                isToday && "bg-primary text-primary-foreground hover:bg-primary/90",
                                isSelected && !isToday && "bg-secondary ring-2 ring-primary",
                              )}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    <div className="min-w-[800px]">
                      {/* Days header */}
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {weekDays.map((day, index) => {
                          const isToday = day.toDateString() === currentDate.toDateString()
                          const isSelectedDay = selectedDate && day.toDateString() === selectedDate.toDateString()

                          return (
                            <div key={index} className="text-center">
                              <div className="text-xs text-muted-foreground mb-1">{fullDayNames[day.getDay()]}</div>
                              <div
                                className={cn(
                                  "text-2xl font-semibold mx-auto w-10 h-10 rounded-full flex items-center justify-center",
                                  isToday && "bg-primary text-primary-foreground",
                                  isSelectedDay && !isToday && "bg-secondary",
                                )}
                              >
                                {day.getDate()}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                        {allAvailableTimes.length > 0 ? (
                          allAvailableTimes.map((time) => (
                            <div key={time} className="grid grid-cols-7 gap-2">
                              {weekDays.map((day, dayIndex) => {
                                const dateStr = day.toISOString().split("T")[0]
                                const isSelected = formData.date === dateStr && formData.time === time
                                const availableTimes = getAvailableTimesForDay(day)
                                const isAvailable = availableTimes.includes(time)

                                return (
                                  <button
                                    key={dayIndex}
                                    type="button"
                                    onClick={() => {
                                      if (isAvailable) {
                                        selectDate(day)
                                        setFormData({ ...formData, date: dateStr, time })
                                      }
                                    }}
                                    disabled={!isAvailable}
                                    className={cn(
                                      "border rounded-lg p-2.5 text-center text-sm transition-colors",
                                      isAvailable
                                        ? "hover:border-primary cursor-pointer"
                                        : "opacity-30 cursor-not-allowed bg-muted",
                                      isSelected
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : isAvailable
                                          ? "bg-background hover:bg-secondary"
                                          : "bg-muted",
                                    )}
                                  >
                                    {time}
                                  </button>
                                )
                              })}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">Nenhum horário disponível configurado.</p>
                            <p className="text-xs mt-1">Configure os horários disponíveis nas Configurações.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Adicione observações sobre a consulta..."
                  className="min-h-24 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" type="button" asChild>
                  <Link href="/agenda">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={!formData.patientId || !formData.date || !formData.time}>
                  Confirmar agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppShell>
  )
}
