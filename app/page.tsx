import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ReviewsSection } from "@/components/reviews-section"
import { BookingSection } from "@/components/booking-section"
import { Footer } from "@/components/footer"
import { getRecaptchaSiteKey } from "@/app/actions/get-recaptcha-key"

export default async function Home() {
  const recaptchaKey = await getRecaptchaSiteKey()

  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <ReviewsSection />
      <BookingSection recaptchaKey={recaptchaKey} />
      <Footer />
    </main>
  )
}
