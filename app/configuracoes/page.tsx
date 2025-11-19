"use client"

import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, User, Bell, Calendar, Copy, Check, Link2, Clock } from 'lucide-react'
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function ConfiguracoesPage() {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const timeSlots = useAppStore((state) => state.timeSlots)
  const toggleTimeSlot = useAppStore((state) => state.toggleTimeSlot)
  const toggleDaySlots = useAppStore((state) => state.toggleDaySlots)
  const sessionDuration = useAppStore((state) => state.sessionDuration)
  const setSessionDuration = useAppStore((state) => state.setSessionDuration)

  const doctorCode = "DOC-2025-ANG-8471"

  const weekDays = [
    { name: "Domingo", value: 0 },
    { name: "Segunda-feira", value: 1 },
    { name: "Terça-feira", value: 2 },
    { name: "Quarta-feira", value: 3 },
    { name: "Quinta-feira", value: 4 },
    { name: "Sexta-feira", value: 5 },
    { name: "Sábado", value: 6 },
  ]

  const getTimeSlotsForDay = (day: number) => {
    return timeSlots
      .filter(slot => slot.day === day)
      .map(slot => slot.time)
      .sort()
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(doctorCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const isDayEnabled = (day: number) => {
    const daySlots = timeSlots.filter(slot => slot.day === day)
    return daySlots.some(slot => slot.enabled)
  }

  const isTimeSlotEnabled = (day: number, time: string) => {
    const slot = timeSlots.find(s => s.day === day && s.time === time)
    return slot?.enabled ?? false
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie as preferências do sistema</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Perfil Profissional</CardTitle>
              </div>
              <CardDescription>Informações sobre você e sua prática</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue="Dr. Angélia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crp">CRP</Label>
                  <Input id="crp" defaultValue="06/123456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="angelia@terapisys.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(11) 91234-5678" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço do Consultório</Label>
                  <Input id="address" defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="specialties">Especialidades</Label>
                  <Textarea
                    id="specialties"
                    defaultValue="Terapia Cognitivo-Comportamental, Terapia de Aceitação e Compromisso, Psicoterapia Interpessoal"
                    className="min-h-20 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                <CardTitle>Código de Vinculação</CardTitle>
              </div>
              <CardDescription>Compartilhe este código com pacientes para vinculação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input readOnly value={doctorCode} className="font-mono text-base font-semibold" />
                </div>
                <Button onClick={handleCopyCode} variant="outline" className="shrink-0 bg-transparent">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Código
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Os pacientes devem utilizar este código único para se vincular ao seu perfil. Compartilhe-o de forma
                  segura com novos pacientes que desejam iniciar tratamento.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Disponibilidade de Horários</CardTitle>
              </div>
              <CardDescription>Configure os dias e horários que você deseja atender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {weekDays.map((day) => {
                const dayEnabled = isDayEnabled(day.value)
                const dayTimeSlots = getTimeSlotsForDay(day.value)
                const allDayEnabled = timeSlots.filter(s => s.day === day.value).every(s => s.enabled)
                const someDayEnabled = timeSlots.filter(s => s.day === day.value).some(s => s.enabled)
                
                return (
                  <div key={day.value} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Label className="text-base font-semibold">{day.name}</Label>
                        {someDayEnabled && (
                          <Badge variant={allDayEnabled ? "default" : "secondary"} className="text-xs">
                            {allDayEnabled ? "Todos disponíveis" : "Parcialmente disponível"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {allDayEnabled ? "Desabilitar dia" : "Habilitar dia"}
                        </span>
                        <Switch
                          checked={allDayEnabled}
                          onCheckedChange={(checked) => toggleDaySlots(day.value, checked)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {dayTimeSlots.map((time) => {
                        const enabled = isTimeSlotEnabled(day.value, time)
                        
                        return (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-9 text-xs",
                              enabled
                                ? "bg-accent text-accent-foreground border-accent hover:bg-accent/80"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                            onClick={() => toggleTimeSlot(day.value, time)}
                          >
                            {time}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Horários desabilitados não estarão disponíveis para agendamento pelos pacientes. 
                  Clique nos horários para habilitar/desabilitar individualmente ou use o botão ao lado do dia para alternar todos os horários.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <CardTitle>Configurações de Agendamento</CardTitle>
              </div>
              <CardDescription>Defina suas preferências para consultas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultDuration">Duração Padrão da Sessão</Label>
                  <Select 
                    value={String(sessionDuration)} 
                    onValueChange={(value) => setSessionDuration(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="50">50 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionPrice">Valor da Sessão</Label>
                  <Input id="sessionPrice" defaultValue="R$ 200,00" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notificações</CardTitle>
              </div>
              <CardDescription>Configure quando e como receber alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembrete de Consultas</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações antes das consultas</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="1440">1 dia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {saved ? "Salvo!" : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
