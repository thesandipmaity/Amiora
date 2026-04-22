-- =============================================================================
-- AMIORA DIAMONDS — Patch Migration 002
-- Run this ONLY if you already ran 001_initial_schema.sql
-- Fixes column name mismatches between DB schema and application code
-- =============================================================================

-- ─────────────────────────────────────────────
-- FIX 1: smart_pairs — rename paired_with_id → paired_product_id
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'smart_pairs' AND column_name = 'paired_with_id'
  ) THEN
    ALTER TABLE smart_pairs
      DROP CONSTRAINT IF EXISTS smart_pairs_paired_with_id_fkey,
      DROP CONSTRAINT IF EXISTS smart_pairs_product_id_paired_with_id_key;

    ALTER TABLE smart_pairs RENAME COLUMN paired_with_id TO paired_product_id;

    ALTER TABLE smart_pairs
      ADD CONSTRAINT smart_pairs_paired_product_id_fkey
        FOREIGN KEY (paired_product_id) REFERENCES products(id) ON DELETE CASCADE,
      ADD CONSTRAINT smart_pairs_product_id_paired_product_id_key
        UNIQUE (product_id, paired_product_id);
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- FIX 2: orders — store_pickup_id → pickup_store_id
--                 shipping_address_id (uuid FK) → shipping_address (jsonb)
-- ─────────────────────────────────────────────
DO $$
BEGIN
  -- Rename store_pickup_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'store_pickup_id'
  ) THEN
    ALTER TABLE orders
      DROP CONSTRAINT IF EXISTS orders_store_pickup_id_fkey;
    ALTER TABLE orders RENAME COLUMN store_pickup_id TO pickup_store_id;
    ALTER TABLE orders
      ADD CONSTRAINT orders_pickup_store_id_fkey
        FOREIGN KEY (pickup_store_id) REFERENCES stores(id);
  END IF;

  -- Replace shipping_address_id (uuid FK) with shipping_address (jsonb)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_address_id'
  ) THEN
    ALTER TABLE orders
      DROP CONSTRAINT IF EXISTS orders_shipping_address_id_fkey;
    ALTER TABLE orders DROP COLUMN shipping_address_id;
    ALTER TABLE orders ADD COLUMN shipping_address jsonb;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- FIX 3: reviews — add status, is_verified, is_verified_purchase, reviewer_name
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'status'
  ) THEN
    ALTER TABLE reviews
      ADD COLUMN status text DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE reviews ADD COLUMN is_verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'is_verified_purchase'
  ) THEN
    ALTER TABLE reviews ADD COLUMN is_verified_purchase boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'reviewer_name'
  ) THEN
    ALTER TABLE reviews ADD COLUMN reviewer_name text;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- FIX 4: customization_requests — add contact_preference, contact_value
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customization_requests' AND column_name = 'contact_preference'
  ) THEN
    ALTER TABLE customization_requests
      ADD COLUMN contact_preference text CHECK (contact_preference IN ('phone','whatsapp','email')),
      ADD COLUMN contact_value text;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- FIX 5: demo_requests — rename request_type → type
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demo_requests' AND column_name = 'request_type'
  ) THEN
    ALTER TABLE demo_requests
      DROP CONSTRAINT IF EXISTS demo_requests_request_type_check;
    ALTER TABLE demo_requests RENAME COLUMN request_type TO type;
    ALTER TABLE demo_requests
      ADD CONSTRAINT demo_requests_type_check
        CHECK (type IN ('visit_store', 'home_visit'));
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- FIX 6: blogs — add meta_title, meta_description
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blogs' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE blogs
      ADD COLUMN meta_title text,
      ADD COLUMN meta_description text;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- FIX 7: user_profiles — add role column
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles
      ADD COLUMN role text DEFAULT 'customer'
        CHECK (role IN ('customer','admin'));
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- FIX 8: Update reviews RLS policy to use status column
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "public_read_approved_reviews" ON reviews;
CREATE POLICY "public_read_approved_reviews"
  ON reviews FOR SELECT USING (status = 'approved' OR is_approved = true);

DROP POLICY IF EXISTS "user_update_own_review" ON reviews;
CREATE POLICY "user_update_own_review"
  ON reviews FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Update index
DROP INDEX IF EXISTS idx_reviews_product;
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id) WHERE status = 'approved';

-- =============================================================================
-- DONE ✓  All schema mismatches patched.
-- =============================================================================
