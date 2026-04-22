import type { ProductVariant, ProductImage } from './product'
import type { CalculatedPrice } from './pricing'

export interface CartItem {
  id: string
  productId: string
  variantId: string
  productName: string
  variantDetails: string
  slug: string
  image: ProductImage
  variant: ProductVariant
  quantity: number
  livePrice: CalculatedPrice
  customizationNotes?: string
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  totalItems: number
  couponCode?: string
  discount: number
}
