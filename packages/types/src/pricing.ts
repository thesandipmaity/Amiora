export type MetalType = 'gold' | 'silver' | 'platinum'
export type MetalPurity = '24K' | '22K' | '18K' | '14K' | '925' | '950'
export type WeightUnit = 'gram' | 'tola' | 'ounce'
export type Currency = 'INR' | 'USD' | 'AED'

export interface LiveMetalRate {
  id: string
  metal: MetalType
  purity: MetalPurity
  ratePerGram: number
  ratePerTola: number
  currency: Currency
  source: string
  fetchedAt: string
  updatedAt: string
}

export interface PricingConfig {
  makingChargeType: 'flat' | 'percentage'
  makingCharge: number
  wastagePercentage: number
  gstPercentage: number
  hallmarkCharge: number
}

export interface CalculatedPrice {
  metalValue: number
  makingCharges: number
  wastageCharges: number
  hallmarkCharges: number
  subtotal: number
  gst: number
  total: number
  currency: Currency
  breakdown: PriceBreakdown[]
}

export interface PriceBreakdown {
  label: string
  value: number
  isPercentage?: boolean
}

export interface PriceHistoryEntry {
  id: string
  metal: MetalType
  purity: MetalPurity
  ratePerGram: number
  currency: Currency
  recordedAt: string
}
