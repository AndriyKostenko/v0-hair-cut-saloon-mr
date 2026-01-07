import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ success: false, error: "No reCAPTCHA token provided" }, { status: 400 })
    }

    // Verify the reCAPTCHA token with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`

    const verifyResponse = await fetch(verifyUrl, {
      method: "POST",
    })

    const verifyData = await verifyResponse.json()

    if (verifyData.success && verifyData.score >= 0.5) {
      return NextResponse.json({
        success: true,
        score: verifyData.score,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "reCAPTCHA verification failed",
          score: verifyData.score,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error)
    return NextResponse.json({ success: false, error: "Verification error" }, { status: 500 })
  }
}
