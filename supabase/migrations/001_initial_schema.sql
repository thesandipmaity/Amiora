-- =============================================================================
-- AMIORA DIAMONDS — Complete Database Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =============================================================================

-- ─────────────────────────────────────────────
-- HELPER: updated_at auto-trigger function
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────
-- HELPER: is_admin() — check JWT user_metadata
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- =============================================================================
-- TABLE 1: materials
-- =============================================================================
CREATE TABLE IF NOT EXISTS materials (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  type       text NOT NULL CHECK (type IN ('metal', 'gem')),
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 2: metal_variants
-- =============================================================================
CREATE TABLE IF NOT EXISTS metal_variants (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id  uuid REFERENCES materials(id) ON DELETE CASCADE NOT NULL,
  variant_name text NOT NULL,
  purities     text[] NOT NULL,
  created_at   timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 3: gem_variants
-- =============================================================================
CREATE TABLE IF NOT EXISTS gem_variants (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id uuid REFERENCES materials(id) ON DELETE CASCADE NOT NULL,
  cut_name    text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 4: live_prices
-- =============================================================================
CREATE TABLE IF NOT EXISTS live_prices (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  metal          text NOT NULL CHECK (metal IN ('gold_999', 'silver_999')),
  price_per_gram numeric(12,4) NOT NULL,
  currency       text DEFAULT 'INR',
  fetched_at     timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 5: categories
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  image_url   text,
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 6: stores
-- =============================================================================
CREATE TABLE IF NOT EXISTS stores (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  address    text NOT NULL,
  city       text NOT NULL,
  state      text NOT NULL,
  pincode    text,
  phone      text,
  email      text,
  lat        numeric(10,7),
  lng        numeric(10,7),
  timings    jsonb,
  is_active  boolean DEFAULT true,
  image_url  text
);

-- =============================================================================
-- TABLE 7: collections
-- =============================================================================
CREATE TABLE IF NOT EXISTS collections (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  banner_url  text,
  thumb_url   text,
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- TABLE 8: products
-- =============================================================================
CREATE TABLE IF NOT EXISTS products (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name              text NOT NULL,
  slug              text NOT NULL UNIQUE,
  description       text,
  short_description text,
  category_id       uuid REFERENCES categories(id),
  collection_id     uuid REFERENCES collections(id),
  sku               text UNIQUE,
  is_active         boolean DEFAULT true,
  is_featured       boolean DEFAULT false,
  making_charge_pct numeric(5,2) DEFAULT 8.00,
  sort_order        integer DEFAULT 0,
  meta_title        text,
  meta_description  text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- TABLE 9: product_variants
-- =============================================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id          uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  metal_variant_id    uuid REFERENCES metal_variants(id),
  purity              text NOT NULL,
  gem_variant_id      uuid REFERENCES gem_variants(id),
  weight_grams        numeric(8,4),
  gem_weight_ct       numeric(8,4),
  gem_price_override  numeric(12,2),
  stock_status        text DEFAULT 'in_stock'
                        CHECK (stock_status IN ('in_stock', 'made_to_order', 'out_of_stock')),
  is_active           boolean DEFAULT true,
  created_at          timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 10: product_sizes
-- =============================================================================
CREATE TABLE IF NOT EXISTS product_sizes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE NOT NULL,
  size_label text NOT NULL,
  size_type  text NOT NULL
               CHECK (size_type IN ('ring_us', 'ring_eu', 'bangle_mm', 'chain_inch', 'other')),
  in_stock   boolean DEFAULT true
);

-- =============================================================================
-- TABLE 11: product_images
-- =============================================================================
CREATE TABLE IF NOT EXISTS product_images (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id),
  url        text NOT NULL,
  alt_text   text,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  is_hover   boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 12: smart_pairs
-- =============================================================================
CREATE TABLE IF NOT EXISTS smart_pairs (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id          uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  paired_product_id   uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  reason              text,
  sort_order          integer DEFAULT 0,
  UNIQUE(product_id, paired_product_id)
);

-- =============================================================================
-- TABLE 13: user_profiles (extends auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id            uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     text,
  phone         text,
  date_of_birth date,
  gender        text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  profile_pic   text,
  role          text DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- TABLE 14: addresses
-- =============================================================================
CREATE TABLE IF NOT EXISTS addresses (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  label      text DEFAULT 'Home',
  full_name  text NOT NULL,
  phone      text NOT NULL,
  line1      text NOT NULL,
  line2      text,
  city       text NOT NULL,
  state      text NOT NULL,
  pincode    text NOT NULL,
  country    text DEFAULT 'India',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 15: wishlists
-- =============================================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id uuid REFERENCES product_variants(id),
  added_at   timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id)
);

-- =============================================================================
-- TABLE 16: orders
-- =============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number        text UNIQUE NOT NULL,
  user_id             uuid REFERENCES user_profiles(id),
  guest_email         text,
  status              text DEFAULT 'pending'
                        CHECK (status IN (
                          'pending','confirmed','processing',
                          'shipped','delivered','cancelled','refunded'
                        )),
  payment_mode        text CHECK (payment_mode IN ('online', 'pay_at_store')),
  payment_status      text DEFAULT 'pending'
                        CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_ref         text,
  subtotal            numeric(12,2) NOT NULL,
  making_charges      numeric(12,2) NOT NULL DEFAULT 0,
  tax_amount          numeric(12,2) DEFAULT 0,
  shipping_amount     numeric(12,2) DEFAULT 0,
  discount_amount     numeric(12,2) DEFAULT 0,
  total_amount        numeric(12,2) NOT NULL,
  shipping_address    jsonb,
  pickup_store_id     uuid REFERENCES stores(id),
  notes               text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-generate order number: AMR-YYYY-NNNNN
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  yr text;
  seq integer;
BEGIN
  yr  := to_char(now(), 'YYYY');
  seq := (SELECT COUNT(*) + 1 FROM orders WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM now()));
  NEW.order_number := 'AMR-' || yr || '-' || LPAD(seq::text, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- =============================================================================
-- TABLE 17: order_items
-- =============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id        uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id      uuid REFERENCES products(id),
  variant_id      uuid REFERENCES product_variants(id),
  size_label      text,
  product_name    text NOT NULL,
  variant_label   text NOT NULL,
  metal_weight_g  numeric(8,4),
  gold_price_used numeric(12,4),
  making_charge   numeric(12,2),
  gem_price       numeric(12,2),
  unit_price      numeric(12,2) NOT NULL,
  quantity        integer DEFAULT 1 CHECK (quantity > 0),
  subtotal        numeric(12,2) NOT NULL,
  image_url       text
);

-- =============================================================================
-- TABLE 18: customization_requests
-- =============================================================================
CREATE TABLE IF NOT EXISTS customization_requests (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             uuid REFERENCES user_profiles(id),
  product_id          uuid REFERENCES products(id),
  description         text NOT NULL,
  reference_images    text[],
  contact_preference  text CHECK (contact_preference IN ('phone','whatsapp','email')),
  contact_value       text,
  status              text DEFAULT 'pending'
                        CHECK (status IN ('pending','reviewed','possible','not_possible')),
  admin_reply         text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE TRIGGER customization_requests_updated_at
  BEFORE UPDATE ON customization_requests
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- TABLE 19: callback_requests
-- =============================================================================
CREATE TABLE IF NOT EXISTS callback_requests (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        uuid REFERENCES user_profiles(id),
  name           text NOT NULL,
  phone          text NOT NULL,
  preferred_time text,
  message        text,
  status         text DEFAULT 'pending'
                   CHECK (status IN ('pending','called','no_answer')),
  created_at     timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 20: demo_requests
-- =============================================================================
CREATE TABLE IF NOT EXISTS demo_requests (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        uuid REFERENCES user_profiles(id),
  type           text NOT NULL CHECK (type IN ('visit_store', 'home_visit')),
  store_id       uuid REFERENCES stores(id),
  address_id     uuid REFERENCES addresses(id),
  preferred_date date,
  preferred_time text,
  notes          text,
  status         text DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at     timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 21: reviews
-- =============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id            uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id               uuid REFERENCES user_profiles(id),
  order_item_id         uuid REFERENCES order_items(id),
  reviewer_name         text,
  rating                integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                 text,
  body                  text,
  images                text[],
  is_verified           boolean DEFAULT false,
  is_verified_purchase  boolean DEFAULT false,
  is_approved           boolean DEFAULT false,
  status                text DEFAULT 'pending'
                          CHECK (status IN ('pending','approved','rejected')),
  created_at            timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 22: testimonials
-- =============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  location    text,
  avatar_url  text,
  quote       text NOT NULL,
  rating      integer DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_featured boolean DEFAULT false,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- =============================================================================
-- TABLE 23: blogs
-- =============================================================================
CREATE TABLE IF NOT EXISTS blogs (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title            text NOT NULL,
  slug             text NOT NULL UNIQUE,
  excerpt          text,
  body             text NOT NULL DEFAULT '',
  cover_url        text,
  author           text DEFAULT 'AMIORA Team',
  tags             text[],
  is_published     boolean DEFAULT false,
  published_at     timestamptz,
  meta_title       text,
  meta_description text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- TABLE 24: notifications
-- =============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type       text NOT NULL
               CHECK (type IN ('new_order','custom_request','callback','demo_request','review')),
  ref_id     uuid,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);


-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug        ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection  ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_active      ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured    ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_pv_product           ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_pi_product           ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_pi_primary           ON product_images(product_id, is_primary) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS idx_orders_user          ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order    ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user       ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product      ON reviews(product_id) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_live_prices_metal    ON live_prices(metal, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_slug           ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published      ON blogs(is_published, published_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_smart_pairs_product  ON smart_pairs(product_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug     ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug      ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_notif_unread         ON notifications(is_read, created_at DESC) WHERE is_read = false;


-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE materials                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE metal_variants            ENABLE ROW LEVEL SECURITY;
ALTER TABLE gem_variants              ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_prices               ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories                ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections               ENABLE ROW LEVEL SECURITY;
ALTER TABLE products                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images            ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_pairs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items               ENABLE ROW LEVEL SECURITY;
ALTER TABLE customization_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_requests             ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials              ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications             ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- materials — public read, admin write
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_materials"  ON materials FOR SELECT USING (true);
CREATE POLICY "admin_all_materials"    ON materials FOR ALL   USING (is_admin());

-- ─────────────────────────────────────────────
-- metal_variants / gem_variants — public read
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_metal_variants" ON metal_variants FOR SELECT USING (true);
CREATE POLICY "admin_all_metal_variants"   ON metal_variants FOR ALL   USING (is_admin());
CREATE POLICY "public_read_gem_variants"   ON gem_variants   FOR SELECT USING (true);
CREATE POLICY "admin_all_gem_variants"     ON gem_variants   FOR ALL   USING (is_admin());

-- ─────────────────────────────────────────────
-- live_prices — public read, service-role write
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_live_prices" ON live_prices FOR SELECT USING (true);
CREATE POLICY "admin_all_live_prices"   ON live_prices FOR ALL   USING (is_admin());

-- ─────────────────────────────────────────────
-- categories / collections — public read (active)
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_categories"
  ON categories FOR ALL USING (is_admin());

CREATE POLICY "public_read_collections"
  ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_collections"
  ON collections FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- products — public read (active), admin all
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_products"
  ON products FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_products"
  ON products FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- product_variants / sizes / images — public read
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_pv"
  ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_pv"
  ON product_variants FOR ALL USING (is_admin());

CREATE POLICY "public_read_ps"     ON product_sizes  FOR SELECT USING (true);
CREATE POLICY "admin_all_ps"       ON product_sizes  FOR ALL   USING (is_admin());
CREATE POLICY "public_read_pi"     ON product_images FOR SELECT USING (true);
CREATE POLICY "admin_all_pi"       ON product_images FOR ALL   USING (is_admin());
CREATE POLICY "public_read_sp"     ON smart_pairs    FOR SELECT USING (true);
CREATE POLICY "admin_all_sp"       ON smart_pairs    FOR ALL   USING (is_admin());

-- ─────────────────────────────────────────────
-- user_profiles — own row only
-- ─────────────────────────────────────────────
CREATE POLICY "user_read_own_profile"
  ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_update_own_profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admin_all_user_profiles"
  ON user_profiles FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- addresses
-- ─────────────────────────────────────────────
CREATE POLICY "user_crud_own_addresses"
  ON addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admin_all_addresses"
  ON addresses FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- wishlists
-- ─────────────────────────────────────────────
CREATE POLICY "user_crud_own_wishlist"
  ON wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admin_all_wishlists"
  ON wishlists FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- orders + order_items — own orders only
-- ─────────────────────────────────────────────
CREATE POLICY "user_read_own_orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_insert_own_orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_cancel_own_orders"
  ON orders FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "admin_all_orders"
  ON orders FOR ALL USING (is_admin());

CREATE POLICY "user_read_own_order_items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY "system_insert_order_items"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );
CREATE POLICY "admin_all_order_items"
  ON order_items FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- customization_requests
-- ─────────────────────────────────────────────
CREATE POLICY "user_crud_own_custom_req"
  ON customization_requests FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admin_all_custom_req"
  ON customization_requests FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- callback_requests / demo_requests — auth insert
-- ─────────────────────────────────────────────
CREATE POLICY "auth_insert_callback"
  ON callback_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "user_read_own_callback"
  ON callback_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admin_all_callback"
  ON callback_requests FOR ALL USING (is_admin());

CREATE POLICY "auth_insert_demo"
  ON demo_requests FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "user_read_own_demo"
  ON demo_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admin_all_demo"
  ON demo_requests FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- stores — public read
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_stores"
  ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_stores"
  ON stores FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- reviews — public read (approved), auth submit
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_approved_reviews"
  ON reviews FOR SELECT USING (status = 'approved' OR is_approved = true);
CREATE POLICY "auth_insert_review"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_update_own_review"
  ON reviews FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "admin_all_reviews"
  ON reviews FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- testimonials — public read (featured)
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_featured_testimonials"
  ON testimonials FOR SELECT USING (is_featured = true);
CREATE POLICY "admin_all_testimonials"
  ON testimonials FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- blogs — public read (published)
-- ─────────────────────────────────────────────
CREATE POLICY "public_read_published_blogs"
  ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "admin_all_blogs"
  ON blogs FOR ALL USING (is_admin());

-- ─────────────────────────────────────────────
-- notifications — admin only
-- ─────────────────────────────────────────────
CREATE POLICY "admin_all_notifications"
  ON notifications FOR ALL USING (is_admin());


-- =============================================================================
-- SUPABASE REALTIME — Enable publication on real-time tables
-- =============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE customization_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE callback_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE demo_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE live_prices;


-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Seed: materials
INSERT INTO materials (name, type) VALUES
  ('Gold',    'metal'),
  ('Silver',  'metal'),
  ('Diamond', 'gem')
ON CONFLICT DO NOTHING;

-- Seed: metal_variants
INSERT INTO metal_variants (material_id, variant_name, purities) VALUES
  ((SELECT id FROM materials WHERE name = 'Gold'), 'Yellow Gold',  ARRAY['22k','18k','14k','9k']),
  ((SELECT id FROM materials WHERE name = 'Gold'), 'Rose Gold',    ARRAY['18k','14k']),
  ((SELECT id FROM materials WHERE name = 'Gold'), 'White Gold',   ARRAY['18k','14k']),
  ((SELECT id FROM materials WHERE name = 'Silver'), 'Sterling Silver', ARRAY['92.5'])
ON CONFLICT DO NOTHING;

-- Seed: gem_variants
INSERT INTO gem_variants (material_id, cut_name) VALUES
  ((SELECT id FROM materials WHERE name = 'Diamond'), 'Round Brilliant'),
  ((SELECT id FROM materials WHERE name = 'Diamond'), 'Princess Cut'),
  ((SELECT id FROM materials WHERE name = 'Diamond'), 'Emerald Cut'),
  ((SELECT id FROM materials WHERE name = 'Diamond'), 'Oval Cut'),
  ((SELECT id FROM materials WHERE name = 'Diamond'), 'Cushion Cut')
ON CONFLICT DO NOTHING;

-- Seed: categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Rings',     'rings',     'Gold, Silver and Diamond Rings',      1),
  ('Necklaces', 'necklaces', 'Elegant necklaces for every occasion',2),
  ('Earrings',  'earrings',  'Studs, hoops, drops and more',        3),
  ('Bangles',   'bangles',   'Traditional and modern bangles',      4),
  ('Bracelets', 'bracelets', 'Chains, tennis and charm bracelets',  5),
  ('Pendants',  'pendants',  'Diamond and gold pendants',           6),
  ('Chains',    'chains',    'Gold and silver chains by length',    7),
  ('Sets',      'sets',      'Matching jewellery sets',             8)
ON CONFLICT DO NOTHING;

-- Seed: collections
INSERT INTO collections (name, slug, description, sort_order) VALUES
  ('Bridal',      'bridal',      'Timeless pieces for your special day',     1),
  ('Everyday',    'everyday',    'Light, wearable jewellery for daily use',  2),
  ('Office Wear', 'office-wear', 'Subtle elegance for the workplace',        3),
  ('Gift Sets',   'gift-sets',   'Curated sets — perfect for gifting',       4)
ON CONFLICT DO NOTHING;

-- Seed: live_prices (placeholder — will be overwritten by cron)
INSERT INTO live_prices (metal, price_per_gram, currency) VALUES
  ('gold_999',   7200.00, 'INR'),
  ('silver_999',  90.00,  'INR')
ON CONFLICT DO NOTHING;

-- Seed: sample product
INSERT INTO products (
  name, slug, short_description, description,
  category_id, is_active, is_featured, making_charge_pct, sku
) VALUES (
  'Classic Solitaire Ring',
  'classic-solitaire-ring',
  'A timeless round brilliant diamond set in 18k yellow gold.',
  'Crafted with precision, this classic solitaire ring features a round brilliant diamond in a four-prong 18k yellow gold setting. Perfect for proposals and anniversaries.',
  (SELECT id FROM categories WHERE slug = 'rings'),
  true, true, 10.00, 'AMR-RNG-001'
) ON CONFLICT DO NOTHING;

-- Sample variant for the seed product
INSERT INTO product_variants (
  product_id, metal_variant_id, purity, weight_grams,
  gem_variant_id, gem_weight_ct, gem_price_override, stock_status
) VALUES (
  (SELECT id FROM products WHERE sku = 'AMR-RNG-001'),
  (SELECT id FROM metal_variants WHERE variant_name = 'Yellow Gold'),
  '18k', 3.5,
  (SELECT id FROM gem_variants WHERE cut_name = 'Round Brilliant'),
  0.25, 15000.00, 'in_stock'
) ON CONFLICT DO NOTHING;


-- =============================================================================
-- DONE ✓
-- All 24 tables created, RLS enabled, indexes added, realtime configured.
-- =============================================================================
