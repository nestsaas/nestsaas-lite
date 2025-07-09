import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import { emailStyles } from './styles';

export interface NewsletterEmailProps {
  firstName?: string;
  subject: string;
  content: string;
  unsubscribeUrl: string;
}

export const NewsletterEmail = ({
  firstName = '',
  subject,
  content,
  unsubscribeUrl,
}: NewsletterEmailProps) => {
  const { main, container, h1, text, footer, link } = emailStyles;
  
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{subject}</Heading>
          <Text style={text}>
            {firstName ? `Hi ${firstName},` : 'Hello,'}
          </Text>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <Text style={footer}>
            You're receiving this email because you subscribed to our newsletter.{' '}
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe
            </Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterEmail;
