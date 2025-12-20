# Performance Optimization Guide

## Overview

This guide documents all performance optimizations implemented in the JBRseo homepage project and provides best practices to maintain optimal performance. Follow this guide to avoid common performance mistakes.

---

## Table of Contents

1. [Next.js Configuration](#nextjs-configuration)
2. [Image Optimization](#image-optimization)
3. [Font Optimization](#font-optimization)
4. [Resource Hints](#resource-hints)
5. [Cache Components](#cache-components)
6. [Code Splitting](#code-splitting)
7. [Bundle Optimization](#bundle-optimization)
8. [Performance Checklist](#performance-checklist)
9. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
10. [Testing & Verification](#testing--verification)

---

## Next.js Configuration

### File: `next.config.ts`

**Required Optimizations:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  cacheComponents: true, // ✅ Required for Next.js 16 Cache Components
  poweredByHeader: false, // ✅ Security: Remove X-Powered-By header
  compress: true, // ✅ Enable gzip compression (explicit)
  experimental: {
    optimizePackageImports: [
      "lucide-react", // ✅ Tree-shake lucide-react icons
      "@radix-ui/react-dialog",
      "@radix-ui/react-alert-dialog",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"], // ✅ Modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // ✅ Responsive sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // ✅ Icon/thumbnail sizes
    minimumCacheTTL: 60, // ✅ Cache images for 60 seconds
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
```

**Key Points:**
- ✅ Always set `cacheComponents: true` for Next.js 16
- ✅ Always set `poweredByHeader: false` for security
- ✅ Always configure `formats` for modern image formats (AVIF, WebP)
- ✅ Always set `deviceSizes` and `imageSizes` for responsive images
- ✅ Always add external domains to `remotePatterns`

**Common Mistakes:**
- ❌ Forgetting to add `cacheComponents: true`
- ❌ Not configuring image formats (defaults to JPEG/PNG)
- ❌ Missing `remotePatterns` for external images
- ❌ Not setting `poweredByHeader: false`

---

## Image Optimization

### Best Practices

**1. Always use `next/image` component:**

```typescript
import Image from "next/image";

// ✅ CORRECT
<Image
  src="/assets/logo.png"
  alt="Logo"
  width={40}
  height={60}
  className="h-[60px] w-[40px]"
  style={{ aspectRatio: "40/60" }} // ✅ Explicit aspect ratio
  priority // ✅ Only for LCP images
  quality={80} // ✅ 75-85 is optimal (not 90+)
/>
```

**2. Image Quality Settings:**

- **Hero images (LCP):** `quality={80}` (not 85-90)
- **Below-fold images:** `quality={75}` or default
- **Icons/thumbnails:** `quality={70}` or default

**3. Responsive Sizes Attribute:**

```typescript
// ✅ CORRECT - Account for container padding
sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 3rem), (max-width: 1024px) 896px, 896px"

// ❌ WRONG - Doesn't account for padding
sizes="(max-width: 640px) 100vw, 1280px"
```

**4. Aspect Ratio:**

```typescript
// ✅ CORRECT - Always set explicit aspect ratio
<Image
  width={40}
  height={60}
  style={{ aspectRatio: "40/60" }}
  className="object-contain"
/>

// ❌ WRONG - Missing aspect ratio causes layout shift
<Image
  width={40}
  height={60}
  className="h-10 w-10" // Square when image is 40x60
/>
```

**5. Priority Loading:**

```typescript
// ✅ CORRECT - Only on LCP images
<Image src={heroImage} priority fetchPriority="high" />

// ❌ WRONG - Don't use priority on all images
<Image src={footerLogo} priority /> // Footer is below fold
```

**Files to Check:**
- `app/hompage/components/HeroSection.tsx` - Hero image (priority, quality 80)
- `components/HomeHeader.tsx` - Logo (priority, explicit aspect ratio)
- `components/HomePageFooter.tsx` - Footer logo (no priority, lazy load)

**Common Mistakes:**
- ❌ Using `<img>` instead of `<Image>`
- ❌ Quality set too high (90+) - wastes bandwidth
- ❌ Missing `sizes` attribute - causes wrong image sizes
- ❌ Missing aspect ratio - causes layout shifts
- ❌ Using `priority` on all images - blocks rendering
- ❌ Not using `object-contain` for logos

---

## Font Optimization

### File: `app/layout.tsx`

**Required Configuration:**

```typescript
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "optional", // ✅ Prevents FOIT (Flash of Invisible Text)
  preload: true, // ✅ Preload critical font
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Arial", "sans-serif"],
  variable: "--font-tajawal",
});
```

**Resource Hints (in `<head>`):**

```typescript
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
</head>
```

**Key Points:**
- ✅ Always use `display: "optional"` to prevent FOIT
- ✅ Always set `preload: true` for critical fonts
- ✅ Always add `preconnect` for Google Fonts
- ✅ Always provide fallback fonts

**Common Mistakes:**
- ❌ Using `display: "block"` - causes FOIT
- ❌ Missing `preconnect` - slows font loading
- ❌ Not providing fallback fonts
- ❌ Loading too many font weights

---

## Resource Hints

### File: `app/layout.tsx`

**Required Resource Hints:**

```typescript
<head>
  {/* Fonts */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  
  {/* Images */}
  <link rel="dns-prefetch" href="https://res.cloudinary.com" />
  
  {/* Third-party scripts */}
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
</head>
```

**When to Use:**
- **`preconnect`**: For critical resources (fonts, API endpoints)
- **`dns-prefetch`**: For non-critical resources (analytics, images)

**Common Mistakes:**
- ❌ Missing `preconnect` for fonts
- ❌ Missing `dns-prefetch` for external images
- ❌ Using `preconnect` for too many domains (limit to 3-4)

---

## Cache Components

### Next.js 16 Cache Components Pattern

**Required Structure:**

```typescript
import { cacheTag, cacheLife } from "next/cache";

async function getData() {
  "use cache"; // ✅ Required directive
  cacheLife("hours"); // ✅ Required - sets cache duration
  cacheTag("data-tag"); // ✅ Required - for revalidation
  
  // Database query or API call
  const data = await prisma.model.findMany();
  return data;
}
```

**Files Using Cache Components:**
1. `app/page.tsx` - `getHomePageContent()` - Tag: `homepage-content`
2. `app/layout.tsx` - `getHomePageContent()` - Tag: `homepage-footer`
3. `app/news/page.tsx` - `getNewsPosts()` - Tag: `news-posts`
4. `app/news/[slug]/page.tsx` - `getNewsPost()` - Tags: `news-post-{slug}`, `news-posts`
5. `app/hompage/actions/app-updates.ts` - `getAppUpdatesCount()` - Tag: `app-updates-count`

**Revalidation Pattern:**

```typescript
import { revalidateTag } from "next/cache";

// ✅ CORRECT - Requires 2nd argument in Next.js 16
revalidateTag("homepage-content", "max");
revalidateTag("news-posts", "max");

// ❌ WRONG - Single argument is deprecated
revalidateTag("homepage-content");
```

**Common Mistakes:**
- ❌ Missing `"use cache"` directive
- ❌ Missing `cacheLife()` - cache won't work properly
- ❌ Missing `cacheTag()` - can't revalidate
- ❌ Using `export const revalidate = 300` with Cache Components (conflict)
- ❌ `revalidateTag()` without 2nd argument (deprecated)

---

## Code Splitting

### Dynamic Imports Pattern

**Heavy Client Components:**

```typescript
import dynamic from "next/dynamic";

// ✅ CORRECT - Lazy load with SSR disabled and loading fallback
const HeavyComponent = dynamic(
  () => import("./HeavyComponent").then((mod) => ({ default: mod.HeavyComponent })),
  {
    ssr: false, // ✅ Disable SSR for client-only components
    loading: () => <Skeleton />, // ✅ Provide loading fallback
  }
);
```

**Files Using Dynamic Imports:**
- `app/layout.tsx` - `NotificationHandler`
- `components/HomeHeaderActions.tsx` - `ThemeToggle`, `CountdownTimerDrawer`
- `app/hompage/components/` - `WhitelistFormDialog`, `FloatingMobileCTA`

**When to Use Dynamic Imports:**
- ✅ Heavy components not needed immediately
- ✅ Client-only components (charts, animations)
- ✅ Components below the fold
- ✅ Modal/dialog components

**Common Mistakes:**
- ❌ Not using dynamic imports for heavy components
- ❌ Missing `ssr: false` for client-only components
- ❌ Not providing loading fallback
- ❌ Dynamic importing components above the fold

---

## Bundle Optimization

### Package Import Optimization

**Configuration (`next.config.ts`):**

```typescript
experimental: {
  optimizePackageImports: [
    "lucide-react", // ✅ Tree-shakes unused icons
    "@radix-ui/react-dialog",
    "@radix-ui/react-alert-dialog",
  ],
}
```

**Import Patterns:**

```typescript
// ✅ CORRECT - Named imports (tree-shakeable)
import { Zap, ArrowLeft } from "lucide-react";

// ❌ WRONG - Default import (imports entire library)
import LucideReact from "lucide-react";
```

**Common Mistakes:**
- ❌ Not adding heavy packages to `optimizePackageImports`
- ❌ Using default imports instead of named imports
- ❌ Importing entire libraries when only need one function

---

## Performance Checklist

### Before Every Deployment

- [ ] **Build succeeds** - `pnpm run build` with zero errors
- [ ] **TypeScript passes** - No type errors
- [ ] **Lint passes** - No linting errors
- [ ] **Images optimized** - All use `next/image` with proper `sizes`
- [ ] **Fonts optimized** - Preconnect added, `display: "optional"`
- [ ] **Cache Components** - All cached functions have `'use cache'`, `cacheLife()`, `cacheTag()`
- [ ] **Resource hints** - Preconnect/dns-prefetch for external domains
- [ ] **Code splitting** - Heavy components use dynamic imports
- [ ] **Bundle size** - Check for large dependencies
- [ ] **Lighthouse audit** - Performance score > 90

### When Adding New Features

- [ ] **Images:** Use `next/image` with proper `width`, `height`, `sizes`, `quality`
- [ ] **Fonts:** Add preconnect if using new font service
- [ ] **Data fetching:** Use Cache Components pattern if caching needed
- [ ] **Heavy components:** Use dynamic imports with `ssr: false` if client-only
- [ ] **External resources:** Add dns-prefetch/preconnect
- [ ] **Bundle impact:** Check if new dependency increases bundle size

---

## Common Mistakes to Avoid

### 1. Image Mistakes

❌ **Wrong:**
```typescript
<img src="/logo.png" alt="Logo" />
```

✅ **Correct:**
```typescript
<Image src="/logo.png" alt="Logo" width={40} height={60} style={{ aspectRatio: "40/60" }} />
```

### 2. Cache Components Mistakes

❌ **Wrong:**
```typescript
async function getData() {
  cacheTag("data"); // Missing 'use cache' and cacheLife
  return await fetchData();
}
```

✅ **Correct:**
```typescript
async function getData() {
  "use cache";
  cacheLife("hours");
  cacheTag("data");
  return await fetchData();
}
```

### 3. Revalidation Mistakes

❌ **Wrong:**
```typescript
revalidateTag("data"); // Missing 2nd argument
```

✅ **Correct:**
```typescript
revalidateTag("data", "max");
```

### 4. Font Mistakes

❌ **Wrong:**
```typescript
const font = Tajawal({
  display: "block", // Causes FOIT
  // Missing preconnect
});
```

✅ **Correct:**
```typescript
const font = Tajawal({
  display: "optional", // Prevents FOIT
  preload: true,
});
// + preconnect in <head>
```

### 5. Dynamic Import Mistakes

❌ **Wrong:**
```typescript
import HeavyComponent from "./HeavyComponent"; // Blocks initial render
```

✅ **Correct:**
```typescript
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  ssr: false,
  loading: () => <Skeleton />,
});
```

---

## Testing & Verification

### 1. Build Verification

```bash
pnpm run build
```

**Expected:**
- ✅ Zero TypeScript errors
- ✅ Zero lint errors
- ✅ All routes generated successfully
- ✅ Cache Components working (◐ Partial Prerender)

### 2. Lighthouse Audit

**Steps:**
1. Start production server: `pnpm start`
2. Open `http://localhost:3000`
3. Chrome DevTools > Lighthouse > Run audit

**Target Scores:**
- Performance: > 90
- LCP: < 2.5s (target < 2.0s)
- FID/INP: < 200ms (target < 100ms)
- CLS: < 0.1

### 3. Network Analysis

**Check:**
- Images served in AVIF/WebP format
- Fonts load quickly (preconnect working)
- DNS prefetch visible in Network tab
- No render-blocking resources

### 4. Bundle Analysis

**Check:**
- No duplicate dependencies
- Tree-shaking working (named imports)
- Code splitting effective
- Bundle sizes reasonable

---

## Performance Monitoring

### Key Metrics to Track

1. **Lighthouse Performance Score** - Should be > 90
2. **LCP (Largest Contentful Paint)** - Should be < 2.5s
3. **FID/INP (Interaction to Next Paint)** - Should be < 200ms
4. **CLS (Cumulative Layout Shift)** - Should be < 0.1
5. **Bundle Size** - Monitor for increases
6. **Image Sizes** - Should use AVIF/WebP

### Tools

- **Lighthouse** - Performance auditing
- **Chrome DevTools** - Network analysis, bundle inspection
- **Next.js Build Output** - Route analysis, bundle sizes
- **WebPageTest** - Real-world performance testing

---

## Quick Reference

### Image Optimization Checklist

- [ ] Using `next/image` component
- [ ] Proper `width` and `height` attributes
- [ ] Explicit `aspectRatio` style
- [ ] Accurate `sizes` attribute
- [ ] `quality={80}` for hero images
- [ ] `priority` only on LCP images
- [ ] `object-contain` for logos

### Cache Components Checklist

- [ ] `"use cache"` directive present
- [ ] `cacheLife("hours")` set
- [ ] `cacheTag()` with unique tag
- [ ] No `export const revalidate` conflicts
- [ ] `revalidateTag()` with 2nd argument

### Font Optimization Checklist

- [ ] `display: "optional"` set
- [ ] `preload: true` for critical fonts
- [ ] Preconnect in `<head>`
- [ ] Fallback fonts provided

### Resource Hints Checklist

- [ ] Preconnect for fonts
- [ ] DNS-prefetch for images
- [ ] DNS-prefetch for analytics
- [ ] Limited to 3-4 domains

---

## Maintenance

### Regular Tasks

1. **Monthly:** Run Lighthouse audit, check for regressions
2. **Quarterly:** Review bundle sizes, check for new optimization opportunities
3. **When adding features:** Follow checklist, verify performance impact
4. **Before deployment:** Run full performance checklist

### When Performance Degrades

1. Check Lighthouse audit for specific issues
2. Review bundle sizes for increases
3. Check Network tab for slow resources
4. Verify Cache Components are working
5. Check for new dependencies increasing bundle size

---

## Resources

- [Next.js 16 Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)
- [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)

---

## Summary

**Key Principles:**
1. Always use `next/image` for images
2. Always use Cache Components for data fetching
3. Always add resource hints for external domains
4. Always use dynamic imports for heavy components
5. Always optimize font loading
6. Always verify with Lighthouse before deployment

**Remember:** Performance is not optional. Every feature addition should consider performance impact.

---

*Last Updated: 2025-01-XX*
*Next.js Version: 16.0.10*
*React Version: 19.2.3*

