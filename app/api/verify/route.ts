export async function POST(request: Request) {
  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

  if (!RECAPTCHA_SECRET_KEY) {
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
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: verifyPayload,
    })

    const data = await response.json()

    if (data.success && score >= 0.5) {
      return Response.json({ success: true, score }, { status: 200 })
    } 
    return Response.json({ success: false, error: "Verification failed", details: data }, { status: 400 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "reCAPTCHA verification failed", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
