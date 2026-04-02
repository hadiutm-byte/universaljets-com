import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Universal Jets"

interface RequestConfirmationProps {
  name?: string
  departure?: string
  destination?: string
  date?: string
  passengers?: string | number
  source?: string
  aircraft?: string
}

const sourceConfig: Record<string, { label: string; message: string; previewPrefix: string }> = {
  website: {
    label: 'Flight Request',
    message: 'Your flight request has been received. A dedicated aviation advisor will review your requirements and present tailored options — typically within the hour.',
    previewPrefix: 'Your flight request',
  },
  homepage_widget: {
    label: 'Flight Search',
    message: 'Your flight search has been received. Our team is sourcing the best available aircraft for your route and will follow up shortly.',
    previewPrefix: 'Your flight search',
  },
  contact_form: {
    label: 'Inquiry',
    message: 'Thank you for reaching out. A member of our team will respond to your inquiry promptly.',
    previewPrefix: 'Your inquiry',
  },
  membership_enrollment: {
    label: 'Membership Application',
    message: 'Your membership application has been received. Our membership committee will review your profile and a dedicated advisor will be in touch to discuss next steps.',
    previewPrefix: 'Your membership application',
  },
  membership_page: {
    label: 'Membership Application',
    message: 'Your membership application has been received. Our membership committee will review your profile and a dedicated advisor will be in touch to discuss next steps.',
    previewPrefix: 'Your membership application',
  },
  founders_circle: {
    label: 'Founders Circle Application',
    message: 'Your Founders Circle application has been received. Given the exclusivity of this programme, a senior advisor will personally review your submission and reach out within 24 hours.',
    previewPrefix: 'Your Founders Circle application',
  },
  empty_leg_inquiry: {
    label: 'Empty Leg Inquiry',
    message: 'Your empty leg inquiry has been received. As empty legs are time-sensitive, our team will confirm availability and pricing as quickly as possible — often within minutes.',
    previewPrefix: 'Your empty leg inquiry',
  },
  aircraft_guide: {
    label: 'Aircraft Request',
    message: 'Your aircraft request has been received. Our fleet specialists will source availability and present you with options tailored to your requirements.',
    previewPrefix: 'Your aircraft request',
  },
  acmi_inquiry: {
    label: 'ACMI Leasing Inquiry',
    message: 'Your ACMI leasing inquiry has been received. Our commercial aviation team will review your operational requirements and respond with a detailed proposal.',
    previewPrefix: 'Your ACMI leasing inquiry',
  },
  partner_inquiry: {
    label: 'Partnership Inquiry',
    message: 'Your partnership inquiry has been received. Our business development team will review your proposal and reach out to discuss potential collaboration.',
    previewPrefix: 'Your partnership inquiry',
  },
  jet_card_inquiry: {
    label: 'Jet Card Inquiry',
    message: 'Your Jet Card inquiry has been received. A dedicated advisor will present you with the Altus Jet Card programme details and tailor a plan to your travel profile.',
    previewPrefix: 'Your Jet Card inquiry',
  },
  corporate_inquiry: {
    label: 'Corporate Inquiry',
    message: 'Your corporate inquiry has been received. Our enterprise aviation team will review your requirements and propose a bespoke solution for your organisation.',
    previewPrefix: 'Your corporate inquiry',
  },
  newsletter: {
    label: 'Newsletter Subscription',
    message: 'You have been added to our exclusive Jet Charter Secrets newsletter. Expect curated insights on private aviation, empty leg opportunities, and destination intelligence.',
    previewPrefix: 'Welcome to Jet Charter Secrets',
  },
}

const defaultConfig = {
  label: 'Request',
  message: 'Your request has been received. A member of our team will be in touch shortly.',
  previewPrefix: 'Your request',
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

  const config = sourceConfig[source || ''] || defaultConfig
  const greeting = name ? `Dear ${name},` : 'Dear Client,'
  const hasTripDetails = departure && departure !== 'N/A' && departure !== 'Newsletter'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{config.previewPrefix} has been received — Universal Jets</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={brandText}>UNIVERSAL JETS</Text>
            <Heading style={h1}>{config.label} Received</Heading>
          </Section>

          <Hr style={divider} />

          <Text style={text}>{greeting}</Text>
          <Text style={text}>{config.message}</Text>

          {hasTripDetails && (
            <Section style={summaryBox}>
              <Heading as="h2" style={h2}>Your Details</Heading>
              {departure && <Text style={detail}><strong>From:</strong> {departure}</Text>}
              {destination && <Text style={detail}><strong>To:</strong> {destination}</Text>}
              {date && <Text style={detail}><strong>Date:</strong> {date}</Text>}
              {passengers && <Text style={detail}><strong>Passengers:</strong> {passengers}</Text>}
              {aircraft && <Text style={detail}><strong>Aircraft:</strong> {aircraft}</Text>}
            </Section>
          )}

          <Text style={text}>
            For immediate assistance, our team is available 24/7 via WhatsApp or by phone at <strong>+971 58 263 5338</strong>.
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            This is an automated confirmation from {SITE_NAME}. Please do not reply directly to this email.
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
    const config = sourceConfig[data.source || ''] || defaultConfig
    return `${config.previewPrefix} has been received — Universal Jets`
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
