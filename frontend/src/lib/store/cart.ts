import { create } from 'zustand'
import { CartItem, MenuItemType } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: MenuItemType, surpriseDiscount?: boolean) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item, surpriseDiscount = false) =>
    set((state) => {
      // Surprise discount items are unique entries (don't stack with regular)
      const key = surpriseDiscount ? `${item.id}-surprise` : item.id
      const existing = state.items.find(
        (i) => i.item.id === item.id && i.surpriseDiscount === surpriseDiscount
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.item.id === item.id && i.surpriseDiscount === surpriseDiscount
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { item, quantity: 1, surpriseDiscount }] }
    }),
  removeItem: (itemId) =>
    set((state) => ({ items: state.items.filter((i) => i.item.id !== itemId) })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.item.id !== itemId)
        : state.items.map((i) => (i.item.id === itemId ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ items: [] }),
  getTotal: () =>
    get().items.reduce((sum, i) => {
      const price = i.surpriseDiscount ? i.item.price / 2 : i.item.price
      return sum + price * i.quantity
    }, 0),
}))
