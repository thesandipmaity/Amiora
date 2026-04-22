# SESSION 05 — Collections, Shop & Filters

> **Depends on:** SESSION_03 (ProductCard), SESSION_04 (Homepage done)  
> **Deliverable:** Shop page, collection listing, single collection page with filters  
> **Estimated Time:** 3–4 hours

---

## Pages

### 1. `/shop` — Full Shop (`src/app/shop/page.tsx`)
### 2. `/collections` — All Collections (`src/app/collections/page.tsx`)
### 3. `/collections/[slug]` — Single Collection (`src/app/collections/[slug]/page.tsx`)
### 4. `/categories/[slug]` — Category Page (`src/app/categories/[slug]/page.tsx`)

---

## Filter System

### Filter Options
```
LEFT SIDEBAR FILTERS (collapsible on mobile → drawer):
├── Metal Type (checkboxes): Gold, Silver
├── Gold Variant (checkboxes): Rose Gold, Yellow Gold, White Gold  [shown if Gold selected]
├── Purity (checkboxes): 18k, 14k, 9k, 92.5
├── Diamond (toggle): With Diamond / Without Diamond
├── Diamond Cut (checkboxes): Round Brilliant, Princess, Emerald, Cushion, etc.
├── Price Range (slider): ₹ min — ₹ max
├── Category (checkboxes): Rings, Necklaces, Earrings, etc.
└── Rating (stars): 4★ & above, 3★ & above
```

### Sort Options (top-right dropdown)
```
- Newest First (default)
- Price: Low to High
- Price: High to Low
- Most Popular
- Best Rated
```

### URL State
```
/shop?metal=gold&purity=18k,14k&diamond=true&sort=price_asc&page=2
(use Next.js useSearchParams for filter state)
```

---

## Product Grid Layout
```
- Default: 3 columns desktop, 2 columns tablet, 1 column mobile
- Toggle: Grid / List view (top-right toggle button)
- Each page: 12 products
- Pagination: numbered + prev/next
- Loading: skeleton grid while fetching
- Empty state: "No products match your filters. Try adjusting them." + Clear Filters button
```

---

## Collection Page Layout (`/collections/[slug]`)
```
┌─────────────────────────────────────────┐
│  COLLECTION BANNER (full-width, 3:1)    │
│  Overlay: Collection Name + Description │
└─────────────────────────────────────────┘
├── Breadcrumb: Home › Collections › [Name]
├── [Filter Sidebar] | [Product Grid]
│    Products fetched filtered by collection_id
└── Smart Pairing: "Complete the Look" strip at bottom
```

---

## Tasks for This Session

- [ ] Build filter sidebar component with all filter options
- [ ] Build sort dropdown
- [ ] Implement URL-based filter state (useSearchParams)
- [ ] Build product grid with pagination
- [ ] Build list view toggle
- [ ] Build empty state
- [ ] Build `/shop` page wiring filters to GET /api/products
- [ ] Build `/collections/[slug]` page with banner + filtered grid
- [ ] Build `/categories/[slug]` page (same layout, different filter)
- [ ] Mobile filter drawer (off-canvas slide-in)
- [ ] Verify filters work end-to-end with API

---

## Next Session
→ **SESSION_06_PRODUCT_PAGE.md** — Single product page

