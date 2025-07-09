import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HeaderSection } from "@/components/shared/header-section"

const pricingFaqData = [
  {
    id: "item-1",
    question:
      "What is the difference between NestSaaS and other SaaS boilerplates?",
    answer:
      "NestSaaS comes with several unique features that set it apart from other SaaS boilerplates. Not only SaaS, But also CMS.1. Payment and multi-sense subscription, including one-time orders and recurring plans, with Stripe integration; 2. A polished blog system powered by Content Collections and Markdown; 3. With a media library to store and manage your media files; 4. And a lot more features...",
  },
  {
    id: "item-2",
    question: "How to diliver NestSaaS after purchase?",
    answer:
      "The NestSaaS is delivered via GitHub private repository. If you login with a GitHub account, after purchase, you will receive the collaborator invitation. After accepting the invitation, you will be able to access the repository and start building right away. If you are logged in with a different account, you can still purchase the NestSaaS and we will ask you to fill in your GitHub username at the Stripe checkout. If payment is successful, but no collaborator invitation is received, no worry, please contact us for assistance.",
  },
  {
    id: "item-3",
    question: "Can I use the code for commercial projects?",
    answer:
      "Yes, your purchase includes a license to use the code in both personal and commercial projects. However, you cannot resell or redistribute the code as-is.",
  },
  {
    id: "item-4",
    question: "Can I see what I am getting before I pay?",
    answer:
      "Yes, you can check out the live demo to experience the SaaS website firsthand. Feel free to sign up for a free account and even test the full payment flow using Stripe test cards. You can also check out the documentation to learn more about the features and capabilities of NestSaaS.",
  },
  {
    id: "item-5",
    question: "How do I get technical support?",
    answer:
      "You can find detailed guides in our documentation. If you need further help, feel free to open an issue or start a discussion on the GitHub repository, connect with me on Discord, follow me on Twitter, or email us directly at support@nestsaas.com.",
  },
  {
    id: "item-6",
    question: "Can I get a refund?",
    answer:
      "Once you gain access to the private GitHub repository, NestSaaS becomes yours permanently, and we’re unable to offer refunds.",
  },
]

export default function PricingFaq() {
  return (
    <section id="faq" className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Explore our comprehensive FAQ to find quick answers to common
          inquiries. If you need further assistance, don't hesitate to
          contact us for personalized help."
      />

      <Accordion
        type="single"
        collapsible
        className="my-12 w-full rounded-xl border p-8"
      >
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
