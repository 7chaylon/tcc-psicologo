"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Smile, Meh, Frown, Heart, Zap, CloudRain, Sun, MoonIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const moods = [
  { name: "Feliz", icon: Smile, color: "mood-happy", value: "happy" },
  { name: "Calmo", icon: Sun, color: "mood-calm", value: "calm" },
  { name: "Animado", icon: Zap, color: "mood-excited", value: "excited" },
  { name: "Neutro", icon: Meh, color: "mood-neutral", value: "neutral" },
  { name: "Ansioso", icon: Heart, color: "mood-anxious", value: "anxious" },
  { name: "Triste", icon: CloudRain, color: "mood-sad", value: "sad" },
  { name: "Irritado", icon: Frown, color: "mood-irritated", value: "irritated" },
  { name: "Cansado", icon: MoonIcon, color: "mood-tired", value: "tired" },
]

export function MoodEntry() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // In a real app, this would save to the database
    console.log({ mood: selectedMood, intensity, notes, timestamp: new Date() })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setSelectedMood(null)
      setIntensity(5)
      setNotes("")
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Humor</CardTitle>
        <CardDescription>Como você está se sentindo hoje?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium">Registro salvo com sucesso!</p>
            <p className="text-sm text-muted-foreground">Obrigado por compartilhar como você está se sentindo.</p>
          </div>
        ) : (
          <>
            {/* Mood Selection */}
            <div className="space-y-3">
              <Label>Selecione seu humor</Label>
              <div className="grid grid-cols-4 gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon
                  const isSelected = selectedMood === mood.value
                  return (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-border bg-card p-3 transition-all hover:border-primary hover:bg-accent/10",
                        isSelected && "border-primary bg-primary/10",
                      )}
                    >
                      <Icon className={cn("h-6 w-6", isSelected && "text-primary")} />
                      <span className="text-xs font-medium">{mood.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Intensidade</Label>
                <span className="text-sm font-medium text-primary">{intensity}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Leve</span>
                <span>Moderado</span>
                <span>Intenso</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Compartilhe o que está em sua mente..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} disabled={!selectedMood} className="w-full">
              Salvar Registro
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
