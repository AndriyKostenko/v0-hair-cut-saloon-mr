export async function POST(request: Request) {
  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
  if (!RECAPTCHA_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Recaptcha secret key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { token } = await request.json()

  console.log("[v0] Received token:", token)
  console.log("[v0] Token type:", typeof token)
  console.log("[v0] Token length:", token?.length)

  try {
    const verifyPayload = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token,
    })

    console.log("[v0] Sending to Google:", verifyPayload.toString())

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyPayload.toString(),
    })

    const data = await response.json()
    console.log("[v0] Google response:", JSON.stringify(data))

    if (data.success && data.score >= 0.3) {
      return Response.json({ success: true }, { status: 200 })
    }
    return Response.json({ success: false, error: "Bot detected", details: data }, { status: 400 })
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return new Response(JSON.stringify({ error: "reCAPTCHA verification failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
