import { BlogHeaderLayout } from "@/components/content/blog-header-layout"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BlogHeaderLayout />  
      <div className="pb-16">{children}</div>
    </>
  )
}
