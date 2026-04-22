/**
 * App-level database types — Amiora Diamonds
 *
 * These are the rich, join-resolved types used across both the storefront
 * (apps/web) and CMS (apps/cms). They map to what the API actually returns,
 * not raw DB rows.
 */

import type {
  StockStatus,
  SizeType,
  OrderStatus,
  PaymentMode,
  PaymentStatus,
  CustomRequestStatus,
  CallbackStatus,
  DemoRequestType,
  DemoStatus,
  NotificationType,
  LiveMetal,
} from '../../../packages/database/src/types/supabase'

export type {
  StockStatus,
  SizeType,
  OrderStatus,
  PaymentMode,
  PaymentStatus,
  CustomRequestStatus,
  CallbackStatus,
  DemoRequestType,
  DemoStatus,
  NotificationType,
  LiveMetal,
}

// ─────────────────────────────────────────────────────────────────────────────
// Live Pricing
// ─────────────────────────────────────────────────────────────────────────────

export interface LivePrice {
  id: string
  metal: LiveMetal
  pricePerGram: number
  currency: string
  fetchedAt: string
}

export interface PricedVariant {
  variantId: string
  purity: string
  metalVariantName: string
  weightGrams: number
  gemWeightCt: number | null
  /** Computed by the pricing engine at request time */
  baseMetalPrice: number
  makingCharge: number
  gemPrice: number
  totalPrice: number
  currency: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalogue
// ─────────────────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  isActive: boolean
  sortOrder: number
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  bannerUrl: string | null
  thumbUrl: string | null
  isActive: boolean
  sortOrder: number
}

export interface ProductImage {
  id: string
  url: string
  altText: string | null
  sortOrder: number
  isPrimary: boolean
  isHover: boolean
  variantId: string | null
}

export interface ProductSize {
  id: string
  sizeLabel: string
  sizeType: SizeType
  inStock: boolean
}

export interface ProductVariant {
  id: string
  productId: string
  purity: string
  metalVariantId: string | null
  metalVariantName: string | null
  gemVariantId: string | null
  gemCutName: string | null
  weightGrams: number | null
  gemWeightCt: number | null
  gemPriceOverride: number | null
  stockStatus: StockStatus
  isActive: boolean
  sizes: ProductSize[]
  images: ProductImage[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  categoryId: string | null
  categoryName: string | null
  categorySlug: string | null
  collectionId: string | null
  collectionName: string | null
  sku: string | null
  isActive: boolean
  isFeatured: boolean
  makingChargePct: number
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
  variants: ProductVariant[]
  images: ProductImage[]
  smartPairs?: SmartPair[]
  reviews?: Review[]
}

export interface SmartPair {
  id: string
  pairedWithId: string
  pairedProductName: string
  pairedProductSlug: string
  pairedProductImage: string | null
  reason: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  fullName: string | null
  phone: string | null
  dateOfBirth: string | null
  gender: string | null
  profilePic: string | null
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  label: string
  fullName: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface WishlistItem {
  id: string
  productId: string
  variantId: string | null
  addedAt: string
  product: Pick<Product, 'id' | 'name' | 'slug'> & { primaryImage: string | null }
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string
  orderId: string
  productId: string | null
  variantId: string | null
  sizeLabel: string | null
  productName: string
  variantLabel: string
  metalWeightG: number | null
  /** Snapshot of the live gold price at time of purchase */
  goldPriceUsed: number | null
  makingCharge: number | null
  gemPrice: number | null
  unitPrice: number
  quantity: number
  subtotal: number
  imageUrl: string | null
}

export interface Order {
  id: string
  orderNumber: string
  userId: string | null
  guestEmail: string | null
  status: OrderStatus
  paymentMode: PaymentMode | null
  paymentStatus: PaymentStatus
  paymentRef: string | null
  subtotal: number
  makingCharges: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  totalAmount: number
  shippingAddressId: string | null
  shippingAddress?: Address
  storePickupId: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Reviews & Testimonials
// ─────────────────────────────────────────────────────────────────────────────

export interface Review {
  id: string
  productId: string
  userId: string | null
  userFullName: string | null
  orderItemId: string | null
  rating: number
  title: string | null
  body: string | null
  images: string[] | null
  isApproved: boolean
  createdAt: string
}

export interface Testimonial {
  id: string
  name: string
  location: string | null
  avatarUrl: string | null
  quote: string
  rating: number
  isFeatured: boolean
  sortOrder: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Requests
// ─────────────────────────────────────────────────────────────────────────────

export interface CustomizationRequest {
  id: string
  userId: string | null
  productId: string | null
  description: string
  referenceImages: string[] | null
  status: CustomRequestStatus
  adminReply: string | null
  createdAt: string
  updatedAt: string
}

export interface CallbackRequest {
  id: string
  userId: string | null
  name: string
  phone: string
  preferredTime: string | null
  message: string | null
  status: CallbackStatus
  createdAt: string
}

export interface DemoRequest {
  id: string
  userId: string | null
  requestType: DemoRequestType
  storeId: string | null
  addressId: string | null
  preferredDate: string | null
  preferredTime: string | null
  productsInterest: string[] | null
  notes: string | null
  status: DemoStatus
  createdAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS / Content
// ─────────────────────────────────────────────────────────────────────────────

export interface Store {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string | null
  phone: string | null
  email: string | null
  lat: number | null
  lng: number | null
  timings: Record<string, string> | null
  isActive: boolean
  imageUrl: string | null
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  coverUrl: string | null
  author: string
  tags: string[] | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  type: NotificationType
  refId: string | null
  message: string
  isRead: boolean
  createdAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard stats (CMS)
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  revenueGrowthPct: number
  totalOrders: number
  orderGrowthPct: number
  pendingOrders: number
  totalCustomers: number
  unreadNotifications: number
  revenueByDay: { date: string; revenue: number }[]
  topProducts: { productId: string; name: string; imageUrl: string | null; unitsSold: number; revenue: number }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}
