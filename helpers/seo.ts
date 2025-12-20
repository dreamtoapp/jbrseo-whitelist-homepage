export function generateSlug(title: string): string {
  if (!title || title.trim().length === 0) {
    return "";
  }

  let slug = title.trim();

  slug = slug
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length > 100) {
    slug = slug.substring(0, 100);
    slug = slug.replace(/-+$/, "");
  }

  return slug || "post";
}

export async function ensureUniqueSlug(
  slug: string,
  prisma: { newsPost: { findUnique: (args: { where: { slug: string } }) => Promise<{ id: string } | null> } },
  excludeId?: string
): Promise<string> {
  let uniqueSlug = slug;
  let counter = 2;

  while (true) {
    const existing = await prisma.newsPost.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return uniqueSlug;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

export function generateMetaDescription(content: string, maxLength: number = 160): string {
  if (!content) return "";

  const text = content
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}

export function generateArticleSchema(
  post: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    author?: string | null;
    tags?: string[];
    publishedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  siteUrl: string
): Record<string, unknown> {
  const url = `${siteUrl}/news/${encodeURIComponent(post.slug)}`;
  const image = `${siteUrl}/assets/logo.png`;
  const wordCount = post.content ? post.content.trim().split(/\s+/).length : 0;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || generateMetaDescription(post.content),
    image: image,
    articleBody: post.content,
    wordCount,
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author
      ? {
        "@type": "Person",
        name: post.author,
      }
      : {
        "@type": "Organization",
        name: "JBRseo",
      },
    publisher: {
      "@type": "Organization",
      name: "JBRseo",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags && post.tags.length > 0 ? post.tags.join(", ") : undefined,
  };
}

export function generateBreadcrumbsSchema(
  items: Array<{ name: string; url: string }>,
  siteUrl: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}



















