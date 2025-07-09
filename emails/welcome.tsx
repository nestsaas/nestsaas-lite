import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { emailStyles } from './styles';

export interface WelcomeEmailProps {
  firstName?: string;
  unsubscribeUrl: string;
}

export const WelcomeEmail = ({
  firstName = '',
  unsubscribeUrl,
}: WelcomeEmailProps) => {
  const previewText = `Welcome to our newsletter!`;
  const { main, container, h1, text, footer, link } = emailStyles;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to our newsletter!</Heading>
          <Text style={text}>
            {firstName ? `Hi ${firstName},` : 'Hello,'}
          </Text>
          <Text style={text}>
            Thank you for subscribing to our newsletter. We're excited to share our latest updates and news with you.
          </Text>
          <Text style={text}>
            You'll receive our next newsletter soon. In the meantime, feel free to check out our website for the latest content.
          </Text>
          <Text style={footer}>
            If you didn't subscribe to this newsletter, you can safely ignore this email or{' '}
            <Link href={unsubscribeUrl} style={link}>
              unsubscribe here
            </Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
