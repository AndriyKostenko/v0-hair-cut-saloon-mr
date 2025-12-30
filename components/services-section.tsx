import { Card, CardContent } from "@/components/ui/card"
import { Scissors, Sparkles, Palette, Users } from "lucide-react"

const services = [
  {
    icon: Scissors,
    title: "Haircuts & Styling",
    description: "Expert cuts and Korean-style layering tailored to your face shape and hair type",
  },
  {
    icon: Sparkles,
    title: "Digital Perms",
    description: "Natural-looking waves and curls with our advanced digital perm techniques",
  },
  {
    icon: Palette,
    title: "Hair Coloring",
    description: "Professional coloring services from subtle highlights to full transformations",
  },
  {
    icon: Users,
    title: "All Ages Welcome",
    description: "From kids to adults, we provide personalized care for every client",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-muted/30 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Our Services
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Professional hair care services designed to bring out your best look
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card key={index} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <service.icon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground">{service.title}</h3>
                <p className="text-pretty leading-relaxed text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
