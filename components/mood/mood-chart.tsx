"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data - in a real app, this would come from the database
const moodData = [
  { date: "Seg", mood: 6, color: "hsl(var(--chart-1))" },
  { date: "Ter", mood: 7, color: "hsl(var(--chart-2))" },
  { date: "Qua", mood: 5, color: "hsl(var(--chart-3))" },
  { date: "Qui", mood: 8, color: "hsl(var(--chart-1))" },
  { date: "Sex", mood: 7, color: "hsl(var(--chart-2))" },
  { date: "Sáb", mood: 9, color: "hsl(var(--chart-1))" },
  { date: "Dom", mood: 7, color: "hsl(var(--chart-2))" },
]

export function MoodChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Humor</CardTitle>
        <CardDescription>Últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <XAxis
              dataKey="date"
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
              ticks={[0, 2, 4, 6, 8, 10]}
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
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
