import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import oath2Client from '@/app/utils/google_auth'

// Initialize Google Calendar API with OAuth2
async function getCalendarClient() {
  const cookieStore = await cookies()
  const tokensCookie = cookieStore.get('google_tokens')

  if (!tokensCookie) {
    throw new Error('No authentication tokens found. Please log in with Google.')
  }

  try {
    const tokens = JSON.parse(tokensCookie.value)
    oath2Client.setCredentials(tokens)

    // Check if token is expired and refresh if needed
    if (tokens.expiry_date && tokens.expiry_date <= Date.now()) {
      const { credentials } = await oath2Client.refreshAccessToken()
      oath2Client.setCredentials(credentials)

      // Update the cookie with new tokens
      cookieStore.set('google_tokens', JSON.stringify(credentials), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600,
      })
    }

    return google.calendar({ version: 'v3', auth: oath2Client })
  } catch (error) {
    console.error('Error setting up calendar client:', error)
    throw new Error('Failed to authenticate with Google Calendar')
  }
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

      // Check if user is authenticated
      const cookieStore = await cookies()
      const tokensCookie = cookieStore.get('google_tokens')

      if (!tokensCookie) {
        return NextResponse.json(
          { error: 'Authentication required. Please log in with Google.' },
          { status: 401 }
        )
      }

      // Create calendar event
      let calendar
      try {
        calendar = await getCalendarClient()
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Authentication error', details: error.message },
          { status: 401 }
        )
      }

      // Parse date and time, or use a default (next available slot)
      let startDateTime: Date
      let endDateTime: Date

      if (date && time) {
        // Ensure proper ISO format: YYYY-MM-DDTHH:MM
        const dateTimeString = `${date}T${time}:00`
        startDateTime = new Date(dateTimeString)

        // Validate the date is valid
        if (isNaN(startDateTime.getTime())) {
          return NextResponse.json(
            { error: 'Invalid date or time format' },
            { status: 400 }
          )
        }

        endDateTime = new Date(startDateTime.getTime() + 60 * 20 * 1000) // 20 mins  duration
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
          },
          attendees: [
            { email: email, displayName: name },
            { email: process.env.SALON_EMAIL},
          ],
        }

        // Insert the event into the calendar
        const response = await calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          requestBody: event,
          sendUpdates: 'all', // Send notifications
        })

        console.log('Calendar event created:', response.data.id)

        return NextResponse.json({
          success: true,
          message: 'Appointment booked successfully!',
          eventId: response.data.id,
          eventLink: response.data.htmlLink,
        })

      }

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
