import type { Currency } from './pricing'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_to_ship'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
export type PaymentMethod = 'razorpay' | 'upi' | 'bank_transfer' | 'cod' | 'emi'

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId: string
  productName: string
  variantDetails: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  metalRateAtOrder: number
  customizationNotes?: string
  imageUrl: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  paymentReferenceId?: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  makingCharges: number
  gstAmount: number
  shippingCharge: number
  discount: number
  couponCode?: string
  total: number
  currency: Currency
  notes?: string
  trackingNumber?: string
  trackingUrl?: string
  estimatedDelivery?: string
  deliveredAt?: string
  createdAt: string
  updatedAt: string
}
