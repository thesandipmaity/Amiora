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

  const purityKey = purity.toLowerCase() as SupportedPurity
  const purityMultiplier = PURITY_MULTIPLIERS[purityKey] ?? 1

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
