-- =============================================================================
-- AMIORA DIAMONDS — Taxonomy Migration
-- Run in Supabase → SQL Editor
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Extend collections: add parent_id (nesting) + menu_type
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE collections
  ADD COLUMN IF NOT EXISTS parent_id  uuid REFERENCES collections(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS menu_type  text DEFAULT 'main'
    CHECK (menu_type IN ('main', 'secondary'));

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Extend categories: add parent_id for sub-categories
--    Also drop the UNIQUE constraint on name so children can share names
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Create tags table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tags (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL UNIQUE,
  slug       text NOT NULL UNIQUE,
  color      text,                    -- hex string, e.g. #10B981
  sort_order integer DEFAULT 0,
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Create product_tags junction table (many-to-many)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_tags (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  tag_id     uuid REFERENCES tags(id)     ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (product_id, tag_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RLS policies
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

-- tags: public read, admin write
CREATE POLICY "tags_public_read"  ON tags FOR SELECT USING (true);
CREATE POLICY "tags_admin_write"  ON tags FOR ALL    USING (is_admin()) WITH CHECK (is_admin());

-- product_tags: public read, admin write
CREATE POLICY "product_tags_public_read" ON product_tags FOR SELECT USING (true);
CREATE POLICY "product_tags_admin_write" ON product_tags FOR ALL    USING (is_admin()) WITH CHECK (is_admin());
