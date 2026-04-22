export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'viewer'

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: AdminRole
  avatarUrl?: string
  lastLoginAt?: string
  createdAt: string
}

export interface DashboardMetrics {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  orderGrowth: number
  totalCustomers: number
  customerGrowth: number
  averageOrderValue: number
  pendingOrders: number
  lowStockProducts: number
  topSellingProducts: TopSellingProduct[]
  revenueByDay: RevenueDataPoint[]
}

export interface TopSellingProduct {
  productId: string
  productName: string
  imageUrl: string
  unitsSold: number
  revenue: number
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface MediaAsset {
  id: string
  filename: string
  url: string
  thumbnailUrl: string
  mimeType: string
  sizeBytes: number
  width?: number
  height?: number
  folder?: string
  uploadedBy: string
  createdAt: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'flat'
  value: number
  minOrderValue?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usedCount: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
}
