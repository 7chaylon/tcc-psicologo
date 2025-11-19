import { create } from "zustand"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  date: string
  time: string
  duration: number
  type: string
  status: "scheduled" | "cancelled"
  notes?: string
}

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
}

interface TimeSlot {
  day: number // 0-6 (Sunday-Saturday)
  time: string // "HH:MM"
  enabled: boolean
}

interface AppState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPatient: string | null
  setCurrentPatient: (id: string | null) => void
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, "id">) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  patients: Patient[]
  addPatient: (patient: Omit<Patient, "id">) => void
  timeSlots: TimeSlot[]
  toggleTimeSlot: (day: number, time: string) => void
  toggleDaySlots: (day: number, enabled: boolean) => void
  sessionDuration: number // in minutes
  setSessionDuration: (duration: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  currentPatient: null,
  setCurrentPatient: (id) => set({ currentPatient: id }),
  appointments: [
    {
      id: "1",
      patientName: "Maria Silva",
      patientId: "1",
      date: "2024-11-07",
      time: "10:00",
      duration: 60,
      type: "Consulta Regular",
      status: "scheduled",
    },
    {
      id: "2",
      patientName: "Carlos Santos",
      patientId: "2",
      date: "2024-11-07",
      time: "14:00",
      duration: 60,
      type: "Consulta Regular",
      status: "scheduled",
    },
    {
      id: "3",
      patientName: "Ana Paula Costa",
      patientId: "3",
      date: "2024-11-10",
      time: "09:00",
      duration: 60,
      type: "Primeira Consulta",
      status: "scheduled",
    },
  ],
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        {
          ...appointment,
          id: `${Date.now()}`,
        },
      ],
    })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updates } : apt
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((apt) => apt.id !== id),
    })),
  patients: [
    {
      id: "1",
      name: "Maria Silva",
      email: "maria.silva@email.com",
      phone: "(11) 98765-4321",
      dateOfBirth: "1990-05-15",
    },
    {
      id: "2",
      name: "Carlos Santos",
      email: "carlos.santos@email.com",
      phone: "(11) 91234-5678",
      dateOfBirth: "1985-08-22",
    },
    {
      id: "3",
      name: "Ana Paula Costa",
      email: "ana.costa@email.com",
      phone: "(11) 99876-5432",
      dateOfBirth: "1995-12-03",
    },
  ],
  addPatient: (patient) =>
    set((state) => ({
      patients: [
        ...state.patients,
        {
          ...patient,
          id: `${Date.now()}`,
        },
      ],
    })),
  timeSlots: (() => {
    const slots: TimeSlot[] = []
    const duration = 45 // 45 minutes per slot
    const startHour = 8
    const endHour = 18
    const totalMinutes = (endHour - startHour) * 60
    const slotsPerDay = Math.floor(totalMinutes / duration)
    
    for (let day = 0; day <= 6; day++) {
      const wasEnabled = day >= 1 && day <= 5 // Mon-Fri enabled by default
      
      for (let i = 0; i < slotsPerDay; i++) {
        const minutes = startHour * 60 + i * duration
        const hour = Math.floor(minutes / 60)
        const minute = minutes % 60
        
        if (hour < endHour) {
          slots.push({
            day,
            time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
            enabled: wasEnabled,
          })
        }
      }
    }
    
    return slots
  })(),
  toggleTimeSlot: (day, time) =>
    set((state) => ({
      timeSlots: state.timeSlots.map((slot) =>
        slot.day === day && slot.time === time
          ? { ...slot, enabled: !slot.enabled }
          : slot
      ),
    })),
  toggleDaySlots: (day, enabled) =>
    set((state) => ({
      timeSlots: state.timeSlots.map((slot) =>
        slot.day === day ? { ...slot, enabled } : slot
      ),
    })),
  sessionDuration: 45,
  setSessionDuration: (duration) => {
    set({ sessionDuration: duration })
    set((state) => {
      const slots: TimeSlot[] = []
      const startHour = 8
      const endHour = 18
      
      // Calculate how many slots per day based on duration
      const totalMinutes = (endHour - startHour) * 60
      const slotsPerDay = Math.floor(totalMinutes / duration)
      
      for (let day = 0; day <= 6; day++) {
        const wasEnabled = day >= 1 && day <= 5 // Mon-Fri default enabled
        
        for (let i = 0; i < slotsPerDay; i++) {
          const minutes = startHour * 60 + i * duration
          const hour = Math.floor(minutes / 60)
          const minute = minutes % 60
          
          if (hour < endHour) {
            slots.push({
              day,
              time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
              enabled: wasEnabled,
            })
          }
        }
      }
      
      return { timeSlots: slots }
    })
  },
}))
