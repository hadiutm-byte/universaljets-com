import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Universal Jets"

interface LeadNotificationProps {
  name?: string
  email?: string
  phone?: string
  departure?: string
  destination?: string
  date?: string
  passengers?: string | number
  source?: string
  aircraft?: string
  notes?: string
  special_requests?: string
  submittedAt?: string
}

const LeadNotificationEmail = (props: LeadNotificationProps) => {
  const {
    name = 'Unknown',
    email = '',
    phone = '',
    departure = '',
    destination = '',
    date = '',
    passengers = '',
    source = 'website',
    aircraft = '',
    notes = '',
    special_requests = '',
    submittedAt = new Date().toISOString(),
  } = props

  const sourceLabels: Record<string, string> = {
    website: 'Website Flight Request',
    contact_form: 'Contact Form',
    newsletter: 'Newsletter Signup',
    membership_enrollment: 'Membership Application',
    membership_page: 'Membership Application',
    founders_circle: 'Founders Circle Application',
    empty_leg_inquiry: 'Empty Leg Inquiry',
    aircraft_guide: 'Aircraft Guide Request',
    acmi_inquiry: 'ACMI Leasing Inquiry',
    partner_inquiry: 'Partnership Inquiry',
    jet_card_inquiry: 'Jet Card Inquiry',
    corporate_inquiry: 'Corporate Inquiry',
  }

  const sourceLabel = sourceLabels[source || ''] || source || 'Website'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New {sourceLabel} from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={brandText}>UNIVERSAL JETS</Text>
            <Heading style={h1}>New Lead Received</Heading>
            <Text style={sourceTag}>{sourceLabel}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={detailSection}>
            <Heading as="h2" style={h2}>Contact Details</Heading>
            <Text style={detail}><strong>Name:</strong> {name}</Text>
            {email && <Text style={detail}><strong>Email:</strong> {email}</Text>}
            {phone && <Text style={detail}><strong>Phone:</strong> {phone}</Text>}
          </Section>

          {(departure || destination) && (
            <>
              <Hr style={dividerLight} />
              <Section style={detailSection}>
                <Heading as="h2" style={h2}>Trip Details</Heading>
                {departure && <Text style={detail}><strong>Departure:</strong> {departure}</Text>}
                {destination && <Text style={detail}><strong>Destination:</strong> {destination}</Text>}
                {date && <Text style={detail}><strong>Date:</strong> {date}</Text>}
                {passengers && <Text style={detail}><strong>Passengers:</strong> {passengers}</Text>}
                {aircraft && <Text style={detail}><strong>Aircraft:</strong> {aircraft}</Text>}
              </Section>
            </>
          )}

          {(notes || special_requests) && (
            <>
              <Hr style={dividerLight} />
              <Section style={detailSection}>
                <Heading as="h2" style={h2}>Additional Notes</Heading>
                {notes && <Text style={detail}>{notes}</Text>}
                {special_requests && <Text style={detail}>{special_requests}</Text>}
              </Section>
            </>
          )}

          <Hr style={divider} />

          <Text style={footer}>
            Submitted at {new Date(submittedAt).toLocaleString('en-GB', { timeZone: 'Asia/Dubai' })} (Dubai time)
          </Text>
          <Text style={footerNote}>
            This is an automated notification from {SITE_NAME}. Log in to the CRM to manage this lead.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: LeadNotificationEmail,
  subject: (data: Record<string, any>) => `New Lead: ${data.name || 'Unknown'} — ${data.source || 'Website'}`,
  displayName: 'Lead notification',
  to: 'hadi@universaljets.com',
  previewData: {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+971 50 123 4567',
    departure: 'Dubai (DXB)',
    destination: 'London (LTN)',
    date: '2026-04-15',
    passengers: '4',
    source: 'website',
    aircraft: 'Gulfstream G650',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '580px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, paddingBottom: '10px' }
const brandText = { fontSize: '11px', letterSpacing: '3px', color: '#A8850F', fontWeight: '600', margin: '0 0 8px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#121212', margin: '0 0 8px', fontFamily: "'Playfair Display', Georgia, serif" }
const sourceTag = { fontSize: '12px', color: '#6F6F6F', backgroundColor: '#F3F3F3', display: 'inline-block', padding: '4px 12px', borderRadius: '4px', margin: '0' }
const h2 = { fontSize: '14px', fontWeight: '600', color: '#A8850F', letterSpacing: '1px', textTransform: 'uppercase' as const, margin: '0 0 10px' }
const detail = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 6px' }
const detailSection = { padding: '10px 0' }
const divider = { borderColor: '#A8850F', borderWidth: '1px', margin: '16px 0' }
const dividerLight = { borderColor: '#E5E5E5', margin: '10px 0' }
const footer = { fontSize: '11px', color: '#999999', margin: '16px 0 4px', textAlign: 'center' as const }
const footerNote = { fontSize: '11px', color: '#BBBBBB', margin: '0', textAlign: 'center' as const }
