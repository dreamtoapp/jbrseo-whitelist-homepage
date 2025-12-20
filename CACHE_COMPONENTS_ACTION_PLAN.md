# Next.js 16 Cache Components Implementation Action Plan

## Overview

This plan outlines the step-by-step implementation of Cache Components in the JBRseo homepage project to improve performance and SEO.

---

## Prerequisites

- ✅ Next.js 16.0.10 (already installed)
- ✅ App Router architecture (already using)
- ✅ Server Components pattern (already following)

---

## ⚠️ Critical Notes (READ BEFORE IMPLEMENTATION)

### 1. `revalidateTag()` Requires 2nd Argument

**IMPORTANT:** In Next.js 16, `revalidateTag()` **REQUIRES** a second argument. Single-argument form is deprecated.

```typescript
// ❌ DEPRECATED - DO NOT USE
revalidateTag('homepage-content');

// ✅ CORRECT - REQUIRED
revalidateTag('homepage-content', 'max');
```

### 2. Replace ISR with `cacheLife()`

**IMPORTANT:** When using Cache Components, `export const revalidate = 300` must be **REMOVED** and replaced with `cacheLife()` inside cached functions.

```typescript
// ❌ REMOVE THIS
export const revalidate = 300;

// ✅ USE THIS INSTEAD
async function getHomePageContent() {
  'use cache';
  cacheLife('hours'); // Replaces ISR
  // ...
}
```

### 3. `cacheLife()` is Required

**IMPORTANT:** All cached functions should include `cacheLife()` to set cache duration.

```typescript
import { cacheTag, cacheLife } from 'next/cache';

async function getData() {
  'use cache';
  cacheLife('hours'); // ✅ Required
  cacheTag('my-tag');
  // ...
}
```

### 4. News Query Logic

**IMPORTANT:** Preserve existing OR logic in news queries to handle null/undefined cases properly.

---

## Phase 1: Enable Cache Components Feature

### Step 1.1: Update `next.config.ts`

**File:** `next.config.ts`

**Action:** Add `cacheComponents: true` to experimental config

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    cacheComponents: true, // ← ADD THIS
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-alert-dialog',
    ],
  },
  // ... rest of config
};
```

**Verification:**

- [ ] Config file updated
- [ ] No TypeScript errors
- [ ] Dev server starts successfully

---

## Phase 2: Implement Caching for Homepage Content

### Step 2.1: Cache Homepage Footer Content

**File:** `app/layout.tsx`

**Current Code:**

```typescript
async function getHomePageContent(): Promise<HomePageFooterContent> {
  const content = await prisma.homePageConfig.findUnique({
    // ... query
  });
  return (
    content ??
    {
      /* defaults */
    }
  );
}
```

**Updated Code:**

```typescript
import { cacheTag, cacheLife } from 'next/cache';

async function getHomePageContent(): Promise<HomePageFooterContent> {
  'use cache';
  cacheLife('hours'); // Set cache duration
  cacheTag('homepage-footer');

  const content = await prisma.homePageConfig.findUnique({
    where: { key: 'default' },
    select: {
      footerCopyright: true,
      footerJoinLinkText: true,
      footerContactEmail: true,
      footerContactText: true,
      facebookUrl: true,
      instagramUrl: true,
      linkedinUrl: true,
      twitterUrl: true,
      whatsappCommunityUrl: true,
      telegramChannelUrl: true,
    },
  });

  return (
    content ?? {
      footerCopyright: '© 2025 — فكرة سعودية تُصنع بهدوء. جميع الحقوق محفوظة.',
      footerJoinLinkText: 'القائمة البيضاء',
      footerContactEmail: 'info@example.com',
      footerContactText: 'تواصل',
      facebookUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
      twitterUrl: null,
      whatsappCommunityUrl: null,
      telegramChannelUrl: null,
    }
  );
}
```

**Checklist:**

- [ ] Add `'use cache'` directive
- [ ] Add `cacheLife('hours')` for cache duration
- [ ] Add `cacheTag('homepage-footer')`
- [ ] Import `cacheTag` and `cacheLife` from `'next/cache'`
- [ ] Test footer renders correctly

---

### Step 2.2: Cache Full Homepage Content

**File:** `app/page.tsx`

**Current Code:**

```typescript
async function getHomePageContent() {
  const content = await prisma.homePageConfig.findUnique({
    // ... full query
  });
  return (
    content ??
    {
      /* defaults */
    }
  );
}
```

**Updated Code:**

```typescript
import { cacheTag, cacheLife } from 'next/cache';

async function getHomePageContent() {
  'use cache';
  cacheLife('hours'); // Set cache duration (replaces export const revalidate)
  cacheTag('homepage-content');

  const content = await prisma.homePageConfig.findUnique({
    where: { key: 'default' },
    select: {
      heroTitlePrimary: true,
      heroTitleSecondary: true,
      heroDescription: true,
      bullets: true,
      heroImageUrl: true,
      heroImageAlt: true,
      joinTitle: true,
      joinDescription: true,
      privacyText: true,
      badgeText: true,
      footerCopyright: true,
      footerJoinLinkText: true,
      footerContactEmail: true,
      footerContactText: true,
      facebookUrl: true,
      instagramUrl: true,
      linkedinUrl: true,
      twitterUrl: true,
      whatsappCommunityUrl: true,
      telegramChannelUrl: true,
    },
  });

  return (
    content ??
    {
      // ... defaults
    }
  );
}
```

**Checklist:**

- [ ] Remove `export const revalidate = 300` (replaced by cacheLife)
- [ ] Add `'use cache'` directive
- [ ] Add `cacheLife('hours')` for cache duration
- [ ] Add `cacheTag('homepage-content')`
- [ ] Import `cacheTag` and `cacheLife` from `'next/cache'`
- [ ] Test homepage renders correctly

---

## Phase 3: Implement Caching for News Pages

### Step 3.1: Cache News Listings

**File:** `app/news/page.tsx`

**Action:** Add caching to news posts query

```typescript
import { cacheTag, cacheLife } from 'next/cache';

async function getNewsPosts() {
  'use cache';
  cacheLife('hours'); // Set cache duration
  cacheTag('news-posts');

  const posts = await prisma.newsPost.findMany({
    where: {
      published: true,
      OR: [
        { newsType: null },
        { newsType: { isSet: false } },
        { newsType: 'GLOBAL' },
      ],
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
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

  return posts;
}
```

**Checklist:**

- [ ] Create `getNewsPosts()` function with `'use cache'`
- [ ] Add `cacheLife('hours')` for cache duration
- [ ] Add `cacheTag('news-posts')`
- [ ] Preserve existing OR logic for newsType query
- [ ] Import `cacheTag` and `cacheLife` from `'next/cache'`
- [ ] Update page component to use cached function
- [ ] Test news page renders correctly

---

### Step 3.2: Cache Individual News Posts

**File:** `app/news/[slug]/page.tsx`

**Action:** Add caching to individual post query

```typescript
import { cacheTag, cacheLife } from 'next/cache';

async function getNewsPost(slug: string) {
  'use cache';
  cacheLife('hours'); // Set cache duration
  cacheTag(`news-post-${slug}`);
  cacheTag('news-posts'); // Also tag general cache

  const post = await prisma.newsPost.findUnique({
    where: { slug },
    select: {
      id: true,
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

  return post;
}
```

**Checklist:**

- [ ] Create `getNewsPost()` function with `'use cache'`
- [ ] Add `cacheLife('hours')` for cache duration
- [ ] Add both specific and general cache tags
- [ ] Import `cacheTag` and `cacheLife` from `'next/cache'`
- [ ] Update page component to use cached function
- [ ] Test individual news post page renders correctly

---

## Phase 4: Create Server Actions for Cache Revalidation

### Step 4.1: Create Homepage Config Update Action

**File:** `app/hompage/actions/homepage-config.ts` (NEW FILE)

**Action:** Create new server action file

```typescript
'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { prisma } from '@/helpers/prisma';
import { z } from 'zod';

// Schema for homepage config updates
const homepageConfigSchema = z.object({
  heroTitlePrimary: z.string().optional(),
  heroTitleSecondary: z.string().optional(),
  heroDescription: z.string().optional(),
  // ... add all fields as optional
});

type HomepageConfigInput = z.infer<typeof homepageConfigSchema>;

export async function updateHomePageConfig(input: HomepageConfigInput) {
  try {
    // Validate input
    const data = homepageConfigSchema.parse(input);

    // Update database
    await prisma.homePageConfig.update({
      where: { key: 'default' },
      data,
    });

    // Revalidate cache tags (REQUIRES 2nd argument in Next.js 16)
    revalidateTag('homepage-content', 'max');
    revalidateTag('homepage-footer', 'max');

    return { success: true } as const;
  } catch (error) {
    console.error('updateHomePageConfig failed', error);
    return { success: false, error: 'server' } as const;
  }
}

// For immediate updates (read-your-writes)
export async function updateHomePageConfigImmediate(input: HomepageConfigInput) {
  try {
    const data = homepageConfigSchema.parse(input);

    await prisma.homePageConfig.update({
      where: { key: 'default' },
      data,
    });

    // Immediate cache refresh
    updateTag('homepage-content');
    updateTag('homepage-footer');

    return { success: true } as const;
  } catch (error) {
    console.error('updateHomePageConfigImmediate failed', error);
    return { success: false, error: 'server' } as const;
  }
}
```

**Checklist:**

- [ ] Create new file `app/hompage/actions/homepage-config.ts`
- [ ] Add Zod schema validation
- [ ] Implement `updateHomePageConfig()` with `revalidateTag()`
- [ ] Implement `updateHomePageConfigImmediate()` with `updateTag()`
- [ ] Add proper error handling

---

### Step 4.2: Create News Update Actions

**File:** `app/news/actions/news.ts` (NEW FILE)

**Action:** Create server actions for news updates

```typescript
'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { prisma } from '@/helpers/prisma';
import { z } from 'zod';

const newsPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  // ... other fields
});

export async function updateNewsPost(slug: string, data: z.infer<typeof newsPostSchema>) {
  try {
    const validated = newsPostSchema.parse(data);

    await prisma.newsPost.update({
      where: { slug },
      data: validated,
    });

    // Revalidate specific post and general list (REQUIRES 2nd argument in Next.js 16)
    revalidateTag(`news-post-${slug}`, 'max');
    revalidateTag('news-posts', 'max');

    return { success: true } as const;
  } catch (error) {
    console.error('updateNewsPost failed', error);
    return { success: false, error: 'server' } as const;
  }
}

export async function publishNewsPost(slug: string) {
  try {
    await prisma.newsPost.update({
      where: { slug },
      data: { published: true, publishedAt: new Date() },
    });

    // Immediate refresh for published posts (read-your-writes)
    updateTag(`news-post-${slug}`);
    updateTag('news-posts');

    return { success: true } as const;
  } catch (error) {
    console.error('publishNewsPost failed', error);
    return { success: false, error: 'server' } as const;
  }
}
```

**Checklist:**

- [ ] Create new file `app/news/actions/news.ts`
- [ ] Implement `updateNewsPost()` with cache revalidation
- [ ] Implement `publishNewsPost()` with immediate cache refresh
- [ ] Add proper error handling

---

## Phase 5: Testing & Verification

### Step 5.1: Test Cache Behavior

**Actions:**

1. Build the application: `pnpm run build`
2. Start production server: `pnpm start`
3. Visit homepage and check Network tab
4. Verify cached content loads faster on subsequent visits
5. Check server logs for cache hits

**Checklist:**

- [ ] Production build succeeds
- [ ] Homepage loads correctly
- [ ] News pages load correctly
- [ ] Cache is working (faster subsequent loads)

---

### Step 5.2: Test Cache Revalidation

**Actions:**

1. Update homepage config via admin (if dashboard exists)
2. Verify cache revalidates correctly
3. Test immediate updates with `updateTag()`
4. Verify stale-while-revalidate with `revalidateTag()`

**Checklist:**

- [ ] Cache revalidation works
- [ ] Immediate updates reflect instantly
- [ ] Background revalidation works

---

### Step 5.3: Performance Testing

**Actions:**

1. Run Lighthouse audit
2. Check TTFB (Time to First Byte)
3. Verify LCP (Largest Contentful Paint) improvements
4. Monitor server load reduction

**Expected Improvements:**

- [ ] Faster TTFB
- [ ] Improved LCP
- [ ] Reduced server CPU usage
- [ ] Better SEO scores

---

## Phase 6: Documentation & Cleanup

### Step 6.1: Update Code Comments

**Action:** Add JSDoc comments to cached functions

```typescript
/**
 * Gets homepage footer content with caching enabled.
 * Uses 'use cache' directive for automatic caching.
 * Cache is tagged with 'homepage-footer' for revalidation.
 *
 * @returns HomePageFooterContent - Footer content from database or defaults
 */
async function getHomePageContent(): Promise<HomePageFooterContent> {
  'use cache';
  cacheTag('homepage-footer');
  // ... implementation
}
```

**Checklist:**

- [ ] Add JSDoc to all cached functions
- [ ] Document cache tags used
- [ ] Document revalidation strategy

---

### Step 6.2: Update README

**File:** `README.md`

**Action:** Add Cache Components section

```markdown
## Caching Strategy

This project uses Next.js 16 Cache Components for optimal performance:

- **Homepage Content**: Cached with `homepage-content` tag
- **Footer Content**: Cached with `homepage-footer` tag
- **News Posts**: Cached with `news-posts` tag
- **Individual Posts**: Cached with `news-post-{slug}` tag

### Cache Revalidation

- Use `revalidateTag(tag, 'max')` for background revalidation (stale-while-revalidate)
  - **REQUIRES 2nd argument** in Next.js 16 (`'max'`, `'hours'`, `'days'`, or `{ expire: seconds }`)
- Use `updateTag(tag)` for immediate updates (read-your-writes) in Server Actions
- Use `cacheLife()` inside cached functions to set cache duration (replaces `export const revalidate`)
- Cache tags are revalidated automatically when content is updated
```

**Checklist:**

- [ ] Add caching section to README
- [ ] Document cache tags
- [ ] Document revalidation patterns

---

## Implementation Order

1. **Phase 1** - Enable feature flag (5 minutes)
2. **Phase 2** - Cache homepage content (15 minutes)
3. **Phase 3** - Cache news pages (20 minutes)
4. **Phase 4** - Create revalidation actions (30 minutes)
5. **Phase 5** - Testing (30 minutes)
6. **Phase 6** - Documentation (15 minutes)

**Total Estimated Time:** ~2 hours

---

## Rollback Plan

If issues occur:

1. **Disable Cache Components:**

   ```typescript
   // next.config.ts
   experimental: {
     // cacheComponents: true, // ← Comment out
   }
   ```

2. **Remove 'use cache' directives:**

   - Search for `'use cache'` in codebase
   - Remove all instances
   - Remove `cacheTag()` calls

3. **Remove cache revalidation:**
   - Remove `revalidateTag()` and `updateTag()` calls
   - Keep database updates intact

---

## Success Criteria

- ✅ Cache Components enabled in config
- ✅ Homepage content cached
- ✅ News pages cached
- ✅ Cache revalidation working
- ✅ Performance improvements measurable
- ✅ No breaking changes to existing functionality

---

## Notes

- Cache Components are **experimental** in Next.js 16
- Monitor for any issues in production
- Consider adding cache monitoring/logging
- Keep cache tags consistent across the codebase
- Document all cache tags used for easier maintenance

---

## Resources

- [Next.js Cache Components Docs](https://nextjs.org/docs/app/getting-started/cache-components)
- [Next.js Caching Guide](https://nextjs.org/docs/app/building-your-application/caching)
- [use cache Directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)

---

**Last Updated:** 2025-01-XX
**Status:** Ready for Implementation
