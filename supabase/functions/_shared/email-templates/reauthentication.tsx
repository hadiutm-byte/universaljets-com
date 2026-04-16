/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

const LOGO_URL = 'https://zfuiwvvtjgcpwmhpqoaz.supabase.co/storage/v1/object/public/email-assets/logo.png'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Universal Jets verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} width="48" height="48" alt="Universal Jets" style={logo} />
        </Section>
        <Section style={divider} />
        <Heading style={h1}>Verification Code</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>This code will expire shortly. If you didn't request this, you can safely ignore this email.</Text>
        <Section style={divider} />
        <Text style={brand}>Universal Jets — Private Aviation, Perfected.</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Poppins', 'Montserrat', Arial, sans-serif" }
const container = { padding: '40px 32px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = { display: 'inline-block' }
const divider = { borderTop: '1px solid #D4A843', margin: '24px 0', opacity: 0.4 }
const h1 = { fontSize: '24px', fontWeight: '600' as const, fontFamily: "'Montserrat', Arial, sans-serif", color: '#0A0A0A', margin: '0 0 16px', letterSpacing: '-0.01em' }
const text = { fontSize: '14px', color: '#3a3a3a', lineHeight: '1.6', margin: '0 0 20px' }
const codeStyle = { fontFamily: "'Montserrat', Courier, monospace", fontSize: '28px', fontWeight: '700' as const, color: '#D4A843', margin: '0 0 30px', letterSpacing: '0.15em', textAlign: 'center' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '24px 0 0' }
const brand = { fontSize: '11px', color: '#b8b8b8', textAlign: 'center' as const, fontFamily: "'Montserrat', Arial, sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' as const }
