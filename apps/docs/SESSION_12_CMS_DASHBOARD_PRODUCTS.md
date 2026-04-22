# SESSION 12 — CMS Dashboard, Products & Inventory

> **Depends on:** SESSION_11 (CMS scaffold)  
> **Deliverable:** Working sales dashboard + full product CRUD with variant/image management  
> **Estimated Time:** 5–6 hours

---

## Dashboard Page (`/dashboard`)

```
ROW 1 — KPI Cards (4 cards):
├── Total Revenue (today / this week / this month toggle)
├── Total Orders
├── Pending Orders
└── Low Stock / Made-to-Order Count

ROW 2 — Charts:
├── Revenue Trend (last 30 days line chart — Recharts)
└── Orders by Status (donut/pie chart)

ROW 3 — Tables:
├── Recent Orders (last 10, with quick status update)
└── Pending Requests (customization + callback + demo)
```

---

## Products Management (`/products`)

### List View
```
Table columns: Image | Name | Collection | Category | Variants | Status | Actions
- Search bar (by name/SKU)
- Filter by: collection, category, status (active/inactive)
- Sort by: created_at, name, price
- Bulk actions: activate/deactivate selected
- "Add Product" button → /products/new
```

### Product Form (`/products/new` and `/products/[id]/edit`)
```
SECTION 1: Basic Info
- Name, Slug (auto-generated), SKU
- Short Description, Full Description (TipTap rich text editor)
- Collection (dropdown), Category (dropdown)
- Is Featured toggle, Is Active toggle, Sort Order
- Making Charge % (default 8, editable per product)

SECTION 2: Images
- Upload up to 7 images (Cloudinary via API)
- Drag to reorder
- Mark Primary and Hover images
- Can tag images to specific variants

SECTION 3: Variants
- Table of variants (add/remove rows)
- Each row: Metal Type | Purity | Gold Variant | Gem Cut | Weight(g) | Gem Weight(ct) | Gem Price | Stock Status
- Variants determine available combinations

SECTION 4: Sizes
- Per variant: add available sizes (ring US, EU, bangle mm, chain inches)
- Toggle in_stock per size

SECTION 5: Smart Pairs
- Search and add products to "Complete the Look"
- Up to 6 paired products

SECTION 6: SEO
- Meta Title, Meta Description

SAVE / PUBLISH buttons
```

---

## Collections Management (`/collections`)
```
- List with banner image, name, product count, status
- Add/Edit collection: name, slug, description, banner image upload, thumb image, sort order
```

---

## Tasks for This Session

- [ ] Build Dashboard KPI cards
- [ ] Build Revenue line chart (Recharts)
- [ ] Build Orders by Status donut chart
- [ ] Build Recent Orders table with status update
- [ ] Build Pending Requests widget
- [ ] Build Products list table with search/filter
- [ ] Build Product form (all 6 sections)
- [ ] Build image upload with Cloudinary (drag-to-reorder)
- [ ] Build variant builder table
- [ ] Build size manager per variant
- [ ] Build smart pairs selector
- [ ] Build Collections CRUD
- [ ] Connect everything to API

---

## Next Session
→ **SESSION_13_CMS_ORDERS_CUSTOMERS.md** — Order management, customer management, requests inbox

