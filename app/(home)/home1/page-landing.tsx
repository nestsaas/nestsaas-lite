import { infos } from "@/config/landing"
import { NewsletterSection } from "@/components/newsletter/newsletter-section"

import AdminPanelLanding from "./sections/adminpanel-landing"
import CallAction from "./sections/call-action"
import PricingComparator from "./sections/comparator-landing"
import PricingFaq from "./sections/faq-landing"
import Features from "./sections/features"
import HeroLanding2 from "./sections/hero-landing2"
import InfoLanding from "./sections/info-landing"
import MediaSection from "./sections/media-landing"
import PaymentsLanding from "./sections/payments-landing"
import Powered from "./sections/powered"
import PreviewLanding from "./sections/preview-landing"
import Pricing from "./sections/pricing-landing"

export default function HomePage() {
  return (
    <>
      <HeroLanding2 />
      <PreviewLanding />
      <Powered />
      <InfoLanding data={infos[0]} reverse={true} />
      <Features />
      <PaymentsLanding />
      <AdminPanelLanding />
      <MediaSection />
      <Pricing />
      <PricingComparator />
      <PricingFaq />
      <NewsletterSection className="mb-32" />
      <CallAction />
    </>
  )
}
