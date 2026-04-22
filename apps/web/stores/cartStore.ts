import { create } from 'zustand'

export interface CartItem {
  productId:    string
  variantId:    string
  sizeLabel:    string
  productName:  string
  variantLabel: string
  imageUrl:     string
  unitPrice:    number
  quantity:     number
}

interface CartStore {
  items: CartItem[]
  addItem:        (item: CartItem) => void
  removeItem:     (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, qty: number) => void
  clearCart:      () => void
  total:          () => number
  itemCount:      () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem(item) {
    set((state) => {
      const existing = state.items.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      )
      if (existing >= 0) {
        const items = [...state.items]
        items[existing] = {
          ...items[existing]!,
          quantity: Math.min((items[existing]!.quantity) + item.quantity, 5),
        }
        return { items }
      }
      return { items: [...state.items, item] }
    })
  },

  removeItem(productId, variantId) {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.variantId === variantId)
      ),
    }))
  },

  updateQuantity(productId, variantId, qty) {
    if (qty <= 0) {
      get().removeItem(productId, variantId)
      return
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.variantId === variantId
          ? { ...i, quantity: Math.min(qty, 5) }
          : i
      ),
    }))
  },

  clearCart() {
    set({ items: [] })
  },

  total() {
    return get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  },

  itemCount() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0)
  },
}))
