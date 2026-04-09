'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-2xl bg-brew-900 border border-brew-800 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-9 h-9 text-brew-600" />
          </div>
          <h2 className="font-display text-2xl text-brew-50 mb-2">Your cart is empty</h2>
          <p className="text-brew-500 mb-8">Add some items from the menu to get started</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-brew-950 rounded-xl font-semibold hover:bg-gold-light transition-all duration-300 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="p-2 rounded-xl text-brew-500 hover:text-brew-200 hover:bg-brew-800/50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl text-brew-50">Your Cart</h1>
          <p className="text-brew-500 text-sm">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(({ item, quantity, surpriseDiscount }, i) => {
          const unitPrice = surpriseDiscount ? item.price / 2 : item.price
          return (
          <div
            key={`${item.id}-${surpriseDiscount ? 's' : 'r'}`}
            className={`opacity-0 animate-fade-up stagger-${Math.min(i + 1, 8)} bg-brew-900 border ${surpriseDiscount ? 'border-gold/20' : 'border-brew-800'} rounded-2xl p-5 flex items-center justify-between hover:border-brew-700 transition-all duration-300`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-brew-50 truncate">{item.name}</h3>
                {surpriseDiscount && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/25 rounded-md text-emerald-400 text-[10px] font-bold shrink-0">
                    <Sparkles className="w-3 h-3" />50% OFF
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-gold font-display text-lg">${(unitPrice * quantity).toFixed(2)}</p>
                {surpriseDiscount && (
                  <p className="text-brew-600 line-through text-sm">${(item.price * quantity).toFixed(2)}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="w-8 h-8 rounded-lg bg-brew-800 border border-brew-700 flex items-center justify-center text-brew-300 hover:text-brew-50 hover:border-brew-600 transition-all"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-medium text-brew-100 text-sm">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="w-8 h-8 rounded-lg bg-brew-800 border border-brew-700 flex items-center justify-center text-brew-300 hover:text-brew-50 hover:border-brew-600 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-brew-600 hover:text-red-400 hover:bg-red-400/10 transition-all ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          )
        })}
      </div>

      {/* Total & Checkout */}
      <div className="mt-8 bg-brew-900 border border-brew-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-brew-300 text-sm uppercase tracking-wider">Total</span>
          <span className="font-display text-3xl text-gold">${total.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold text-brew-950 rounded-xl font-semibold hover:bg-gold-light transition-all duration-300 active:scale-[0.98]"
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
