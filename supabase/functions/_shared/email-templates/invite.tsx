/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to Universal Jets</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>UNIVERSAL JETS</Text>
        <Hr style={divider} />
        <Heading style={h1}>You're Invited</Heading>
        <Text style={text}>
          You've been personally invited to join the Universal Jets Private Access Network. Accept below to create your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </Text>
        <Hr style={divider} />
        <Text style={legal}>
          Universal Jets Aviation Brokerage FZCO · Dubai, UAE
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '40px 32px', maxWidth: '480px', margin: '0 auto' }
const brand = { fontSize: '11px', letterSpacing: '0.4em', color: '#A8850F', fontWeight: '600' as const, margin: '0 0 20px', textAlign: 'center' as const }
const divider = { borderColor: '#f0f0f0', margin: '20px 0' }
const h1 = { fontSize: '24px', fontWeight: '600' as const, color: '#121212', margin: '0 0 20px', fontFamily: "'Playfair Display', Georgia, serif" }
const text = { fontSize: '14px', color: '#6F6F6F', lineHeight: '1.7', margin: '0 0 20px' }
const button = { backgroundColor: '#A8850F', color: '#ffffff', fontSize: '13px', letterSpacing: '0.1em', borderRadius: '6px', padding: '14px 28px', textDecoration: 'none', fontWeight: '600' as const, textTransform: 'uppercase' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '28px 0 0', lineHeight: '1.6' }
const legal = { fontSize: '10px', color: '#cccccc', textAlign: 'center' as const, margin: '0' }
