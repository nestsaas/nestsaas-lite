import { NewsletterForm } from "@/components/newsletter/newsletter-form"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"

interface NewsletterSectionProps {
  title?: string
  description?: string
  className?: string
}

export function NewsletterSection({
  title = "Join the Community",
  description = "Subscribe to our newsletter for the latest news and updates",
  className = "",
}: NewsletterSectionProps) {
  return (
    <section>
      <MaxWidthWrapper>
        <div className={`bg-muted/50 rounded-2xl border py-12 ${className}`}>
          <h3 className="text-center text-sm font-semibold tracking-wider uppercase">
            NEWSLETTER
          </h3>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-4 text-center">
            {description}
          </p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm className="w-full max-w-md" />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  )
}
