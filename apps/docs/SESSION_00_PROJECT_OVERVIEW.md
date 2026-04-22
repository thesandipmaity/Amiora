# AMIORA — Project Master Overview

> **Brand:** AMIORA | **Niche:** Jewellery & Ornaments | **Location:** India  
> **Stack:** Next.js 14 (App Router) · Supabase · Cloudinary · Node.js/Express API · WebSocket  
> **Color Palette:** `#285260` · `#548C92` · `#B4D7D8` · `#E0D7CF` · `#AB9072`

---

## Architecture at a Glance

```
┌─────────────────────┐        ┌──────────────────────────┐
│   AMIORA Storefront │        │   AMIORA CMS / Admin     │
│   (Next.js 14)      │        │   (Next.js 14 — separate)│
│   Port: 3000        │◄──────►│   Port: 3001             │
└────────┬────────────┘  WS    └──────────┬───────────────┘
         │                               │
         └────────────┬──────────────────┘
                      │
         ┌────────────▼───────────┐
         │    Shared Backend      │
         │  Node.js/Express API   │
         │  Port: 5000            │
         └────────────┬───────────┘
                      │
         ┌────────────▼───────────┐
         │    Supabase            │
         │  (PostgreSQL + Auth    │
         │   + Storage meta)      │
         └────────────────────────┘
                      │
         ┌────────────▼───────────┐
         │    Cloudinary          │
         │  (All product images)  │
         └────────────────────────┘
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://ifbyzgelotoneozqhomy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dqayol6fn
CLOUDINARY_CLOUD_NAME=dqayol6fn
CLOUDINARY_API_KEY=465881383896453
CLOUDINARY_API_SECRET=i1kohYlAlodMEwWGCelItA4UPdI
```

---

## Brand Design Tokens

```css
/* AMIORA Brand Palette */
--color-deep-teal:     #285260;   /* Primary dark — headings, nav bg */
--color-teal:          #548C92;   /* Primary — buttons, links, accents */
--color-light-teal:    #B4D7D8;   /* Highlight — hover states, backgrounds */
--color-cream:         #E0D7CF;   /* Surface — card backgrounds, sections */
--color-sand:          #AB9072;   /* Warm accent — borders, tags, gold-feel */

/* Typography */
--font-display: 'Cormorant Garamond', Georgia, serif;   /* Headings, product names */
--font-body:    'Jost', 'Helvetica Neue', sans-serif;   /* Body, UI, buttons */
```

---

## Reference Website
- **Ethera Diamonds:** https://etheradiamonds.com  
  → Copy: layout style, font hierarchy, product card style, navigation mega-menu structure  
  → Override: colors (use AMIORA palette above), fonts (use Cormorant + Jost)

---

## Two Separate Deployments

| App | Repo/Folder | Host |
|-----|------------|------|
| Storefront | `amiora-store/` | Vercel (or custom) |
| CMS/Admin | `amiora-cms/` | Separate Vercel / VPS |
| API | `amiora-api/` | Railway / DigitalOcean App Platform |

Both frontends consume the **same Supabase DB** and the **same API**.

---

## Modules Summary

### Storefront Modules
1. Homepage (hero, featured collections, trending, testimonials, blog preview)
2. Shop (filters, sorting, product grid)
3. Collections (mega-menu, collection pages, product cards)
4. Single Product Page (image gallery, details, smart pairing, reviews)
5. Cart + Checkout (online payment / book & pay in-store)
6. User Profile (orders, wishlist, addresses, customization requests)
7. Customization Request Flow
8. Call-back Request / Demo Request / Sales Rep Visit Request
9. Store Locator
10. About Us, Contact, Policies, T&C, Blogs

### CMS/Admin Modules
1. Sales Dashboard (revenue, orders, best-sellers)
2. Product & Inventory Management
3. Collection Management
4. Order Management
5. Customer Management
6. Customization Request Inbox
7. Blog / Content Management
8. Testimonials Manager
9. Store Locator Manager
10. Settings (pricing rates, making charges, gold/silver live price config)

---

## Session Roadmap

| Session | Focus |
|---------|-------|
| S01 | DB Schema Design (Supabase tables, RLS, relations) |
| S02 | API Setup (Express, routes scaffold, gold/silver price cron) |
| S03 | Storefront — Scaffold, Design System, Layout, Navigation |
| S04 | Storefront — Homepage |
| S05 | Storefront — Collections, Shop, Filters |
| S06 | Storefront — Single Product Page |
| S07 | Storefront — Cart & Checkout |
| S08 | Storefront — User Profile, Wishlist, Orders |
| S09 | Storefront — Customization, Requests, Store Locator |
| S10 | Storefront — Static Pages (About, Contact, Policies, Blog) |
| S11 | CMS — Scaffold, Design System, Auth |
| S12 | CMS — Dashboard, Products, Inventory |
| S13 | CMS — Orders, Customers, Requests |
| S14 | CMS — Collections, Blog, Testimonials |
| S15 | WebSocket Real-Time Sync (store ↔ CMS) |
| S16 | QA, SEO, Performance, Deploy |

