import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { BookingConfirmationEmail, SalonNotificationEmail } from '@/components/email-template'


// Initialize Google Calendar API with Service Account
async function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  // generating auth token
  await auth.authorize()
  return google.calendar({ version: 'v3', auth })
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name, email, phone, service, message, date, time } = body

    // Validate required fields
    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if environment variables are set
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
      console.error('Missing Google Calendar API credentials')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Create calendar event
    const calendar = await getCalendarClient()

    // Parse date and time
    const dateTimeString = `${date}T${time}:00`
    const startDateTime = new Date(dateTimeString)

    // Validate the date is valid
    if (isNaN(startDateTime.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date or time format' },
        { status: 400 }
      )
    }

    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 hour duration

    // Create event object
    const event = {
      summary: `Hair Appointment - ${name}`,
      location: 'Hair Glamour Calgary',
      description: `
                Client Information:
                - Name: ${name}
                - Phone: ${phone}
                - Email: ${email}
                - Service: ${service}
                ${message ? `- Notes: ${message}` : ''}

                This appointment was booked through the Hair Glamour website.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Edmonton', // Calgary timezone
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Edmonton',
      }
    }

    // Insert the event into the calendar
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    })

    console.log('Calendar event created:', response.data.id)

    // Format date and time for emails
    const formattedDate = new Date(startDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const formattedTime = new Date(startDateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send confirmation email to customer
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: `Appointment Confirmed - ${formattedDate}`,
        react: BookingConfirmationEmail({
          customerName: name,
          service,
          date: formattedDate,
          time: formattedTime,
          location: 'Hair Glamour Calgary',
          phone: process.env.SALON_PHONE || phone,
          eventLink: response.data.htmlLink,
        }),
      })
      if (error) {
        console.error('Error sending customer email:', error)
        return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 })
      }
      console.log('Confirmation email sent to customer')
    } catch (emailError) {
      console.error('Error sending customer email:', emailError)
      // Don't fail the whole request if email fails
    }

    // Send notification email to salon
    if (process.env.SALON_EMAIL) {
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: process.env.SALON_EMAIL,
          subject: `New Booking: ${name} - ${formattedDate}`,
          react: SalonNotificationEmail({
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            service,
            date: formattedDate,
            time: formattedTime,
            message,
            eventLink: response.data.htmlLink,
          }),
        })
        if (error) {
          console.error('Error sending salon email:', error)
          return NextResponse.json({ error: 'Failed to send salon notification email' }, { status: 500 })
        }

        console.log('Notification email sent to salon')
      } catch (emailError) {
        console.error('Error sending salon email:', emailError)
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully! You will receive a confirmation email.',
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    })
  } catch (error: any) {
    console.error('Error creating calendar event:', error)

    return NextResponse.json(
      {
        error: 'Failed to book appointment',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
