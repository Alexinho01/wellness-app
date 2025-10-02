import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Battery, Moon, Zap, TrendingUp, TrendingDown, Minus, Calendar, BarChart3 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DailyEntry {
  id: string
  date: string
  mood: number
  energy: number
  sleep: number
  stress: number
  note?: string
}

interface TrendsProps {
  entries: DailyEntry[]
}

const metricConfig = {
  mood: {
    label: "Estado Emocional",
    icon: Heart,
    color: "#8b5cf6",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  energy: {
    label: "Energía",
    icon: Battery,
    color: "#10b981",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  sleep: {
    label: "Sueño",
    icon: Moon,
    color: "#3b82f6",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  stress: {
    label: "Estrés",
    icon: Zap,
    color: "#f59e0b",
    bgColor: "bg-amber-100 dark:bg-amber-900/20",
    textColor: "text-amber-700 dark:text-amber-300",
  },
}

export function WeeklyTrends({ entries }: TrendsProps) {
  // Get last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  const weeklyData = last7Days.map((date) => {
    const entry = entries.find((e) => e.date === date)
    const dayName = new Date(date).toLocaleDateString("es-ES", { weekday: "short" })

    return {
      date,
      day: dayName,
      mood: entry?.mood || null,
      energy: entry?.energy || null,
      sleep: entry?.sleep || null,
      stress: entry?.stress ? 6 - entry.stress : null, // Invert stress for better visualization
    }
  })

  const hasData = weeklyData.some((d) => d.mood !== null)

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Tendencias Semanales
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Necesitas al menos un registro para ver las tendencias</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Tendencias Semanales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis domain={[1, 5]} axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke={metricConfig.mood.color}
                strokeWidth={2}
                dot={{ fill: metricConfig.mood.color, strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Estado Emocional"
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke={metricConfig.energy.color}
                strokeWidth={2}
                dot={{ fill: metricConfig.energy.color, strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Energía"
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke={metricConfig.sleep.color}
                strokeWidth={2}
                dot={{ fill: metricConfig.sleep.color, strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Sueño"
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke={metricConfig.stress.color}
                strokeWidth={2}
                dot={{ fill: metricConfig.stress.color, strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Estrés (invertido)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {Object.entries(metricConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function MonthlyHeatmap({ entries }: TrendsProps) {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get all days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const monthData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const date = new Date(currentYear, currentMonth, day).toISOString().split("T")[0]
    const entry = entries.find((e) => e.date === date)

    return {
      day,
      date,
      hasEntry: !!entry,
      mood: entry?.mood || 0,
      energy: entry?.energy || 0,
      sleep: entry?.sleep || 0,
      stress: entry?.stress || 0,
      average: entry ? (entry.mood + entry.energy + entry.sleep + (6 - entry.stress)) / 4 : 0,
    }
  })

  const getIntensityColor = (average: number) => {
    if (average === 0) return "bg-muted"
    if (average < 2) return "bg-red-200 dark:bg-red-900/40"
    if (average < 3) return "bg-orange-200 dark:bg-orange-900/40"
    if (average < 4) return "bg-yellow-200 dark:bg-yellow-900/40"
    if (average < 4.5) return "bg-green-200 dark:bg-green-900/40"
    return "bg-green-300 dark:bg-green-900/60"
  }

  const monthName = currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Heatmap - {monthName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground text-center">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div key={day} className="p-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Month days */}
            {monthData.map(({ day, hasEntry, average }) => (
              <div
                key={day}
                className={`aspect-square rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${getIntensityColor(
                  average,
                )} ${hasEntry ? "cursor-pointer hover:ring-2 hover:ring-primary/50" : ""}`}
                title={hasEntry ? `Día ${day}: Promedio ${average.toFixed(1)}/5` : `Día ${day}: Sin registro`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-900/40" />
              <div className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-900/40" />
              <div className="w-3 h-3 rounded-sm bg-yellow-200 dark:bg-yellow-900/40" />
              <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
              <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-900/60" />
            </div>
            <span>Más</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricSummary({ entries }: TrendsProps) {
  if (entries.length === 0) {
    return null
  }

  const calculateTrend = (metric: keyof Omit<DailyEntry, "id" | "date" | "note">) => {
    if (entries.length < 2) return "stable"

    const recent = entries.slice(-3).map((e) => e[metric])
    const older = entries.slice(-6, -3).map((e) => e[metric])

    if (recent.length === 0 || older.length === 0) return "stable"

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length

    const diff = recentAvg - olderAvg

    if (Math.abs(diff) < 0.3) return "stable"
    return diff > 0 ? "up" : "down"
  }

  const getLatestAverage = (metric: keyof Omit<DailyEntry, "id" | "date" | "note">) => {
    const recent = entries.slice(-7).map((e) => e[metric])
    return recent.reduce((a, b) => a + b, 0) / recent.length
  }

  const getTrendIcon = (trend: string, isStress = false) => {
    if (trend === "stable") return <Minus className="w-4 h-4" />

    // For stress, up trend is bad, down trend is good
    if (isStress) {
      return trend === "up" ? (
        <TrendingUp className="w-4 h-4 text-red-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-green-500" />
      )
    }

    // For other metrics, up trend is good, down trend is bad
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(metricConfig).map(([key, config]) => {
        const trend = calculateTrend(key as keyof Omit<DailyEntry, "id" | "date" | "note">)
        const average = getLatestAverage(key as keyof Omit<DailyEntry, "id" | "date" | "note">)
        const Icon = config.icon

        return (
          <Card key={key} className={config.bgColor}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.textColor}`} />
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                {getTrendIcon(trend, key === "stress")}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{average.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Promedio 7 días</div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function StreakCounter({ entries }: TrendsProps) {
  const calculateStreak = () => {
    if (entries.length === 0) return 0

    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let streak = 0
    let currentDate = new Date()

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      const diffTime = currentDate.getTime() - entryDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
        currentDate = entryDate
      } else if (diffDays === streak + 1 && streak === 0) {
        // Allow for today not being registered yet
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return streak
  }

  const streak = calculateStreak()
  const longestStreak = Math.max(streak, entries.length > 0 ? entries.length : 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progreso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{entries.length}</div>
            <div className="text-xs text-muted-foreground">Total registros</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{streak}</div>
            <div className="text-xs text-muted-foreground">Racha actual</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Mejor racha</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
