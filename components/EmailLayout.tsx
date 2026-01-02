import {
  Body,
  Container,
  Head,
  Html,
  Preview,
} from '@react-email/components'
import * as React from 'react'


const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  preview,
  children,
}) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>{children}</Container>
    </Body>
  </Html>
)
