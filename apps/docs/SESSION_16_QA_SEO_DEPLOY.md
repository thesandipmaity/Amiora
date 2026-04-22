# SESSION 16 — QA, SEO, Performance & Deployment

> **Depends on:** SESSION_15 (all features complete)  
> **Deliverable:** Production-ready deployment of Storefront, CMS, and API  
> **Estimated Time:** 4–5 hours

---

## SEO Checklist (Storefront)

```
- next/metadata for every page:
  - title: "[Product Name] — AMIORA Jewellery"
  - description: product short description
  - openGraph: image, title, description
  - twitter: card, image
- /sitemap.xml (auto-generate from products + collections + blogs + categories)
- /robots.txt
- Structured Data (JSON-LD):
  - Product schema on product pages (name, price, image, review, brand)
  - Organization schema on homepage
  - BreadcrumbList schema
  - LocalBusiness schema on stores page
- Canonical URLs
- Alt text on all images
- Proper heading hierarchy (H1 → H2 → H3)
```

---

## Performance Checklist

```
- next/image for ALL images (auto WebP/AVIF, lazy load, sizes)
- Cloudinary transformations: ?w=800&f=auto&q=auto in URLs
- Bundle size: analyze with next-bundle-analyzer
- Route-level code splitting (automatic with Next.js App Router)
- Suspense boundaries with loading.tsx skeletons
- ISR (Incremental Static Regeneration):
  - Product pages: revalidate = 60 (1 min)
  - Collection pages: revalidate = 300 (5 min)
  - Blog pages: revalidate = 3600 (1 hr)
- LCP target: < 2.0s
- Core Web Vitals check via PageSpeed Insights
```

---

## Accessibility Checklist

```
- All images have alt text
- All form inputs have labels
- Focus ring visible on all interactive elements
- Keyboard navigation through header, mega-menu, forms
- ARIA labels on icon-only buttons
- Semantic HTML throughout
- Color contrast WCAG AA (4.5:1 for body, 3:1 for large)
- Skip to content link
- Screen reader test (basic)
```

---

## Deployment

### Storefront (Vercel)
```bash
cd amiora-store
vercel deploy --prod
# Set env vars in Vercel dashboard
```

### CMS (Vercel — separate project)
```bash
cd amiora-cms
vercel deploy --prod
# Add password protection or Vercel Access Policy
```

### API (Railway or DigitalOcean App Platform)
```bash
cd amiora-api
# Dockerfile or Railway auto-detect Node.js
railway up
# Set all env vars in Railway dashboard
```

---

## Post-Deploy Checklist

- [ ] Storefront loads on custom domain, HTTPS
- [ ] CMS loads on admin subdomain, HTTPS
- [ ] API accessible and health check passes
- [ ] Supabase RLS tested on production
- [ ] Cloudinary uploads work in production
- [ ] Gold/silver price cron job running
- [ ] WebSocket connections stable
- [ ] Google Search Console submitted
- [ ] PageSpeed score > 85 on mobile

---

## Tasks for This Session

- [ ] Add next/metadata to all pages
- [ ] Generate sitemap.xml + robots.txt
- [ ] Add JSON-LD structured data
- [ ] Audit all images for next/image + alt text
- [ ] Run Lighthouse audit + fix critical issues
- [ ] Add loading.tsx skeleton files to all routes
- [ ] Deploy API to Railway + test
- [ ] Deploy CMS to Vercel + test auth
- [ ] Deploy Storefront to Vercel + test end-to-end
- [ ] Smoke test: browse, add to cart, checkout, login, admin login, create product

