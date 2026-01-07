export async function POST(request: Request) {
  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

  if (!RECAPTCHA_SECRET_KEY) {
    console.error("[v0] RECAPTCHA_SECRET_KEY is not set in environment variables")
    return new Response(JSON.stringify({ error: "Recaptcha secret key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }


  const { token } = await request.json()



  if (!token) {
    return new Response(JSON.stringify({ error: "Token is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const verifyPayload = `secret=${encodeURIComponent(RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(token)}`

    console.log("[v0] Sending verification request to Google")

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: verifyPayload,
    })

    const data = await response.json()
    console.log("[v0] Google response:", JSON.stringify(data))

    if (data["error-codes"]) {
      console.error("[v0] reCAPTCHA error codes:", data["error-codes"])

      if (data["error-codes"].includes("invalid-input-response")) {
        console.error("[v0] ERROR: The response token is not valid for this secret key.")
        console.error("[v0] This usually means:")
        console.error("[v0] 1. The secret key doesn't match the site key used to generate the token")
        console.error("[v0] 2. The token has expired (tokens are valid for 2 minutes)")
        console.error("[v0] 3. The secret key is incorrect or from a different reCAPTCHA project")
        console.error("[v0] Please verify your RECAPTCHA_SECRET_KEY matches your NEXT_PUBLIC_RECAPTCHA_SITE_KEY")
      }

      if (data["error-codes"].includes("invalid-input-secret")) {
        console.error("[v0] ERROR: The secret key is invalid. Please check your environment variable.")
      }
    }

    if (data.success) {
      const score = data.score ?? 1.0
      console.log("[v0] reCAPTCHA score:", score)

      if (score >= 0.5) {
        return Response.json({ success: true, score }, { status: 200 })
      } else {
        return Response.json({ success: false, error: "Low score", score, details: data }, { status: 400 })
      }
    }

    return Response.json({ success: false, error: "Verification failed", details: data }, { status: 400 })
  } catch (error) {
    console.error("[v0] reCAPTCHA verification error:", error)
    return new Response(JSON.stringify({ error: "reCAPTCHA verification failed", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
