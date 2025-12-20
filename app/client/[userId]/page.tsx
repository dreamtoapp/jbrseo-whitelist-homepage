import Link from "@/components/link";
import Image from "next/image";
import Script from "next/script";

import { prisma } from "@/helpers/prisma";
import { generateBreadcrumbsSchema } from "@/helpers/seo";

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function ClientNewsPage({ params }: Props) {
  const { userId } = await params;

  const posts = await prisma.newsPost.findMany({
    where: { published: true, newsType: "APP" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 20,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      author: true,
      tags: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com").replace(/\/$/, "");
  const breadcrumbsSchema = generateBreadcrumbsSchema(
    [
      { name: "الرئيسية", url: "/" },
      { name: "الأخبار", url: `/client/${userId}` },
    ],
    siteUrl
  );

  const newsArticleListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "NewsArticle",
        headline: post.title,
        description: post.excerpt || post.title,
        image: `${siteUrl}/assets/logo.png`,
        datePublished: (post.publishedAt || post.createdAt).toISOString(),
        url: `${siteUrl}/client/${userId}/news/${encodeURIComponent(post.slug)}`,
      },
    })),
  };

  return (
    <>
      <Script
        id="breadcrumbs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <Script
        id="news-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleListSchema) }}
      />

      <div dir="rtl" className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-10 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-bold">تحديثات التطبيق</h1>
            <p className="text-sm text-foreground/70">آخر تحديثات التطبيق والميزات الجديدة.</p>
          </header>

          {posts.length === 0 ? (
            <p className="text-sm text-foreground/70">لا توجد تحديثات منشورة حتى الآن.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {posts.map((post) => {
                const postUrl = `/client/${userId}/news/${encodeURIComponent(post.slug)}`;
                const date = post.publishedAt || post.createdAt;
                return (
                  <article
                    key={post.id}
                    className="mb-4 break-inside-avoid rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-foreground/[0.04] transition-all duration-200"
                  >
                    <Link href={postUrl} className="block space-y-2">
                      <header className="space-y-1">
                        <h2 className="text-base md:text-lg font-semibold tracking-tight text-foreground">
                          {post.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground/60">
                          {post.author && <span>{post.author}</span>}
                          <span className="h-1 w-1 rounded-full bg-foreground/30" />
                          <time dateTime={date.toISOString()}>
                            {date.toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                      </header>

                      {post.excerpt && (
                        <p className="mt-2 text-xs md:text-sm leading-relaxed text-foreground/80 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

