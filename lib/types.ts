export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  clinicalHistory: string
  createdAt: string
  updatedAt: string
}

export interface Mood {
  id: string
  patientId: string
  date: string
  moodKey: "happy" | "sad" | "anxious" | "calm" | "irritated" | "neutral" | "excited" | "tired"
  note?: string
  createdAt: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  type: "initial" | "followup" | "evaluation" | "group"
  status: "scheduled" | "completed" | "cancelled" | "noshow"
  notes?: string
  createdAt: string
}

export interface TreatmentPlan {
  id: string
  patientId: string
  title: string
  goals: string[]
  interventions: string[]
  startDate: string
  endDate?: string
  progress: number
  status: "active" | "completed" | "paused"
  sessionNotes: string[]
  createdAt: string
  updatedAt: string
}

export interface DailyReport {
  id: string
  patientId: string
  date: string
  feeling: "feliz" | "triste" | "ansioso" | "calmo" | "raiva"
  intensity: 1 | 2 | 3 | 4 | 5
  description: string
  tags: string[]
  createdAt: string
}
