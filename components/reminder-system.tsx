"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, BellOff, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReminderSettings {
  enabled: boolean
  time: string
  frequency: "daily" | "weekdays" | "custom"
  customDays: number[]
  lastNotified: string
}

const defaultSettings: ReminderSettings = {
  enabled: true,
  time: "20:00",
  frequency: "daily",
  customDays: [1, 2, 3, 4, 5], // Monday to Friday
  lastNotified: "",
}

const timeOptions = [
  { value: "08:00", label: "8:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "21:00", label: "9:00 PM" },
  { value: "22:00", label: "10:00 PM" },
]

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export function ReminderSystem() {
  const [settings, setSettings] = useState<ReminderSettings>(defaultSettings)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [isTestingNotification, setIsTestingNotification] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("wellness-reminder-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }

    // Set up reminder check interval
    const interval = setInterval(checkForReminder, 60000) // Check every minute
    checkForReminder() // Check immediately

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem("wellness-reminder-settings", JSON.stringify(settings))
  }, [settings])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === "granted") {
        toast({
          title: "Notificaciones activadas",
          description: "Te recordaremos completar tu registro diario",
        })
      } else {
        toast({
          title: "Notificaciones desactivadas",
          description: "Puedes activarlas desde la configuración del navegador",
          variant: "destructive",
        })
      }
    }
  }

  const checkForReminder = () => {
    if (!settings.enabled || notificationPermission !== "granted") return

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    const currentDay = now.getDay()
    const today = now.toISOString().split("T")[0]

    // Check if we should send reminder today
    let shouldRemind = false

    if (settings.frequency === "daily") {
      shouldRemind = true
    } else if (settings.frequency === "weekdays") {
      shouldRemind = currentDay >= 1 && currentDay <= 5 // Monday to Friday
    } else if (settings.frequency === "custom") {
      shouldRemind = settings.customDays.includes(currentDay)
    }

    // Check if it's time and we haven't notified today
    if (shouldRemind && currentTime === settings.time && settings.lastNotified !== today) {
      // Check if user has already completed today's entry
      const entries = localStorage.getItem("wellness-entries")
      if (entries) {
        const parsedEntries = JSON.parse(entries)
        const hasCompletedToday = parsedEntries.some((entry: any) => entry.date === today)

        if (!hasCompletedToday) {
          sendNotification()
          setSettings((prev) => ({ ...prev, lastNotified: today }))
        }
      } else {
        sendNotification()
        setSettings((prev) => ({ ...prev, lastNotified: today }))
      }
    }
  }

  const sendNotification = () => {
    if ("Notification" in window && notificationPermission === "granted") {
      const notification = new Notification("MindFlow - Registro Diario", {
        body: "¿Cómo te sientes hoy? Toma 20 segundos para registrar tu bienestar.",
        icon: "/mindfulness-app-icon.jpg",
        badge: "/notification-badge.jpg",
        tag: "daily-reminder",
        requireInteraction: false,
        silent: false,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000)
    }
  }

  const testNotification = async () => {
    setIsTestingNotification(true)

    if (notificationPermission !== "granted") {
      await requestNotificationPermission()
    }

    if (notificationPermission === "granted" || Notification.permission === "granted") {
      sendNotification()
      toast({
        title: "Notificación de prueba enviada",
        description: "Así se verá tu recordatorio diario",
      })
    }

    setIsTestingNotification(false)
  }

  const toggleCustomDay = (day: number) => {
    setSettings((prev) => ({
      ...prev,
      customDays: prev.customDays.includes(day)
        ? prev.customDays.filter((d) => d !== day)
        : [...prev.customDays, day].sort(),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Notification Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {notificationPermission === "granted" ? (
              <Bell className="w-5 h-5 text-green-600" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            Estado de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Permisos del navegador:</span>
            <Badge variant={notificationPermission === "granted" ? "default" : "secondary"}>
              {notificationPermission === "granted"
                ? "Activadas"
                : notificationPermission === "denied"
                  ? "Bloqueadas"
                  : "Sin configurar"}
            </Badge>
          </div>

          {notificationPermission !== "granted" && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Activa las notificaciones</p>
                  <p className="text-muted-foreground">
                    Para recibir recordatorios automáticos, necesitas permitir notificaciones en tu navegador.
                  </p>
                </div>
              </div>
              <Button onClick={requestNotificationPermission} className="w-full">
                Activar Notificaciones
              </Button>
            </div>
          )}

          {notificationPermission === "granted" && (
            <Button
              onClick={testNotification}
              variant="outline"
              className="w-full bg-transparent"
              disabled={isTestingNotification}
            >
              {isTestingNotification ? "Enviando..." : "Probar Notificación"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Configuración de Recordatorios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recordatorios automáticos</p>
              <p className="text-sm text-muted-foreground">Recibe notificaciones para completar tu registro</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => setSettings((prev) => ({ ...prev, enabled }))}
            />
          </div>

          {settings.enabled && (
            <>
              {/* Time Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Hora del recordatorio</label>
                <Select value={settings.time} onValueChange={(time) => setSettings((prev) => ({ ...prev, time }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Frecuencia</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="daily"
                      name="frequency"
                      checked={settings.frequency === "daily"}
                      onChange={() => setSettings((prev) => ({ ...prev, frequency: "daily" }))}
                      className="w-4 h-4"
                    />
                    <label htmlFor="daily" className="text-sm">
                      Todos los días
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="weekdays"
                      name="frequency"
                      checked={settings.frequency === "weekdays"}
                      onChange={() => setSettings((prev) => ({ ...prev, frequency: "weekdays" }))}
                      className="w-4 h-4"
                    />
                    <label htmlFor="weekdays" className="text-sm">
                      Solo días de semana
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="custom"
                      name="frequency"
                      checked={settings.frequency === "custom"}
                      onChange={() => setSettings((prev) => ({ ...prev, frequency: "custom" }))}
                      className="w-4 h-4"
                    />
                    <label htmlFor="custom" className="text-sm">
                      Días personalizados
                    </label>
                  </div>
                </div>
              </div>

              {/* Custom Days Selection */}
              {settings.frequency === "custom" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selecciona los días</label>
                  <div className="flex gap-2">
                    {dayNames.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => toggleCustomDay(index)}
                        className={`w-10 h-10 rounded-full text-xs font-medium transition-colors ${
                          settings.customDays.includes(index)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Reminder Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Estado Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Recordatorios:</span>
              <Badge variant={settings.enabled ? "default" : "secondary"}>
                {settings.enabled ? "Activados" : "Desactivados"}
              </Badge>
            </div>

            {settings.enabled && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Próximo recordatorio:</span>
                  <Badge variant="outline">
                    {timeOptions.find((t) => t.value === settings.time)?.label || settings.time}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Frecuencia:</span>
                  <Badge variant="outline">
                    {settings.frequency === "daily"
                      ? "Diario"
                      : settings.frequency === "weekdays"
                        ? "Días de semana"
                        : "Personalizado"}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
