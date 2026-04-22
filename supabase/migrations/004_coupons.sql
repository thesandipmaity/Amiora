-- ─── Coupons Table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT        UNIQUE NOT NULL,
  description         TEXT,
  type                TEXT        NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value               NUMERIC     NOT NULL CHECK (value > 0),
  min_order_amount    NUMERIC     NOT NULL DEFAULT 0,
  max_discount_amount NUMERIC,                          -- cap for percentage coupons
  usage_limit         INTEGER,                          -- NULL = unlimited
  used_count          INTEGER     NOT NULL DEFAULT 0,
  expires_at          TIMESTAMPTZ,                      -- NULL = never expires
  is_active           BOOLEAN     NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_coupon_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_coupon_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_coupon_updated_at();

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Storefront can validate (read active coupons only)
CREATE POLICY "coupons_public_read" ON coupons
  FOR SELECT USING (is_active = true);

-- Service-role / admin has full access (handled via service key in API routes)
