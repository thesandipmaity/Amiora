# SESSION 03 — Storefront Scaffold, Design System & Navigation

> **Depends on:** SESSION_01 (DB), SESSION_02 (API running)  
> **Deliverable:** Next.js 14 storefront running with design system, layout shell, and mega-menu navigation  
> **Estimated Time:** 4–5 hours

---

## Project Init

```bash
npx create-next-app@latest amiora-store \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"
cd amiora-store
npm install @supabase/supabase-js @supabase/ssr axios swr lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install framer-motion
npm install next-themes
```

---

## Folder Structure

```
amiora-store/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, providers, header, footer)
│   │   ├── page.tsx               # Homepage
│   │   ├── shop/page.tsx
│   │   ├── collections/
│   │   │   ├── page.tsx           # All collections
│   │   │   └── [slug]/page.tsx    # Single collection
│   │   ├── categories/[slug]/page.tsx
│   │   ├── products/[slug]/page.tsx   # Single product page
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx           # Profile
│   │   │   ├── orders/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   └── requests/page.tsx
│   │   ├── customization/page.tsx
│   │   ├── stores/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blogs/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── shipping-policy/page.tsx
│   │   ├── return-policy/page.tsx
│   │   └── terms/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # Sticky header + mega-menu
│   │   │   ├── MegaMenu.tsx       # Collections dropdown
│   │   │   ├── MobileMenu.tsx     # Slide-out mobile nav
│   │   │   └── Footer.tsx
│   │   ├── ui/                    # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── sections/              # Homepage sections
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── FeaturedCollections.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── BlogPreview.tsx
│   │   └── forms/
│   │       ├── CallbackForm.tsx
│   │       ├── DemoRequestForm.tsx
│   │       └── CustomizationForm.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser client
│   │   │   └── server.ts          # Server client (RSC)
│   │   ├── api.ts                 # API call helpers (axios)
│   │   ├── pricing.ts             # Price calculation helper
│   │   └── constants.ts           # AMIORA constants
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   ├── useUser.ts
│   │   └── usePrices.ts
│   ├── store/
│   │   └── cartStore.ts           # Zustand cart store
│   └── styles/
│       └── globals.css            # AMIORA design tokens
```

---

## Design System (`src/styles/globals.css`)

```css
@import url('https://api.fontshare.com/v2/css?f[]=cormorant@400,500,600,700&f[]=jost@300,400,500,600,700&display=swap');

:root {
  /* AMIORA Brand Colors */
  --color-deep-teal:       #285260;
  --color-teal:            #548C92;
  --color-light-teal:      #B4D7D8;
  --color-cream:           #E0D7CF;
  --color-sand:            #AB9072;

  /* Surfaces */
  --color-bg:              #FAF8F5;
  --color-surface:         #F5F1EC;
  --color-surface-2:       #EDE9E3;
  --color-surface-offset:  #E0D7CF;
  --color-divider:         #D8D2C9;
  --color-border:          #CEC8BF;

  /* Text */
  --color-text:            #1A1410;
  --color-text-muted:      #6B6560;
  --color-text-faint:      #A8A29C;
  --color-text-inverse:    #FAF8F5;

  /* Primary */
  --color-primary:         #548C92;
  --color-primary-hover:   #285260;
  --color-primary-active:  #1D3D48;
  --color-primary-highlight: #B4D7D8;

  /* Accent Warm */
  --color-accent:          #AB9072;
  --color-accent-hover:    #8D7358;

  /* Gold / Jewellery feel */
  --color-gold:            #C9A84C;
  --color-gold-light:      #E8D5A3;

  /* Status */
  --color-success:         #3D7A47;
  --color-error:           #B03A2E;
  --color-warning:         #B07A00;

  /* Typography */
  --font-display: 'Cormorant', Georgia, serif;
  --font-body:    'Jost', 'Helvetica Neue', sans-serif;

  /* Type Scale */
  --text-xs:   clamp(0.75rem,  0.7rem + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem + 0.75vw, 1.5rem);
  --text-xl:   clamp(1.5rem,   1.2rem + 1.25vw, 2.25rem);
  --text-2xl:  clamp(2rem,     1.2rem + 2.5vw, 3.5rem);
  --text-3xl:  clamp(2.5rem,   1rem + 4vw, 5rem);

  /* Spacing */
  --space-1: 0.25rem; --space-2: 0.5rem;  --space-3: 0.75rem;
  --space-4: 1rem;    --space-6: 1.5rem;  --space-8: 2rem;
  --space-10: 2.5rem; --space-12: 3rem;   --space-16: 4rem;
  --space-20: 5rem;   --space-24: 6rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(26,20,16,0.08);
  --shadow-md: 0 4px 16px rgba(26,20,16,0.10);
  --shadow-lg: 0 12px 40px rgba(26,20,16,0.14);

  /* Transition */
  --transition: 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Dark mode — keeping jewellery feel */
[data-theme="dark"] {
  --color-bg:             #0F0D0B;
  --color-surface:        #171411;
  --color-surface-2:      #1E1B17;
  --color-surface-offset: #252118;
  --color-text:           #E8E4DE;
  --color-text-muted:     #A09890;
  --color-primary:        #72A8AE;
  --color-primary-hover:  #548C92;
  --color-accent:         #C4A880;
}
```

---

## Header & Mega-Menu (`src/components/layout/Header.tsx`)

### Structure
```
<header sticky top-0 z-50>
  ├── Top bar (optional): "Free shipping on orders ₹5000+ | Call: +91-XXXXXXXXXX"
  ├── Main nav:
  │   ├── Logo (AMIORA — SVG logotype)
  │   ├── Nav links:
  │   │   ├── Collections (hover → mega-menu)
  │   │   ├── Shop
  │   │   ├── About
  │   │   └── Blogs
  │   └── Right actions:
  │       ├── Search icon
  │       ├── User icon (login/profile)
  │       ├── Wishlist icon (count badge)
  │       └── Cart icon (count badge)
  └── Mobile: hamburger → slide-out drawer
```

### Mega-Menu Behavior (`src/components/layout/MegaMenu.tsx`)
```
On hover of "Collections" nav item:
  ├── Full-width dropdown appears (not limited to nav width)
  ├── Left column: All collection names (clickable → /collections/[slug])
  │   └── Each collection name shows 4–5 product names underneath it
  │       (product names are links → /products/[slug])
  ├── Right column: Featured image (rotate through collection banners)
  └── Close on mouse leave or click outside

Data: fetch from GET /api/menu/collections
      { collections: [{ name, slug, products: [{name,slug}] }] }
```

### AMIORA SVG Logo (inline in Header)
```svg
<!-- Clean logotype: "AMIORA" in Cormorant Garamond style, with a subtle diamond/gem mark -->
<svg viewBox="0 0 160 40" ...>
  <!-- Gem mark: simple faceted diamond outline -->
  <!-- Text: AMIORA in display letterforms -->
</svg>
```

---

## Product Card (`src/components/ui/ProductCard.tsx`)

### Specs
- Container: 1:1 aspect ratio
- Main image: primary image (is_primary=true)
- Hover image: swap to is_hover=true image on mouseenter
- Below image:
  - Product name (--font-display, --text-lg)
  - Price (calculated from live prices, formatted ₹XX,XXX)
  - Star rating (average, count)
  - Collection tag chip (--color-teal)
  - Category tag chip (--color-sand)
- On image:
  - Heart icon (top-right, toggles wishlist)
  - "ADD TO CART" button (bottom, slides up on hover)
  - "VIEW PRODUCT" button (bottom, slides up on hover — secondary style)
- Click on image → navigate to /products/[slug]

### Price Display
```
Show variant selector (dropdown: metal variant + purity)
Price updates live using formula from pricingEngine
Show "Price from ₹XX,XXX" for base variant on card
```

---

## Cart Store (`src/store/cartStore.ts`)

```typescript
// Zustand store (in-memory, no localStorage)
interface CartItem {
  productId: string
  variantId: string
  sizeLabel: string
  productName: string
  variantLabel: string
  imageUrl: string
  unitPrice: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}
```

---

## Tasks for This Session

- [ ] Init Next.js project with TypeScript + Tailwind
- [ ] Install all dependencies listed above
- [ ] Set up `globals.css` with full AMIORA design tokens
- [ ] Create Supabase browser & server clients
- [ ] Design and implement SVG logo for AMIORA
- [ ] Build `Header.tsx` — sticky, with all nav items and right-side icons
- [ ] Build `MegaMenu.tsx` — collections hover dropdown with product names
- [ ] Build `MobileMenu.tsx` — slide-out drawer for mobile
- [ ] Build `Footer.tsx` — links, social, policies, contact info
- [ ] Build `ProductCard.tsx` — full spec as above including hover image swap
- [ ] Build `Skeleton.tsx` — shimmer skeleton for product cards
- [ ] Set up `cartStore.ts` with Zustand (in-memory)
- [ ] Set up `useUser.ts` hook for auth state
- [ ] Verify responsive at 375px (mobile) and 1280px (desktop)
- [ ] Test mega-menu data fetch from API

---

## Next Session
→ **SESSION_04_HOMEPAGE.md** — Homepage sections, hero, featured, testimonials

