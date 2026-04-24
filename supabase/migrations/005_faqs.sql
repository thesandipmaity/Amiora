-- ── Migration 005: FAQs ─────────────────────────────────────────────────────
-- 1. Product-level FAQs stored as JSONB array in products table
-- 2. Site-wide FAQs table for homepage

-- Product FAQs: stored as [{ question: string, answer: string }]
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;

-- Site-wide FAQ table
CREATE TABLE IF NOT EXISTS site_faqs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question    text NOT NULL,
  answer      text NOT NULL,
  sort_order  int  NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE site_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active site_faqs"
  ON site_faqs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to site_faqs"
  ON site_faqs FOR ALL
  USING (auth.role() = 'service_role');
