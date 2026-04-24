/**
 * Pricing Calculator — Amiora Diamonds
 *
 * Formula (from SESSION_02_API_SETUP.md):
 *   pure_price       = weight_grams × live_price_per_gram_999
 *   base_metal_price = pure_price × purity_multiplier
 *   making_charge    = base_metal_price × (making_charge_pct / 100)
 *   gem_price        = variant.gem_price_override ?? 0
 *   final_price      = base_metal_price + making_charge + gem_price
 *
 * All prices in INR, rounded to 2 decimal places.
 */

export type SupportedPurity = '22k' | '18k' | '14k' | '9k' | '92.5'

/** Ratio of pure metal content per purity grade */
export const PURITY_MULTIPLIERS: Record<SupportedPurity, number> = {
  '22k':  22 / 24,   // 0.9167
  '18k':  18 / 24,   // 0.7500
  '14k':  14 / 24,   // 0.5833
  '9k':    9 / 24,   // 0.3750
  '92.5': 0.925,     // Sterling Silver
}

/**
 * Smart purity parser — handles custom purities like:
 * "9kt", "9K", "21k", "750", "585", "375", "0.75", "99.9%" etc.
 * Returns a multiplier between 0 and 1.
 */
export function parsePurityMultiplier(purity: string): number {
  const raw = purity.toLowerCase().trim()

  // Standard lookup first
  const known = PURITY_MULTIPLIERS[raw as SupportedPurity]
  if (known !== undefined) return known

  // Strip 'k', 'kt', 'karat' suffix → karat gold  e.g. "9kt" → 9/24
  const karatMatch = raw.match(/^(\d+(?:\.\d+)?)\s*k(?:t|arat)?$/)
  if (karatMatch) {
    const k = parseFloat(karatMatch[1])
    if (k > 0 && k <= 24) return k / 24
  }

  // Millesimal fineness (3-digit): 999, 750, 585, 375 etc.
  const finessMatch = raw.match(/^(\d{3})$/)
  if (finessMatch) {
    const f = parseInt(finessMatch[1])
    if (f > 0 && f <= 999) return f / 1000
  }

  // Percentage: "92.5%", "99.9%" → divide by 100
  const pctMatch = raw.match(/^(\d+(?:\.\d+)?)\s*%$/)
  if (pctMatch) {
    const p = parseFloat(pctMatch[1])
    if (p > 0 && p <= 100) return p / 100
  }

  // Plain decimal: "0.75", "0.925"
  const decimalMatch = raw.match(/^0?\.\d+$/)
  if (decimalMatch) {
    const d = parseFloat(raw)
    if (d > 0 && d <= 1) return d
  }

  // Fallback — return 1 (pure) so price is not broken
  return 1
}

export interface PriceInput {
  /** Gross metal weight in grams */
  weightGrams: number
  /** Purity grade of the metal */
  purity: string
  /** Live 999-purity price per gram (INR) from live_prices table */
  livePricePerGram999: number
  /** Making charge percentage from products.making_charge_pct (default 8) */
  makingChargePct?: number
  /** Fixed gem/diamond price from product_variants.gem_price_override */
  gemPriceOverride?: number | null
}

export interface PriceBreakdown {
  purePrice: number
  baseMetalPrice: number
  makingCharge: number
  gemPrice: number
  finalPrice: number
  currency: 'INR'
  /** Purity multiplier used (for display/audit) */
  purityMultiplier: number
}

/**
 * Calculate the final price for a single product variant.
 * Returns a full breakdown for display in the UI price tooltip.
 */
export function calculateVariantPrice(input: PriceInput): PriceBreakdown {
  const {
    weightGrams,
    purity,
    livePricePerGram999,
    makingChargePct = 8,
    gemPriceOverride = null,
  } = input

  const purityMultiplier = parsePurityMultiplier(purity)

  const purePrice       = weightGrams * livePricePerGram999
  const baseMetalPrice  = purePrice * purityMultiplier
  const makingCharge    = baseMetalPrice * (makingChargePct / 100)
  const gemPrice        = gemPriceOverride ?? 0
  const finalPrice      = baseMetalPrice + makingCharge + gemPrice

  return {
    purePrice:       round2(purePrice),
    baseMetalPrice:  round2(baseMetalPrice),
    makingCharge:    round2(makingCharge),
    gemPrice:        round2(gemPrice),
    finalPrice:      round2(finalPrice),
    purityMultiplier,
    currency: 'INR',
  }
}

/** Format INR price for display */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}
