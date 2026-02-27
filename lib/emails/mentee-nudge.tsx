import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components';

type Props = {
  mentorName: string;
  mentorProfileId: string;
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://caawi.com';

export function MenteeNudgeEmail({ mentorName, mentorProfileId }: Props) {
  const profileUrl = `${baseUrl}/dashboard/mentors/${mentorProfileId}`;

  return (
    <Html>
      <Head />
      <Preview>{mentorName} wants to connect with you on Caawi</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Someone wants to mentor you</Heading>
          <Text style={text}>
            {mentorName} is interested in connecting with you as a mentor. Check out their profile and book a session to
            get started.
          </Text>
          <Section style={buttonSection}>
            <Link href={profileUrl} style={button}>
              View mentor profile
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '480px'
};
const heading = { fontSize: '24px', fontWeight: '600' as const, color: '#1a1a1a', margin: '0 0 16px' };
const text = { fontSize: '16px', lineHeight: '24px', color: '#4a4a4a', margin: '0 0 24px' };
const buttonSection = { textAlign: 'center' as const };
const button = {
  backgroundColor: '#0a0a0a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block'
};
