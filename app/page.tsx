"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Battery, Moon, Zap, CheckCircle, BarChart3, User } from "lucide-react"
import {
  SupportResourceCard,
  ActivityGuide,
  EmergencyResources,
  getSupportResource,
} from "@/components/support-resources"
import { WeeklyTrends, MonthlyHeatmap, MetricSummary, StreakCounter } from "@/components/trends-visualization"
import { ReminderSystem } from "@/components/reminder-system"

interface DailyEntry {
  id: string
  date: string
  mood: number
  energy: number
  sleep: number
  stress: number
  note?: string
}

interface Activity {
  id: string
  name: string
  duration: string
  icon: any
  instructions: string[]
}

const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"]
const moodLabels = ["Muy mal", "Mal", "Regular", "Bien", "Excelente"]

export default function WellnessApp() {
  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [todayEntry, setTodayEntry] = useState<Partial<DailyEntry>>({})
  const [hasCompletedToday, setHasCompletedToday] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [recommendedResource, setRecommendedResource] = useState<any>(null)
  const [showActivityView, setShowActivityView] = useState(false)

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem("wellness-entries")
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries)
      setEntries(parsedEntries)

      // Check if today's entry exists
      const today = new Date().toISOString().split("T")[0]
      const todayExists = parsedEntries.some((entry: DailyEntry) => entry.date === today)
      setHasCompletedToday(todayExists)
    }
  }, [])

  const saveEntry = () => {
    if (!todayEntry.mood || !todayEntry.energy || !todayEntry.sleep || !todayEntry.stress) {
      return
    }

    const newEntry: DailyEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      mood: todayEntry.mood,
      energy: todayEntry.energy,
      sleep: todayEntry.sleep,
      stress: todayEntry.stress,
      note: todayEntry.note || "",
    }

    const updatedEntries = [...entries, newEntry]
    setEntries(updatedEntries)
    localStorage.setItem("wellness-entries", JSON.stringify(updatedEntries))
    setHasCompletedToday(true)

    // Get personalized resource recommendation
    const resource = getSupportResource(todayEntry.mood, todayEntry.energy, todayEntry.stress, todayEntry.sleep)
    setRecommendedResource(resource)
  }

  const ScaleSelector = ({
    value,
    onChange,
    icon: Icon,
    title,
    lowLabel,
    highLabel,
  }: {
    value: number | undefined
    onChange: (value: number) => void
    icon: any
    title: string
    lowLabel: string
    highLabel: string
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{lowLabel}</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                value === num
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{highLabel}</span>
      </div>
    </div>
  )

  if (showActivityView && currentActivity) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-8">
          <ActivityGuide
            activity={currentActivity}
            onComplete={() => {
              setCurrentActivity(null)
              setShowActivityView(false)
            }}
            onBack={() => {
              setCurrentActivity(null)
              setShowActivityView(false)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Wellness</h1>
              <p className="text-sm text-muted-foreground">Tu bienestar mental</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Column - Registro & Tendencias */}
          <div className="space-y-6">
            <Tabs defaultValue="registro" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="registro">
                  <Heart className="w-4 h-4 mr-2" />
                  Registro
                </TabsTrigger>
                <TabsTrigger value="tendencias">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Tendencias
                </TabsTrigger>
              </TabsList>

              {/* Registro Tab */}
              <TabsContent value="registro" className="space-y-6 mt-6">
                {hasCompletedToday ? (
                  <Card>
                    <CardContent className="pt-6 text-center space-y-4">
                      <CheckCircle className="w-12 h-12 text-primary mx-auto" />
                      <div>
                        <h3 className="font-semibold text-foreground">¡Ya registraste tu día!</h3>
                        <p className="text-sm text-muted-foreground">Vuelve mañana para tu próximo registro</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Registro Diario</CardTitle>
                      <CardDescription>¿Cómo te sientes hoy? Solo tomará 20 segundos</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ScaleSelector
                        value={todayEntry.mood}
                        onChange={(value) => setTodayEntry({ ...todayEntry, mood: value })}
                        icon={Heart}
                        title="Estado de ánimo"
                        lowLabel="Mal"
                        highLabel="Excelente"
                      />

                      <ScaleSelector
                        value={todayEntry.energy}
                        onChange={(value) => setTodayEntry({ ...todayEntry, energy: value })}
                        icon={Battery}
                        title="Nivel de energía"
                        lowLabel="Agotado"
                        highLabel="Energético"
                      />

                      <ScaleSelector
                        value={todayEntry.sleep}
                        onChange={(value) => setTodayEntry({ ...todayEntry, sleep: value })}
                        icon={Moon}
                        title="Calidad del sueño"
                        lowLabel="Muy mal"
                        highLabel="Perfecto"
                      />

                      <ScaleSelector
                        value={todayEntry.stress}
                        onChange={(value) => setTodayEntry({ ...todayEntry, stress: value })}
                        icon={Zap}
                        title="Nivel de estrés"
                        lowLabel="Relajado"
                        highLabel="Muy estresado"
                      />

                      <div className="space-y-3">
                        <h3 className="font-medium text-foreground">Nota opcional</h3>
                        <Textarea
                          placeholder="¿Algo más que quieras recordar sobre hoy?"
                          value={todayEntry.note || ""}
                          onChange={(e) => setTodayEntry({ ...todayEntry, note: e.target.value })}
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={saveEntry}
                        className="w-full"
                        disabled={!todayEntry.mood || !todayEntry.energy || !todayEntry.sleep || !todayEntry.stress}
                      >
                        Guardar registro
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Show recommendation after saving */}
                {recommendedResource && hasCompletedToday && (
                  <SupportResourceCard
                    resource={recommendedResource}
                    onStartActivity={(activity) => {
                      setCurrentActivity(activity)
                      setShowActivityView(true)
                    }}
                  />
                )}

                {/* Emergency Resources */}
                <EmergencyResources />
              </TabsContent>

              {/* Tendencias Tab */}
              <TabsContent value="tendencias" className="space-y-6 mt-6">
                {entries.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center space-y-4">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="font-semibold text-foreground">Sin datos aún</h3>
                        <p className="text-sm text-muted-foreground">
                          Completa algunos registros para ver tus tendencias
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Progress Summary */}
                    <StreakCounter entries={entries} />

                    {/* Metric Summary Cards */}
                    <MetricSummary entries={entries} />

                    {/* Weekly Trends Chart */}
                    <WeeklyTrends entries={entries} />

                    {/* Monthly Heatmap */}
                    <MonthlyHeatmap entries={entries} />

                    {/* Insights */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {entries.length >= 7 && (
                            <p className="text-muted-foreground">
                              ¡Excelente! Has mantenido el hábito por una semana completa.
                            </p>
                          )}
                          {entries.length >= 30 && (
                            <p className="text-muted-foreground">
                              ¡Increíble! Un mes de seguimiento constante te ayudará a identificar patrones importantes.
                            </p>
                          )}
                          {entries.length < 7 && (
                            <p className="text-muted-foreground">
                              Continúa registrando para obtener insights más detallados sobre tus patrones de bienestar.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Perfil (Always visible) */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Mi Perfil</CardTitle>
                </div>
                <CardDescription>Configuración y recordatorios</CardDescription>
              </CardHeader>
            </Card>

            {/* Comprehensive Reminder System */}
            <ReminderSystem />
          </div>
        </div>
      </div>
    </div>
  )
}
