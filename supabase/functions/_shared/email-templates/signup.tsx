/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

const LOGO_URL = 'https://zfuiwvvtjgcpwmhpqoaz.supabase.co/storage/v1/object/public/email-assets/logo.png'

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to Universal Jets — confirm your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} width="48" height="48" alt="Universal Jets" style={logo} />
        </Section>
        <Section style={divider} />
        <Heading style={h1}>Welcome Aboard</Heading>
        <Text style={text}>
          Thank you for joining{' '}
          <Link href={siteUrl} style={link}>
            <strong>Universal Jets</strong>
          </Link>
          . Your gateway to ultra-luxury private aviation awaits.
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) to get started:
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Confirm Email
          </Button>
        </Section>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
        <Section style={divider} />
        <Text style={brand}>Universal Jets — Private Aviation, Perfected.</Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Poppins', 'Montserrat', Arial, sans-serif" }
const container = { padding: '40px 32px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = { display: 'inline-block' }
const divider = { borderTop: '1px solid #D4A843', margin: '24px 0', opacity: 0.4 }
const h1 = {
  fontSize: '24px',
  fontWeight: '600' as const,
  fontFamily: "'Montserrat', Arial, sans-serif",
  color: '#0A0A0A',
  margin: '0 0 16px',
  letterSpacing: '-0.01em',
}
const text = { fontSize: '14px', color: '#3a3a3a', lineHeight: '1.6', margin: '0 0 20px' }
const link = { color: '#B8902E', textDecoration: 'underline' }
const buttonSection = { textAlign: 'center' as const, margin: '28px 0' }
const button = {
  backgroundColor: '#D4A843',
  color: '#0A0A0A',
  fontSize: '13px',
  fontWeight: '600' as const,
  fontFamily: "'Montserrat', Arial, sans-serif",
  borderRadius: '8px',
  padding: '14px 28px',
  textDecoration: 'none',
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
}
const footer = { fontSize: '12px', color: '#999999', margin: '24px 0 0' }
const brand = {
  fontSize: '11px',
  color: '#b8b8b8',
  textAlign: 'center' as const,
  fontFamily: "'Montserrat', Arial, sans-serif",
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
}
