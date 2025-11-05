"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Moon, Headphones, TreePine, Coffee, BookOpen, Phone, CheckCircle } from "lucide-react"

interface SupportResource {
  id: string
  title: string
  description: string
  category: "stress" | "mood" | "energy" | "sleep" | "general"
  activities: Activity[]
  tips: string[]
  urgency: "low" | "medium" | "high"
}

interface Activity {
  id: string
  name: string
  duration: string
  icon: any
  instructions: string[]
}

const supportResources: SupportResource[] = [
  {
    id: "high-stress",
    title: "Manejo del Estrés",
    description: "Técnicas inmediatas para reducir el estrés y la ansiedad",
    category: "stress",
    urgency: "high",
    activities: [
      {
        id: "breathing",
        name: "Respiración 4-7-8",
        duration: "3 min",
        icon: Headphones,
        instructions: [
          "Siéntate cómodamente y cierra los ojos",
          "Inhala por la nariz contando hasta 4",
          "Mantén la respiración contando hasta 7",
          "Exhala por la boca contando hasta 8",
          "Repite el ciclo 4 veces",
        ],
      },
      {
        id: "grounding",
        name: "Técnica 5-4-3-2-1",
        duration: "5 min",
        icon: TreePine,
        instructions: [
          "Identifica 5 cosas que puedes ver",
          "Identifica 4 cosas que puedes tocar",
          "Identifica 3 cosas que puedes escuchar",
          "Identifica 2 cosas que puedes oler",
          "Identifica 1 cosa que puedes saborear",
        ],
      },
    ],
    tips: [
      "Toma descansos regulares cada 2 horas",
      "Practica la respiración profunda cuando sientas tensión",
      "Limita la cafeína si te sientes ansioso",
      "Habla con alguien de confianza sobre lo que te preocupa",
    ],
  },
  {
    id: "low-mood",
    title: "Mejora del Ánimo",
    description: "Actividades para elevar tu estado emocional",
    category: "mood",
    urgency: "medium",
    activities: [
      {
        id: "gratitude",
        name: "Lista de Gratitud",
        duration: "5 min",
        icon: Heart,
        instructions: [
          "Toma papel y lápiz o abre las notas del teléfono",
          "Escribe 3 cosas por las que te sientes agradecido hoy",
          "Pueden ser cosas pequeñas como una taza de café",
          "Lee la lista en voz alta",
          "Guarda la lista para días difíciles",
        ],
      },
      {
        id: "movement",
        name: "Movimiento Suave",
        duration: "10 min",
        icon: TreePine,
        instructions: [
          "Sal a caminar al aire libre si es posible",
          "Si estás en casa, haz estiramientos suaves",
          "Pon música que te guste",
          "Concéntrate en cómo se siente tu cuerpo",
          "No te presiones, solo muévete como te sientas cómodo",
        ],
      },
    ],
    tips: [
      "La luz natural puede mejorar tu ánimo",
      "Conecta con amigos o familiares",
      "Escucha música que te haga sentir bien",
      "Haz algo creativo, aunque sea por 10 minutos",
    ],
  },
  {
    id: "low-energy",
    title: "Aumento de Energía",
    description: "Estrategias naturales para recuperar vitalidad",
    category: "energy",
    urgency: "low",
    activities: [
      {
        id: "hydration",
        name: "Hidratación Consciente",
        duration: "2 min",
        icon: Coffee,
        instructions: [
          "Bebe un vaso grande de agua lentamente",
          "Añade una rodaja de limón si tienes",
          "Observa cómo se siente el agua en tu cuerpo",
          "Programa recordatorios para beber agua cada hora",
          "Evita bebidas azucaradas o con mucha cafeína",
        ],
      },
      {
        id: "power-nap",
        name: "Siesta Energizante",
        duration: "20 min",
        icon: Moon,
        instructions: [
          "Encuentra un lugar cómodo y oscuro",
          "Pon una alarma para 20 minutos máximo",
          "Cierra los ojos y relaja todo tu cuerpo",
          "No te preocupes si no te duermes completamente",
          "Al despertar, levántate inmediatamente",
        ],
      },
    ],
    tips: [
      "Come snacks saludables como frutas o nueces",
      "Evita comidas pesadas que te den sueño",
      "Haz pausas activas cada hora",
      "Asegúrate de dormir 7-8 horas por noche",
    ],
  },
  {
    id: "poor-sleep",
    title: "Mejora del Sueño",
    description: "Rutinas para un descanso reparador",
    category: "sleep",
    urgency: "medium",
    activities: [
      {
        id: "sleep-routine",
        name: "Rutina Nocturna",
        duration: "30 min",
        icon: Moon,
        instructions: [
          "Apaga pantallas 1 hora antes de dormir",
          "Toma una ducha tibia o baño relajante",
          "Lee un libro o escucha música suave",
          "Practica respiración profunda en la cama",
          "Mantén la habitación fresca y oscura",
        ],
      },
      {
        id: "bedroom-prep",
        name: "Preparación del Dormitorio",
        duration: "10 min",
        icon: TreePine,
        instructions: [
          "Ventila la habitación para que esté fresca",
          "Asegúrate de que esté lo más oscura posible",
          "Guarda el teléfono lejos de la cama",
          "Prepara ropa cómoda para dormir",
          "Ten agua cerca por si tienes sed",
        ],
      },
    ],
    tips: [
      "Mantén horarios regulares de sueño",
      "Evita cafeína después de las 2 PM",
      "Haz ejercicio, pero no cerca de la hora de dormir",
      "Si no puedes dormir en 20 min, levántate y haz algo relajante",
    ],
  },
  {
    id: "excellent-day",
    title: "Mantén el Momentum",
    description: "Estrategias para conservar tu bienestar",
    category: "general",
    urgency: "low",
    activities: [
      {
        id: "reflection",
        name: "Reflexión Positiva",
        duration: "5 min",
        icon: BookOpen,
        instructions: [
          "Piensa en qué hiciste bien hoy",
          "Identifica qué te ayudó a sentirte bien",
          "Escribe una nota para tu yo del futuro",
          "Planifica cómo repetir estos hábitos mañana",
          "Celebra tus pequeños logros",
        ],
      },
    ],
    tips: [
      "Mantén los hábitos que te funcionan",
      "Comparte tu energía positiva con otros",
      "Planifica actividades que disfrutes",
      "Recuerda que los días difíciles también pasarán",
    ],
  },
]

const emergencyResources = [
  {
    name: "Línea de Crisis 24/7",
    phone: "*4141",
    description: "Atención inmediata en crisis emocionales",
  },
  {
    name: "Chat de Apoyo",
    phone: "WhatsApp: +569 3710 0023",
    description: "Apoyo psicológico vía chat",
  },
]

export function SupportResourceCard({
  resource,
  onStartActivity,
}: {
  resource: SupportResource
  onStartActivity: (activity: Activity) => void
}) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          <Badge variant={getUrgencyColor(resource.urgency)}>
            {resource.urgency === "high" ? "Urgente" : resource.urgency === "medium" ? "Importante" : "Sugerido"}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{resource.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">Actividades recomendadas:</h4>
          <div className="space-y-2">
            {resource.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <activity.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.duration}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => onStartActivity(activity)}>
                  Empezar
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Tips adicionales:</h4>
          <ul className="space-y-1">
            {resource.tips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivityGuide({
  activity,
  onComplete,
  onBack,
}: {
  activity: Activity
  onComplete: () => void
  onBack: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <activity.icon className="w-12 h-12 text-primary mx-auto" />
        <h2 className="text-xl font-bold">{activity.name}</h2>
        <Badge variant="outline">{activity.duration}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instrucciones paso a paso:</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {activity.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-sm">{instruction}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Volver
        </Button>
        <Button onClick={onComplete} className="flex-1">
          <CheckCircle className="w-4 h-4 mr-2" />
          Completado
        </Button>
      </div>
    </div>
  )
}

export function EmergencyResources() {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Phone className="w-5 h-5" />
          ¿Necesitas ayuda inmediata?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {emergencyResources.map((resource, index) => (
          <div key={index} className="p-3 border border-destructive/20 rounded-lg">
            <h4 className="font-medium text-sm">{resource.name}</h4>
            <p className="text-destructive font-mono text-sm">{resource.phone}</p>
            <p className="text-xs text-muted-foreground">{resource.description}</p>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Si tienes pensamientos de autolesión, busca ayuda profesional inmediatamente.
        </p>
      </CardContent>
    </Card>
  )
}

export function getSupportResource(mood: number, energy: number, stress: number, sleep: number): SupportResource {
  // High stress takes priority
  if (stress >= 4) {
    return supportResources.find((r) => r.id === "high-stress")!
  }

  // Low mood
  if (mood <= 2) {
    return supportResources.find((r) => r.id === "low-mood")!
  }

  // Low energy
  if (energy <= 2) {
    return supportResources.find((r) => r.id === "low-energy")!
  }

  // Poor sleep
  if (sleep <= 2) {
    return supportResources.find((r) => r.id === "poor-sleep")!
  }

  // Everything is good
  return supportResources.find((r) => r.id === "excellent-day")!
}

export { supportResources }
