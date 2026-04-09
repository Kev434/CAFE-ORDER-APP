export interface MenuItemType {
  id: string
  name: string
  description: string
  price: number
  category: 'coffee' | 'espresso' | 'tea' | 'pastry'
  imageUrl?: string
  allergens: string[]
}

export interface CartItem {
  item: MenuItemType
  quantity: number
  surpriseDiscount?: boolean
}

export interface OrderType {
  id: string
  status: string
  total: number
  createdAt: string
  guestName?: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
}

export interface LoyaltyType {
  balance: number
  history: {
    pointsEarned: number
    orderId: string
    createdAt: string
  }[]
}
