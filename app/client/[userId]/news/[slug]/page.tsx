import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "@/components/link";
import Image from "next/image";

import { prisma } from "@/helpers/prisma";
import { generateArticleSchema, generateBreadcrumbsSchema, generateMetaDescription } from "@/helpers/seo";

type Props = {
  params: Promise<{
    userId: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { userId, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const post = await prisma.newsPost.findUnique({
    where: { slug: decodedSlug },
    select: {
      title: true,
      content: true,
      excerpt: true,
      author: true,
      tags: true,
      metaDescription: true,
      metaKeywords: true,
      published: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      newsType: true,
    },
  });

  if (!post || !post.published || post.newsType !== "APP") {
    return {
      title: "منشور غير موجود",
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com").replace(/\/$/, "");
  const url = `${siteUrl}/client/${userId}/news/${slug}`;
  const description = post.metaDescription || post.excerpt || generateMetaDescription(post.content);
  const image = `${siteUrl}/assets/logo.png`;

  return {
    title: `${post.title} | JBRseo`,
    description,
    keywords: post.metaKeywords && post.metaKeywords.length > 0 ? post.metaKeywords : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      locale: "ar_SA",
      url,
      title: post.title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: "JBRseo",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default async function NewsPostPage({ params }: Props) {
  const { userId, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const post = await prisma.newsPost.findUnique({
    where: { slug: decodedSlug },
  });

  if (!post || !post.published || post.newsType !== "APP") {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com").replace(/\/$/, "");
  const articleSchema = generateArticleSchema(post, siteUrl);
  const breadcrumbsSchema = generateBreadcrumbsSchema(
    [
      { name: "الرئيسية", url: "/" },
      { name: "الأخبار", url: `/client/${userId}` },
      { name: post.title, url: `/client/${userId}/news/${slug}` },
    ],
    siteUrl
  );

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumbs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />

      <div dir="rtl" className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-10">
          <nav className="mb-6 text-sm text-foreground/70">
            <Link href="/" className="hover:text-foreground">
              الرئيسية
            </Link>
            {" / "}
            <Link href={`/client/${userId}`} className="hover:text-foreground">
              الأخبار
            </Link>
            {" / "}
            <span className="text-foreground">{post.title}</span>
          </nav>

          <article className="max-w-4xl mx-auto">
            <header className="mb-8 space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                {post.author && (
                  <div>
                    <span className="font-semibold">الكاتب:</span> {post.author}
                  </div>
                )}
                <time dateTime={(post.publishedAt || post.createdAt).toISOString()}>
                  {(post.publishedAt || post.createdAt).toLocaleString("ar-SA", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </time>
                {post.updatedAt.getTime() !== (post.publishedAt || post.createdAt).getTime() && (
                  <div>
                    <span className="font-semibold">آخر تحديث:</span>{" "}
                    {post.updatedAt.toLocaleString("ar-SA", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-foreground/10 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {post.excerpt && (
              <div className="mb-8 p-6 rounded-2xl bg-foreground/5 border border-foreground/10">
                <p className="text-lg text-foreground/90 leading-relaxed">{post.excerpt}</p>
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {post.content}
              </div>
            </div>

            <footer className="mt-12 pt-8 border-t border-foreground/10">
              <Link
                href={`/client/${userId}`}
                className="inline-flex items-center text-foreground/70 hover:text-foreground"
              >
                ← العودة إلى الأخبار
              </Link>
            </footer>
          </article>
        </main>
      </div>
    </>
  );
}



















