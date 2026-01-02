import { Section, Heading } from '@react-email/components'
import * as React from 'react'


const detailsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 24px',
}

const labelCell = {
  color: '#666',
  fontWeight: 'bold',
  padding: '8px 8px 8px 0',
  verticalAlign: 'top' as const,
  width: '30%',
}

const valueCell = {
  color: '#333',
  padding: '8px 0',
}

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px',
}


interface Row {
  label: string
  value: React.ReactNode
}

interface DetailsTableProps {
  title: string
  rows: Row[]
}

export const DetailsTable: React.FC<DetailsTableProps> = ({
  title,
  rows,
}) => (
  <Section style={detailsBox}>
    <Heading style={h2}>{title}</Heading>

    <table style={{ width: '100%', marginTop: '16px' }}>
      <tbody>
        {rows.map(({ label, value }) => (
          <tr key={label}>
            <td style={labelCell}>{label}</td>
            <td style={valueCell}>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Section>
)
