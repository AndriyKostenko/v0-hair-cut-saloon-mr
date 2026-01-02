import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ReviewsSection } from "@/components/reviews-section"
import { BookingSection } from "@/components/booking-section"
import { Footer } from "@/components/footer"
import oath2Client from "./utils/google_auth"


export default function Home() {
  // Creating scopes for Google OAuth2
  // const SCOPE = [
  //   "https://www.googleapis.com/auth/calendar",
  //   "https://www.googleapis.com/auth/userinfo.profile",
  //   "https://www.googleapis.com/auth/userinfo.email",
  // ]

  // const authorizationUrl = oath2Client.generateAuthUrl({
  //   access_type: "offline",
  //   scope: SCOPE,
  // })

  // console.log("Google Auth URL:", authorizationUrl)
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <ReviewsSection />
      <BookingSection />
      <Footer />
    </main>
  )
}
