# SESSION 01 — Database Schema Design (Supabase)

> **Depends on:** SESSION_00_PROJECT_OVERVIEW.md  
> **Deliverable:** All Supabase tables created, RLS policies set, seed data template ready  
> **Estimated Time:** 3–4 hours

---

## Objective
Design and implement the complete PostgreSQL schema on Supabase. Every table needed by both the Storefront and CMS must be created here with proper foreign keys, indexes, and Row Level Security (RLS) policies.

---

## Tables to Create

### 1. `materials`
Stores base material types (Gold, Silver, Diamond types).

```sql
CREATE TABLE materials (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,           -- 'Gold', 'Silver', 'Diamond'
  type        text NOT NULL,           -- 'metal' | 'gem'
  created_at  timestamptz DEFAULT now()
);
```

### 2. `metal_variants`
Gold variants (Rose Gold, Yellow Gold, White Gold) and Silver.

```sql
CREATE TABLE metal_variants (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id   uuid REFERENCES materials(id) ON DELETE CASCADE,
  variant_name  text NOT NULL,    -- 'Rose Gold', 'Yellow Gold', 'White Gold', 'Silver'
  purities      text[] NOT NULL,  -- e.g. ARRAY['18k','14k','9k'] or ARRAY['92.5']
  created_at    timestamptz DEFAULT now()
);
```

### 3. `gem_variants`
Diamond cuts and types.

```sql
CREATE TABLE gem_variants (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id uuid REFERENCES materials(id) ON DELETE CASCADE,
  cut_name    text NOT NULL,   -- 'Round Brilliant', 'Princess', 'Emerald', etc.
  created_at  timestamptz DEFAULT now()
);
```

### 4. `live_prices`
Gold & Silver live market price (updated once daily via API).

```sql
CREATE TABLE live_prices (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  metal        text NOT NULL,        -- 'gold_999' | 'silver_999'
  price_per_gram numeric(12,4) NOT NULL,
  currency     text DEFAULT 'INR',
  fetched_at   timestamptz DEFAULT now()
);
```

### 5. `categories`
Top-level jewellery categories (Rings, Necklaces, Earrings, Bangles, etc.)

```sql
CREATE TABLE categories (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  image_url   text,   -- Cloudinary URL
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
```

### 6. `collections`
Curated collections (Bridal, Everyday, Office Wear, etc.)

```sql
CREATE TABLE collections (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  banner_url  text,   -- Cloudinary URL (wide banner for collection page)
  thumb_url   text,   -- Cloudinary URL (thumbnail for menu)
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
```

### 7. `products`
Core products table.

```sql
CREATE TABLE products (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text NOT NULL,
  slug             text NOT NULL UNIQUE,
  description      text,
  short_description text,
  category_id      uuid REFERENCES categories(id),
  collection_id    uuid REFERENCES collections(id),
  sku              text UNIQUE,
  is_active        boolean DEFAULT true,
  is_featured      boolean DEFAULT false,
  making_charge_pct numeric(5,2) DEFAULT 8.00,  -- 8% default
  sort_order       integer DEFAULT 0,
  meta_title       text,
  meta_description text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
```

### 8. `product_variants`
Each variant = one specific metal + purity + gem combo + sizes available.

```sql
CREATE TABLE product_variants (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id       uuid REFERENCES products(id) ON DELETE CASCADE,
  metal_variant_id uuid REFERENCES metal_variants(id),
  purity           text NOT NULL,        -- '18k', '14k', '9k', '92.5'
  gem_variant_id   uuid REFERENCES gem_variants(id),   -- nullable (no gem)
  weight_grams     numeric(8,4),         -- weight of metal used
  gem_weight_ct    numeric(8,4),         -- carat weight (for diamonds)
  gem_price_override numeric(12,2),      -- fixed diamond cut price (can change)
  stock_status     text DEFAULT 'in_stock', -- 'in_stock'|'made_to_order'|'out_of_stock'
  is_active        boolean DEFAULT true,
  created_at       timestamptz DEFAULT now()
);
```

### 9. `product_sizes`
Available sizes per variant (ring sizes, bangle diameters, chain lengths).

```sql
CREATE TABLE product_sizes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
  size_label text NOT NULL,   -- 'US 6', '58mm', '16 inch'
  size_type  text NOT NULL,   -- 'ring_us' | 'ring_eu' | 'bangle_mm' | 'chain_inch'
  in_stock   boolean DEFAULT true
);
```

### 10. `product_images`
5–7 Cloudinary images per product (linked to product, optionally to variant).

```sql
CREATE TABLE product_images (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id  uuid REFERENCES product_variants(id),  -- nullable = applies to all
  url         text NOT NULL,      -- Cloudinary original URL
  alt_text    text,
  sort_order  integer DEFAULT 0,
  is_primary  boolean DEFAULT false,   -- main card image
  is_hover    boolean DEFAULT false,   -- card hover image
  created_at  timestamptz DEFAULT now()
);
```

### 11. `smart_pairs`
Manual or AI-curated product pairing suggestions.

```sql
CREATE TABLE smart_pairs (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id     uuid REFERENCES products(id) ON DELETE CASCADE,
  paired_with_id uuid REFERENCES products(id) ON DELETE CASCADE,
  reason         text,   -- 'Completes the look', 'Often bought together'
  sort_order     integer DEFAULT 0
);
```

### 12. `users` (Supabase Auth extension table)
Extended profile linked to `auth.users`.

```sql
CREATE TABLE user_profiles (
  id           uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name    text,
  phone        text,
  date_of_birth date,
  gender       text,
  profile_pic  text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
```

### 13. `addresses`

```sql
CREATE TABLE addresses (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  label        text DEFAULT 'Home',
  full_name    text NOT NULL,
  phone        text NOT NULL,
  line1        text NOT NULL,
  line2        text,
  city         text NOT NULL,
  state        text NOT NULL,
  pincode      text NOT NULL,
  country      text DEFAULT 'India',
  is_default   boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);
```

### 14. `wishlists`

```sql
CREATE TABLE wishlists (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id  uuid REFERENCES product_variants(id),
  added_at    timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);
```

### 15. `orders`

```sql
CREATE TABLE orders (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number     text UNIQUE NOT NULL,   -- AMR-2025-00001
  user_id          uuid REFERENCES user_profiles(id),
  guest_email      text,      -- for guest checkouts
  status           text DEFAULT 'pending',
  -- 'pending'|'confirmed'|'processing'|'shipped'|'delivered'|'cancelled'|'refunded'
  payment_mode     text,      -- 'online'|'pay_at_store'
  payment_status   text DEFAULT 'pending',   -- 'pending'|'paid'|'failed'|'refunded'
  payment_ref      text,
  subtotal         numeric(12,2) NOT NULL,
  making_charges   numeric(12,2) NOT NULL,
  tax_amount       numeric(12,2) DEFAULT 0,
  shipping_amount  numeric(12,2) DEFAULT 0,
  discount_amount  numeric(12,2) DEFAULT 0,
  total_amount     numeric(12,2) NOT NULL,
  shipping_address_id uuid REFERENCES addresses(id),
  store_pickup_id  uuid,   -- references stores table if pay-at-store
  notes            text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
```

### 16. `order_items`

```sql
CREATE TABLE order_items (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id        uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id      uuid REFERENCES products(id),
  variant_id      uuid REFERENCES product_variants(id),
  size_label      text,
  product_name    text NOT NULL,   -- snapshot at time of order
  variant_label   text NOT NULL,   -- '18k Rose Gold with Round Brilliant Diamond'
  metal_weight_g  numeric(8,4),
  gold_price_used numeric(12,4),   -- snapshot of live price at order time
  making_charge   numeric(12,2),
  gem_price       numeric(12,2),
  unit_price      numeric(12,2) NOT NULL,
  quantity        integer DEFAULT 1,
  subtotal        numeric(12,2) NOT NULL,
  image_url       text
);
```

### 17. `customization_requests`

```sql
CREATE TABLE customization_requests (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES user_profiles(id),
  product_id    uuid REFERENCES products(id),
  description   text NOT NULL,
  reference_images text[],   -- Cloudinary URLs uploaded by user
  status        text DEFAULT 'pending',  -- 'pending'|'reviewed'|'possible'|'not_possible'
  admin_reply   text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### 18. `callback_requests`

```sql
CREATE TABLE callback_requests (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES user_profiles(id),
  name        text NOT NULL,
  phone       text NOT NULL,
  preferred_time text,
  message     text,
  status      text DEFAULT 'pending',   -- 'pending'|'called'|'no_answer'
  created_at  timestamptz DEFAULT now()
);
```

### 19. `demo_requests`
Includes type: visit store OR sales rep comes to customer.

```sql
CREATE TABLE demo_requests (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES user_profiles(id),
  request_type  text NOT NULL,   -- 'visit_store' | 'home_visit'
  store_id      uuid,            -- if visit_store
  address_id    uuid REFERENCES addresses(id),  -- if home_visit
  preferred_date date,
  preferred_time text,
  products_interest text[],      -- product names/IDs of interest
  notes         text,
  status        text DEFAULT 'pending',
  created_at    timestamptz DEFAULT now()
);
```

### 20. `stores`

```sql
CREATE TABLE stores (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  address     text NOT NULL,
  city        text NOT NULL,
  state       text NOT NULL,
  pincode     text,
  phone       text,
  email       text,
  lat         numeric(10,7),
  lng         numeric(10,7),
  timings     jsonb,   -- { mon: "10am-8pm", ... }
  is_active   boolean DEFAULT true,
  image_url   text
);
```

### 21. `reviews`

```sql
CREATE TABLE reviews (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES user_profiles(id),
  order_item_id uuid REFERENCES order_items(id),  -- verify purchase
  rating      integer CHECK (rating BETWEEN 1 AND 5),
  title       text,
  body        text,
  images      text[],   -- Cloudinary URLs
  is_approved boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
```

### 22. `testimonials`
CMS-managed featured testimonials (homepage).

```sql
CREATE TABLE testimonials (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  location    text,
  avatar_url  text,
  quote       text NOT NULL,
  rating      integer DEFAULT 5,
  is_featured boolean DEFAULT false,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
```

### 23. `blogs`

```sql
CREATE TABLE blogs (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  excerpt       text,
  body          text NOT NULL,   -- HTML or Markdown
  cover_url     text,
  author        text DEFAULT 'AMIORA Team',
  tags          text[],
  is_published  boolean DEFAULT false,
  published_at  timestamptz,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
```

### 24. `notifications` (for CMS real-time)

```sql
CREATE TABLE notifications (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type        text NOT NULL,   -- 'new_order'|'custom_request'|'callback'|'demo_request'|'review'
  ref_id      uuid,
  message     text NOT NULL,
  is_read     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
```

---

## RLS Policies Summary

| Table | Public Read | Authenticated Write | Admin Full |
|-------|------------|--------------------|-----------:|
| products | ✅ (is_active=true) | ❌ | ✅ |
| categories | ✅ | ❌ | ✅ |
| collections | ✅ | ❌ | ✅ |
| user_profiles | Own only | Own only | ✅ |
| orders | Own only | Own only | ✅ |
| wishlists | Own only | Own only | ✅ |
| reviews | ✅ (approved) | Authenticated | ✅ |
| live_prices | ✅ | API service only | ✅ |
| blogs | ✅ (published) | ❌ | ✅ |
| testimonials | ✅ (featured) | ❌ | ✅ |
| callback_requests | ❌ | Authenticated | ✅ |
| demo_requests | ❌ | Authenticated | ✅ |
| customization_requests | Own only | Authenticated | ✅ |

---

## Indexes to Create

```sql
-- Performance-critical indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_collection ON products(collection_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id) WHERE is_approved = true;
CREATE INDEX idx_live_prices_metal ON live_prices(metal, fetched_at DESC);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_smart_pairs_product ON smart_pairs(product_id);
```

---

## Supabase Realtime Config
Enable Realtime on these tables (for CMS WebSocket sync):
- `orders`
- `customization_requests`
- `callback_requests`
- `demo_requests`
- `reviews`
- `notifications`

---

## Tasks for This Session

- [ ] Create all 24 tables via Supabase SQL editor or migration file
- [ ] Set up RLS policies for each table
- [ ] Create all indexes
- [ ] Enable Realtime on the 6 tables above
- [ ] Insert seed data: 2 categories, 2 collections, 2 products (with variants + images)
- [ ] Test: public can read active products, logged-in user can create/view own orders
- [ ] Document the schema in a `db-schema.sql` file in the repo

---

## Next Session
→ **SESSION_02_API_SETUP.md** — Express API scaffold, routes, gold/silver cron job

