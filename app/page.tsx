"use client";

import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ReviewsSection } from "@/components/reviews-section"
import { BookingSection } from "@/components/booking-section"
import { Footer } from "@/components/footer"
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'


export default function Home() {

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <ReviewsSection />
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
        <BookingSection />
      </GoogleReCaptchaProvider>
      <Footer />
    </main>
  )
}
