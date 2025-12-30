"use client"

import { Button } from "@/components/ui/button"
import { Scissors } from "lucide-react"

export function HeroSection() {
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[url('/modern-minimalist-korean-hair-salon-interior.jpg')] bg-cover bg-center opacity-10" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm font-medium">
            <Scissors className="h-4 w-4" />
            <span>Calgary's Premier Korean Hair Salon</span>
          </div>

          <h1 className="text-balance font-sans text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Transform Your Look with Expert Korean Styling
          </h1>

          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {
              "Experience premium haircuts, digital perms, and coloring services from our skilled stylists with 30+ years of expertise"
            }
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto text-base" onClick={scrollToBooking}>
              Book Appointment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base bg-transparent"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
