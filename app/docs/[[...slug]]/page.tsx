import { notFound } from "next/navigation";
import { allDocs } from "content-collections";

import TableOfContents from "@/components/content/table-of-contents";
import { Mdx } from "@/components/content/mdx-components";

import { Metadata } from "next";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";
import { DocsPageHeader } from "@/components/docs/page-header";
import { DocsPager } from "@/components/docs/pager";
import { siteConfig } from "@/config/site";

// interface DocPageProps {
//   params: {
//     slug: string[];
//   };
// }
interface DocPageProps {
  params: Promise<{ slug: string[] }>;
}

async function getDocFromParams(params: Promise<{ slug: string[] }>) {
  const slug = (await params).slug?.join("/") || "";
  const doc = allDocs.find((doc: any) => doc._meta.path === slug || !slug && doc._meta.path === "index");

  if (!doc) return null;

  return doc;
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(params);

  if (!doc) return {};

  const { title, description } = doc;

  return constructMetadata({
    title: `${title} – ${siteConfig.name}`,
    description: description,
  });
}

export async function generateStaticParams() {
  return allDocs.map((doc: any) => ({
    slug: doc._meta.path.split("/").slice(1),
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams(params);

  if (!doc) {
    notFound();
  }

  const images = await Promise.all(
    doc.image ? [{
      src: doc.image,
      blurDataURL: await getBlurDataURL(doc.image),
      alt: doc.title || 'Document image'
    }] : []
  );

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        <article
          className="pb-4 pt-11 prose prose-lg max-w-none dark:prose-invert"
        >
          <Mdx content={doc.mdx} images={images} />
        </article>
        <hr className="my-4 md:my-6" />
        <DocsPager doc={doc} />
      </div>
      <aside className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-8">
          <TableOfContents toc={doc.toc} />
        </div>
      </aside>
    </main>
  );
}