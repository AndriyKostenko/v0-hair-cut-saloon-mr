import * as React from 'react'
import { Heading, Text, Hr } from '@react-email/components'
import { EmailLayout } from './EmailLayout'
import { DetailsTable } from './DetailsTable'
import { CalendarButton } from './CalendarButton'


const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 24px',
}

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 24px',
}

interface BookingProps {
  customerName: string
  service: string
  date: string
  time: string
  location: string
  phone: string
  eventLink?: string
}

const footer = {
  color: '#888',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0',
  padding: '0 24px',
}

const hr = {
  borderColor: '#eee',
  margin: '24px 0',
}

interface SalonProps {
  customerName: string
  customerEmail: string
  customerPhone: string
  service: string
  date: string
  time: string
  message?: string
  eventLink?: string
}



export const BookingConfirmationEmail: React.FC<BookingProps> = ({
  customerName,
  service,
  date,
  time,
  location,
  phone,
  eventLink,
}) => (
  <EmailLayout preview="Your appointment at Hair Glamour Calgary is confirmed!">
    <Heading style={h1}>Appointment Confirmed 💇</Heading>

    <Text style={text}>Hi {customerName},</Text>
    <Text style={text}>
      Your hair appointment at Hair Glamour Calgary has been confirmed.
    </Text>

    <DetailsTable
      title="Appointment Details"
      rows={[
        { label: 'Service', value: service },
        { label: 'Date', value: date },
        { label: 'Time', value: time },
        { label: 'Location', value: location },
        { label: 'Phone', value: phone },
      ]}
    />

    <Hr style={hr} />

    <Text style={footer}>
      Need to reschedule or cancel? Call us at {phone}.
    </Text>
    <Text style={footer}>We look forward to seeing you!</Text>
  </EmailLayout>
)


export const SalonNotificationEmail: React.FC<SalonProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  service,
  date,
  time,
  message,
  eventLink,
}) => (
  <EmailLayout preview={`New booking from ${customerName}`}>
    <Heading style={h1}>New Appointment 📅</Heading>

    <Text style={text}>
      A new appointment has been booked through the website.
    </Text>

    <DetailsTable
      title="Customer Information"
      rows={[
        { label: 'Name', value: customerName },
        { label: 'Email', value: customerEmail },
        { label: 'Phone', value: customerPhone },
      ]}
    />

    <DetailsTable
      title="Appointment Details"
      rows={[
        { label: 'Service', value: service },
        { label: 'Date', value: date },
        { label: 'Time', value: time },
      ]}
    />

    {message && (
      <DetailsTable
        title="Additional Notes"
        rows={[{ label: 'Message', value: message }]}
      />
    )}

    <CalendarButton href={eventLink} label="View in Google Calendar" />
  </EmailLayout>
)
