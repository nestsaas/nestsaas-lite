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
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

import { siteConfig } from "@/config/site"

interface RepositoryAccessEmailProps {
  userName?: string
  userEmail: string
  repositoryName: string
  repositoryOwner: string
  repositoryRepo: string
}

export default function RepositoryAccessEmail({
  userName = "",
  userEmail,
  repositoryName,
  repositoryOwner,
  repositoryRepo,
}: RepositoryAccessEmailProps) {
  const previewText = `Your access to ${repositoryName} is ready`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded bg-white p-10">
            <Heading className="text-2xl font-bold text-gray-900">
              Your Repository Access is Ready
            </Heading>
            <Text className="text-base text-gray-700">
              Hello {userName || userEmail},
            </Text>
            <Text className="text-base text-gray-700">
              Thank you for your purchase! You now have access to the{" "}
              <strong>{repositoryName}</strong> repository.
            </Text>
            <Section className="my-8">
              <Text className="mb-4 text-base text-gray-700">
                You should have received a GitHub invitation to collaborate on
                the repository. If you haven't received it yet, please check
                your GitHub notifications or email associated with your GitHub
                account.
              </Text>
              <Button
                className="bg-primary rounded px-6 py-3 text-center text-sm font-medium text-white"
                href={`https://github.com/${repositoryOwner}/${repositoryRepo}`}
              >
                View Repository on GitHub
              </Button>
            </Section>
            <Hr className="my-6 border border-gray-200" />
            <Text className="text-sm text-gray-700">
              If you have any questions or need assistance, please don't
              hesitate to{" "}
              <Link
                href={`mailto:${siteConfig.mailSupport}`}
                className="text-blue-600 underline"
              >
                contact our support team
              </Link>
              .
            </Text>
            <Text className="text-sm text-gray-700">
              Thanks,
              <br />
              The {siteConfig.name} Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
