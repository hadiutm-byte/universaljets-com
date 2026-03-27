import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Universal Jets"
const SITE_URL = "https://universaljets.com"

interface RequestConfirmationProps {
  name?: string
  departure?: string
  destination?: string
  date?: string
  passengers?: string | number
  source?: string
  aircraft?: string
}

const sourceMessages: Record<string, string> = {
  website: 'flight request',
  contact_form: 'inquiry',
  membership_enrollment: 'membership application',
  membership_page: 'membership application',
  founders_circle: 'Founders Circle application',
  empty_leg_inquiry: 'empty leg inquiry',
  aircraft_guide: 'aircraft request',
  acmi_inquiry: 'ACMI leasing inquiry',
  partner_inquiry: 'partnership inquiry',
  jet_card_inquiry: 'Jet Card inquiry',
  corporate_inquiry: 'corporate inquiry',
}

const RequestConfirmationEmail = (props: RequestConfirmationProps) => {
  const {
    name = '',
    departure = '',
    destination = '',
    date = '',
    passengers = '',
    source = 'website',
    aircraft = '',
  } = props

  const greeting = name ? `Dear ${name},` : 'Dear Client,'
  const requestType = sourceMessages[source || ''] || 'request'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your {requestType} has been received — Universal Jets</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={brandText}>UNIVERSAL JETS</Text>
            <Heading style={h1}>Request Received</Heading>
          </Section>

          <Hr style={divider} />

          <Text style={text}>{greeting}</Text>
          <Text style={text}>
            Thank you for submitting your {requestType}. Our aviation advisory team has received your details and will be in touch shortly — typically within the hour.
          </Text>

          {(departure || destination) && (
            <Section style={summaryBox}>
              <Heading as="h2" style={h2}>Your Trip Summary</Heading>
              {departure && <Text style={detail}><strong>From:</strong> {departure}</Text>}
              {destination && <Text style={detail}><strong>To:</strong> {destination}</Text>}
              {date && <Text style={detail}><strong>Date:</strong> {date}</Text>}
              {passengers && <Text style={detail}><strong>Passengers:</strong> {passengers}</Text>}
              {aircraft && <Text style={detail}><strong>Aircraft:</strong> {aircraft}</Text>}
            </Section>
          )}

          <Text style={text}>
            If you need immediate assistance, our team is available 24/7 via WhatsApp or phone at <strong>+971 58 263 5338</strong>.
          </Text>

          <Section style={ctaSection}>
            <Button style={button} href={`https://wa.me/971582635338`}>
              Chat on WhatsApp
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={footer}>
            This is an automated confirmation from {SITE_NAME}. Please do not reply to this email.
          </Text>
          <Text style={footerNote}>
            Universal Jets — Private Aviation, Elevated.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: RequestConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const type = sourceMessages[data.source || ''] || 'request'
    return `Your ${type} has been received — Universal Jets`
  },
  displayName: 'Request confirmation',
  previewData: {
    name: 'Ricky Smith',
    departure: 'Dubai (DXB)',
    destination: 'London (LTN)',
    date: '2026-04-15',
    passengers: '4',
    source: 'website',
    aircraft: 'Gulfstream G650',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '580px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, paddingBottom: '10px' }
const brandText = { fontSize: '11px', letterSpacing: '3px', color: '#A8850F', fontWeight: '600', margin: '0 0 8px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#121212', margin: '0 0 8px', fontFamily: "'Playfair Display', Georgia, serif" }
const h2 = { fontSize: '14px', fontWeight: '600', color: '#A8850F', letterSpacing: '1px', textTransform: 'uppercase' as const, margin: '0 0 10px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.7', margin: '0 0 16px' }
const detail = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 6px' }
const summaryBox = { backgroundColor: '#FAFAF7', padding: '16px 20px', borderRadius: '8px', borderLeft: '3px solid #A8850F', margin: '16px 0' }
const divider = { borderColor: '#A8850F', borderWidth: '1px', margin: '20px 0' }
const ctaSection = { textAlign: 'center' as const, margin: '20px 0' }
const button = { backgroundColor: '#A8850F', color: '#ffffff', padding: '12px 28px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }
const footer = { fontSize: '11px', color: '#999999', margin: '16px 0 4px', textAlign: 'center' as const }
const footerNote = { fontSize: '11px', color: '#BBBBBB', margin: '0', textAlign: 'center' as const }
