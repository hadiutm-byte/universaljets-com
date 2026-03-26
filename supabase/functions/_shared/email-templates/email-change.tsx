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

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change — Universal Jets</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>UNIVERSAL JETS</Text>
        <Hr style={divider} />
        <Heading style={h1}>Confirm Your Email Change</Heading>
        <Text style={text}>
          You requested to change your Universal Jets email from{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
        </Text>
        <Text style={text}>
          Click the button below to confirm this change:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          If you didn't request this change, please secure your account immediately.
        </Text>
        <Hr style={divider} />
        <Text style={legal}>
          Universal Jets Aviation Brokerage FZCO · Dubai, UAE
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

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
