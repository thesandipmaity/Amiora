import type { ShippingAddress } from './order'

export type CustomerTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface Customer {
  id: string
  email: string
  phone?: string
  fullName: string
  avatarUrl?: string
  tier: CustomerTier
  loyaltyPoints: number
  totalOrders: number
  totalSpent: number
  savedAddresses: ShippingAddress[]
  wishlistProductIds: string[]
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface WishlistItem {
  id: string
  customerId: string
  productId: string
  variantId?: string
  addedAt: string
}
