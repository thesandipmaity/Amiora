# ⚡ Next.js Fast Rendering — Best Practices Guide

> **Goal:** Har page 300ms se kam mein render ho, user experience smooth rahe.

---

## 1. Rendering Strategy — Sahi Choose Karo

Har page ke liye sahi rendering strategy use karna sabse important hai.

| Page Type | Strategy | Reason |
|---|---|---|
| `/shop`, `/collection` | **ISR** | Content changes occasionally, cache karo |
| `/product/[id]` | **SSG + ISR** | Static banao, revalidate karo |
| `/cart`, `/checkout` | **SSR / CSR** | User-specific data |
| Admin Panel | **CSR** | Auth-protected, no SEO needed |
| Blog/Docs | **SSG** | Fully static, fastest possible |

### ISR Setup (Recommended for Product Pages)
```js
export async function getStaticProps({ params }) {
  const product = await getProduct(params.id);
  return {
    props: { product },
    revalidate: 60, // 60 sec baad background mein update
  };
}

export async function getStaticPaths() {
  const products = await getAllProducts();
  return {
    paths: products.map((p) => ({ params: { id: p.id } })),
    fallback: 'blocking', // naye products ke liye SSR fallback
  };
}
```

---

## 2. Parallel Data Fetching — Waterfall Avoid Karo

```js
// ❌ BAD — Sequential (total = sum of all)
const product  = await getProduct(id);     // 300ms
const reviews  = await getReviews(id);     // 200ms
const related  = await getRelated(id);     // 250ms
// Total: ~750ms

// ✅ GOOD — Parallel (total = slowest one)
const [product, reviews, related] = await Promise.all([
  getProduct(id),
  getReviews(id),
  getRelated(id),
]);
// Total: ~300ms
```

---

## 3. next/image — Sahi Use Karo

```jsx
import Image from 'next/image';

// ✅ Hero / Above-the-fold image
<Image
  src={product.image}
  width={800}
  height={600}
  alt={product.name}
  priority        // LCP improve karta hai
  quality={80}    // Default 75, 80 good balance
/>

// ✅ Below-the-fold images
<Image
  src={img.url}
  width={300}
  height={300}
  alt={img.alt}
  loading="lazy"  // Default, explicitly set karo
/>
```

### next.config.js — Cloudinary Allow Karo
```js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern formats use karo
  },
};
module.exports = nextConfig;
```

---

## 4. Dynamic Imports — Bundle Size Ghataao

```js
import dynamic from 'next/dynamic';

// ✅ Heavy components lazy load karo
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  loading: () => <p>Loading editor...</p>,
  ssr: false, // Client-only components ke liye
});

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  ssr: false,
});
```

**Rule:** Koi bhi component jo:
- 50KB+ ho
- Sirf kuch pages pe use ho
- User interaction ke baad dikhe (modal, drawer)

...usse dynamic import karo.

---

## 5. API & Database Caching

### Next.js 13+ App Router
```js
// 60 sec cache
const res = await fetch('https://api.example.com/products', {
  next: { revalidate: 60 },
});

// No cache (always fresh)
const res = await fetch('https://api.example.com/cart', {
  cache: 'no-store',
});
```

### Supabase Query Caching
```js
// Supabase ke saath React Query use karo
import { useQuery } from '@tanstack/react-query';

const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => supabase.from('products').select('*'),
  staleTime: 1000 * 60 * 5, // 5 min tak fresh
  cacheTime: 1000 * 60 * 10, // 10 min cache mein rahe
});
```

---

## 6. Font Optimization

```js
// ✅ next/font use karo — zero layout shift
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

**Kabhi bhi `<link>` se Google Fonts import mat karo** — Next.js font system self-host karta hai automatically.

---

## 7. Code Splitting & Bundle Optimization

```js
// next.config.js
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};
```

### Named Imports Use Karo
```js
// ❌ BAD — puri library load hoti hai
import _ from 'lodash';

// ✅ GOOD — sirf ek function load hota hai
import debounce from 'lodash/debounce';
```

---

## 8. React Server Components (App Router)

```jsx
// ✅ Server Component — no JS sent to client
// app/products/page.tsx
async function ProductsPage() {
  const products = await getProducts(); // Direct DB call, no API needed
  return <ProductList products={products} />;
}

// ✅ Client Component sirf jahan zarurat ho
'use client';
function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

**Rule:** Default sab Server Component rakho, `'use client'` sirf jahan:
- `useState` / `useEffect` use ho
- Event listeners ho (onClick, onChange)
- Browser APIs use hon

---

## 9. Middleware & Edge Functions

```js
// middleware.ts — Edge pe run hoti hai (0ms cold start)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Auth check, redirects, A/B testing
  // Ye server se pehle run hoti hai — bohot fast
  return NextResponse.next();
}
```

---

## 10. Performance Monitoring — Measure Karo

### Lighthouse (Development)
```bash
# Chrome DevTools > Lighthouse > Analyze page load
# Target scores:
# Performance: 90+
# LCP: < 2.5s
# FID: < 100ms
# CLS: < 0.1
```

### Next.js Built-in Analytics
```js
// pages/_app.js
export function reportWebVitals(metric) {
  console.log(metric); // CLS, FID, FCP, LCP, TTFB
}
```

---

## Quick Checklist ✅

- [ ] ISR/SSG use kiya product aur collection pages pe
- [ ] `Promise.all()` se parallel data fetch kiya
- [ ] `next/image` sahi use kiya `priority` ke saath
- [ ] Cloudinary domain `next.config.js` mein add kiya
- [ ] Heavy components dynamic import kiye
- [ ] Supabase queries ke liye React Query/caching lagaya
- [ ] `next/font` use kiya Google Fonts ki jagah
- [ ] Named imports use kiye (lodash, icons)
- [ ] Server Components default rakhe, `'use client'` minimize kiya
- [ ] Lighthouse score 90+ kiya

---

## Target Metrics

| Metric | Current (Estimated) | Target |
|---|---|---|
| TTFB | ~1500ms | < 200ms |
| LCP | ~2500ms | < 1500ms |
| Total Page Load | ~2000ms+ | < 500ms |
| JS Bundle Size | Large | < 200KB per page |

---

*Generated for Next.js 13+ (App Router) + Supabase + Cloudinary stack*
