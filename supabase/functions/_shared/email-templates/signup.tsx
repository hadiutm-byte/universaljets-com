/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to Universal Jets — Confirm your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>UNIVERSAL JETS</Text>
        <Hr style={divider} />
        <Heading style={h1}>Welcome Aboard</Heading>
        <Text style={text}>
          Thank you for joining{' '}
          <Link href={siteUrl} style={link}>
            <strong>Universal Jets</strong>
          </Link>
          .
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) to activate your private aviation account:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm My Email
        </Button>
        <Text style={footer}>
          If you didn't create an account with Universal Jets, you can safely ignore this email.
        </Text>
        <Hr style={divider} />
        <Text style={legal}>
          Universal Jets Aviation Brokerage FZCO · Dubai, UAE
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }
const container = { padding: '40px 32px', maxWidth: '480px', margin: '0 auto' }
const brand = { fontSize: '11px', letterSpacing: '0.4em', color: '#A8850F', fontWeight: '600' as const, margin: '0 0 20px', textAlign: 'center' as const }
const divider = { borderColor: '#f0f0f0', margin: '20px 0' }
const h1 = { fontSize: '24px', fontWeight: '600' as const, color: '#121212', margin: '0 0 20px', fontFamily: "'Playfair Display', Georgia, serif" }
const text = { fontSize: '14px', color: '#6F6F6F', lineHeight: '1.7', margin: '0 0 20px' }
const link = { color: '#A8850F', textDecoration: 'underline' }
const button = { backgroundColor: '#A8850F', color: '#ffffff', fontSize: '13px', letterSpacing: '0.15em', borderRadius: '12px', padding: '14px 28px', textDecoration: 'none', fontWeight: '500' as const, textTransform: 'uppercase' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '28px 0 0', lineHeight: '1.6' }
const legal = { fontSize: '10px', color: '#cccccc', textAlign: 'center' as const, margin: '0' }
