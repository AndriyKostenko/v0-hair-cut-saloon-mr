import { Section, Button } from '@react-email/components'


const button = {
  backgroundColor: '#28a745',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

export const CalendarButton = ({
  href,
  label,
}: {
  href?: string
  label: string
}) =>
  href ? (
    <Section style={{ textAlign: 'center', marginTop: 24 }}>
      <Button style={button} href={href}>
        {label}
      </Button>
    </Section>
  ) : null
