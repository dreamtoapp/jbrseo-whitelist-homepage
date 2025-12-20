import Link from "@/components/link";
import Script from "next/script";

import { prisma } from "@/helpers/prisma";
import { generateBreadcrumbsSchema } from "@/helpers/seo";

export default async function NewsPage() {
  const posts = await prisma.newsPost.findMany({
    where: {
      published: true,
      OR: [
        { newsType: null },
        { newsType: { isSet: false } },
        { newsType: "GLOBAL" },
      ],
    },
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
      { name: "الأخبار", url: "/news" },
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
        url: `${siteUrl}/news/${encodeURIComponent(post.slug)}`,
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
          <header className="space-y-3">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">آخر الأخبار</h1>
              <p className="text-base md:text-lg text-foreground/75 leading-relaxed">
                اطلع على آخر الأخبار والتحديثات المهمة
              </p>
            </div>
          </header>

          {posts.length === 0 ? (
            <p className="text-sm text-foreground/70">لا توجد تحديثات منشورة حتى الآن.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {posts.map((post) => {
                const postUrl = `/news/${encodeURIComponent(post.slug)}`;
                const date = post.publishedAt || post.createdAt;
                return (
                  <article
                    key={post.id}
                    className="group mb-4 break-inside-avoid rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-foreground/20 hover:bg-foreground/[0.05] transition-all duration-300 ease-out cursor-pointer"
                  >
                    <Link href={postUrl} className="block space-y-3">
                      <header className="space-y-2">
                        <h2 className="text-base md:text-lg font-semibold tracking-tight text-foreground group-hover:text-foreground/90 transition-colors duration-200 leading-snug">
                          {post.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                          {post.author && (
                            <span className="font-medium text-foreground/70">{post.author}</span>
                          )}
                          {post.author && (
                            <span className="h-1 w-1 rounded-full bg-foreground/30" />
                          )}
                          <time
                            dateTime={date.toISOString()}
                            className="whitespace-nowrap"
                          >
                            {date.toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                      </header>

                      {post.excerpt && (
                        <p className="text-sm leading-relaxed text-foreground/75 line-clamp-3 group-hover:text-foreground/85 transition-colors duration-200">
                          {post.excerpt}
                        </p>
                      )}

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full border border-foreground/15 bg-foreground/[0.03] px-3 py-1 text-xs font-medium text-foreground/70 group-hover:border-foreground/25 group-hover:bg-foreground/[0.06] group-hover:text-foreground/80 transition-all duration-200"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="inline-flex items-center rounded-full border border-foreground/15 bg-foreground/[0.03] px-3 py-1 text-xs font-medium text-foreground/60">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="pt-2 mt-2 border-t border-foreground/10">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors duration-200">
                          اقرأ المزيد
                          <span className="text-xs" aria-hidden="true">←</span>
                        </span>
                      </div>
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










