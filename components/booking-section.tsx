"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useGoogleReCaptcha, GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

type BookingStatus = "idle" | "loading" | "success" | "error"

// Pre-defined service options
const SERVICE_OPTIONS = [
  { value: "haircut", label: "Haircut" },
  { value: "haircut-styling", label: "Haircut + Styling" },
  { value: "perm", label: "Perm" },
  { value: "digital-perm", label: "Digital Perm" },
  { value: "color", label: "Hair Color" },
  { value: "highlights", label: "Highlights" },
  { value: "balayage", label: "Balayage" },
  { value: "treatment", label: "Hair Treatment" },
  { value: "keratin", label: "Keratin Treatment" },
  { value: "styling", label: "Styling Only" },
  { value: "consultation", label: "Consultation" },
  { value: "other", label: "Other (specify in notes)" },
]

const TIME_SLOTS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "17:30", label: "5:30 PM" },
  { value: "18:00", label: "6:00 PM" },
]

function BookingSectionContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  })

  const [status, setStatus] = useState<BookingStatus>("idle")
  const [responseMessage, setResponseMessage] = useState("")
  const { executeRecaptcha } = useGoogleReCaptcha()

  const todayLocal = new Date()
  todayLocal.setMinutes(todayLocal.getMinutes() - todayLocal.getTimezoneOffset())
  const minDate = todayLocal.toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setResponseMessage("")
    if (!executeRecaptcha) {
      setStatus("error")
      setResponseMessage("reCAPTCHA not yet available. Please try again later.")
      return
    }

    const token = await executeRecaptcha("booking_form_submit")

    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    const verifyData = await response.json()

    if (!response.ok || !verifyData.success) {
      setStatus("error")
      setResponseMessage("reCAPTCHA verification failed. Please try again.")

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus("idle")
        setResponseMessage("")
      }, 5000)
      return
    } else {
      try {
        console.log("Submitting form data:", formData)
        const response = await fetch("/api/book-appointment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setResponseMessage("Your appointment has been booked! Check your email for the calendar invite.")

          // Reset form after successful booking
          setFormData({
            name: "",
            email: "",
            phone: "",
            service: "",
            date: "",
            time: "",
            message: "",
          })

          // Reset status after 5 seconds
          setTimeout(() => {
            setStatus("idle")
            setResponseMessage("")
          }, 5000)
        } else {
          setStatus("error")
          setResponseMessage(data.error || "Failed to book appointment. Please try again.")

          // Reset status after 5 seconds
          setTimeout(() => {
            setStatus("idle")
            setResponseMessage("")
          }, 5000)
        }
      } catch (error) {
        console.error("Error booking appointment:", error)
        setStatus("error")
        setResponseMessage("An error occurred. Please try again or contact us directly.")

        // Reset status after 5 seconds
        setTimeout(() => {
          setStatus("idle")
          setResponseMessage("")
        }, 5000)
      }
    }
  }

  return (
    <section id="booking" className="bg-secondary/20 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Book Your Appointment
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              {"Fill out the form below and we'll add you to our calendar"}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <Card className="border-border bg-card lg:col-span-2">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(123)-456-7890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service Type *</Label>
                      <Select
                        value={formData.service}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                        disabled={status === "loading"}
                      >
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.label}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => {
                          console.log("Selected date:", e.target.value)
                          setFormData((prev) => ({ ...prev, date: e.target.value }))
                        }}
                        min={minDate}
                        required
                        disabled={status === "loading"}
                      />
                      <p className="text-xs text-muted-foreground">We'll confirm availability</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <Select
                        value={formData.time}
                        onValueChange={(value) => {
                          console.log("Selected time:", value)
                          setFormData((prev) => ({ ...prev, time: value }))
                        }}
                        disabled={status === "loading"}
                      >
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">We'll confirm availability</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Notes</Label>
                    <Textarea
                      id="message"
                      placeholder="Any specific requests or preferences..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={status === "loading"}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                    {status === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </>
                    )}
                  </Button>

                  {/* Status Messages - Now inside the form card */}
                  {status === "success" && (
                    <div className="rounded-lg border border-green-500 bg-green-50 p-4 dark:bg-green-950">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">{responseMessage}</p>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-950">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{responseMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* reCAPTCHA Notice */}
                  <p className="text-center text-xs text-muted-foreground">
                    This site is protected by reCAPTCHA and the Google{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://policies.google.com/terms"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>{" "}
                    apply.
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border bg-card">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-card-foreground">Contact Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-card-foreground">Location</p>
                        <p className="text-sm text-muted-foreground">Calgary, Alberta</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-card-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">Call for appointment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-card-foreground">Hours</p>
                        <p className="text-sm text-muted-foreground">By appointment only</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-secondary/50">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">How It Works</h3>
                  <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <li>1. Fill out the booking form</li>
                    <li>2. We'll add you to our calendar</li>
                    <li>3. You'll receive a calendar invite via email</li>
                    <li>4. We'll contact you to confirm details</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function BookingSection({ recaptchaKey }: { recaptchaKey: string }) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <BookingSectionContent />
    </GoogleReCaptchaProvider>
  )
}
