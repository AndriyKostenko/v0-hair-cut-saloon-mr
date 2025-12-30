import { Scissors } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6" />
              <span className="text-xl font-bold">Hair Glamour</span>
            </div>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {"Calgary's premier Korean hair salon offering expert cuts, perms, and coloring services."}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Haircuts & Styling</li>
              <li>Digital Perms</li>
              <li>Hair Coloring</li>
              <li>Highlights</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Calgary, Alberta</li>
              <li>By Appointment Only</li>
              <li>Call to Schedule</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Tuesday - Saturday</li>
              <li>By Appointment</li>
              <li>Closed Sunday & Monday</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Hair Glamour. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
