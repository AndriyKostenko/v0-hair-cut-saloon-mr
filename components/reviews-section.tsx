import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "Jing Hu",
    rating: 5,
    text: "Joanne did the cut for my daughter whose hair had never been cut short. We showed Joanne the desired look and she did it with confidence. Joanne is patient and did an amazing job!",
    date: "5 months ago",
  },
  {
    name: "Jeawon Lee",
    rating: 5,
    text: "I got a digital perm from Ann and she took really good care of my hair. I was very happy with the trim and curls — they turned out so nice!",
    date: "3 months ago",
  },
  {
    name: "Sumit Sharma",
    rating: 5,
    text: "Miss Joan has been providing awesome services to us since 2020. Very detailed and classic piece of work with immense experience, expertise and patience.",
    date: "a month ago",
  },
  {
    name: "콩찡",
    rating: 5,
    text: "This salon literally saved my life! I felt like I needed a haircut for so long and once I came out of the salon, girl I look so different. The staffs are so nice and pretty!",
    date: "5 months ago",
  },
  {
    name: "Esther Seo",
    rating: 5,
    text: "I love this Salon so much! I did not think much of it at first but after your haircut it is mind blowing! I thought I could not look good with a perm but surprisingly, this salon pulled it off!",
    date: "5 months ago",
  },
  {
    name: "Ally",
    rating: 5,
    text: "Joanne gave me exactly the haircut I wanted. I absolutely love it! Great head massage while she washed my hair, and she cut and styled it quickly and for a great price.",
    date: "4 years ago",
  },
]

export function ReviewsSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {"Real reviews from satisfied customers who love their new look"}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-pretty leading-relaxed text-card-foreground">{review.text}</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-card-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
