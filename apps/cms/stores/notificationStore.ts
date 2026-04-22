import { create } from 'zustand'

export interface Notification {
  message: string
  at:      string
  type:    'order' | 'request' | 'review' | 'price'
}

interface NotificationStore {
  notifications: Notification[]
  counts:        { orders: number; requests: number; reviews: number }
  addNotification: (n: Notification) => void
  markAllRead:     () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  counts: { orders: 0, requests: 0, reviews: 0 },

  addNotification(n) {
    set(s => ({
      notifications: [n, ...s.notifications].slice(0, 50),
      counts: {
        orders:   s.counts.orders   + (n.type === 'order'   ? 1 : 0),
        requests: s.counts.requests + (n.type === 'request' ? 1 : 0),
        reviews:  s.counts.reviews  + (n.type === 'review'  ? 1 : 0),
      },
    }))
  },

  markAllRead() {
    set({ counts: { orders: 0, requests: 0, reviews: 0 } })
  },
}))
