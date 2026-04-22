# SESSION 06 — Single Product Page

> **Depends on:** SESSION_03, SESSION_05 (navigation working)  
> **Deliverable:** Full single product page with gallery, variant selector, pricing, smart pairs, reviews  
> **Estimated Time:** 4–5 hours

---

## Page: `/products/[slug]`

### Layout
```
LEFT (sticky on desktop, top on mobile):
  Image Gallery (5–7 images)
  - Thumbnail strip (vertical on desktop, horizontal on mobile)
  - Main image (click to zoom / lightbox)
  - Image swap on variant change (show variant-specific images)

RIGHT:
  - Breadcrumb: Home › Collections › [Collection] › [Product Name]
  - Product name (--font-display, --text-xl)
  - Short description (--text-base, --color-text-muted)
  - Star rating + review count (clickable → scroll to reviews)
  - Live price (updates on variant selection): ₹XX,XXX (--text-xl, bold)
    - Breakdown tooltip: Base: ₹X + Making (8%): ₹X + Diamond: ₹X = Total
  ─────────────────────────────
  VARIANT SELECTOR:
  - Metal Type (button group): Gold | Silver
  - Gold Variant (if Gold): Rose Gold | Yellow Gold | White Gold
  - Purity (button group): 18k | 14k | 9k (or 92.5 for silver)
  - With Diamond (toggle)
  - Diamond Cut (if diamond toggled): radio group with cut names
  ─────────────────────────────
  SIZE SELECTOR:
  - Available sizes for selected variant
  - "Size Guide" link (opens modal)
  - "All Sizes Available — Custom Size" option
  ─────────────────────────────
  QUANTITY: +/- stepper (1-5)
  ─────────────────────────────
  CTA BUTTONS:
  - "ADD TO CART" (primary, full-width)
  - "BUY NOW" (secondary, full-width)
  ─────────────────────────────
  SERVICE BADGES (icon row):
  - 🔄 100-Day Easy Returns
  - 🚚 Free Shipping ₹5000+
  - 💎 BIS Hallmarked
  - 🛍️ Free Gift Wrap
  ─────────────────────────────
  ADDITIONAL ACTIONS:
  - ♡ Add to Wishlist
  - 📞 Request Callback
  - 🏪 Visit Store (→ store locator)
  - 👤 Request Demo / Home Visit
  ─────────────────────────────
  DESCRIPTION TABS:
  - Description (full)
  - Material Details (metal + purity + diamond info)
  - Shipping & Returns
  - Care Instructions
```

### Smart Pairing Section (below main product)
```
Heading: "Complete the Look"
Horizontal scroll strip of 4–6 paired products (ProductCard format)
Data: GET /api/products/:slug → smart_pairs array
```

### Reviews Section
```
- Aggregate: X.X ★ (N reviews) + bar chart of 5/4/3/2/1 star distribution
- Filter: All | 5★ | 4★ | Verified Purchase
- Review cards: name + date + rating + title + body + images
- "Write a Review" button (opens modal, only if user has ordered this product)
- Pagination: 5 reviews per page
```

---

## Pricing Logic (Client-Side)
```typescript
// hooks/usePrices.ts
// Fetches GET /api/prices/current once and caches in memory
// hooks/useProductPrice.ts
// Given: variant (metal, purity, weight, gem_price)
// Calculates: final price using pricingEngine formula
// Updates live when variant selection changes
```

---

## Tasks for This Session

- [ ] Build ImageGallery with thumbnail strip + zoom/lightbox
- [ ] Build VariantSelector (metal → gold type → purity → gem)
- [ ] Build SizeSelector + Size Guide modal
- [ ] Build live price display with breakdown tooltip
- [ ] Build CTA buttons (Add to Cart adds to Zustand store)
- [ ] Build service badges row
- [ ] Build additional actions (wishlist, callback, demo modals)
- [ ] Build description tabs
- [ ] Build Smart Pairing horizontal strip
- [ ] Build Reviews section with aggregate + cards + pagination
- [ ] Build "Write a Review" modal
- [ ] Verify all variant combinations update price correctly
- [ ] Verify image gallery changes on variant selection

---

## Next Session
→ **SESSION_07_CART_CHECKOUT.md** — Cart and Checkout flow

