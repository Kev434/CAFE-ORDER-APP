'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { apiFetch, apiFetchAuth } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [guestName, setGuestName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = getTotal()

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const orderPayload = {
        userId: session?.user?.id || null,
        guestName: session ? null : guestName || null,
        items: items.map((i) => ({
          menuItemId: i.item.id,
          quantity: i.quantity,
          surpriseDiscount: i.surpriseDiscount || false,
        })),
      }

      if (!session && !guestName.trim()) {
        setError('Please enter your name for the order')
        setLoading(false)
        return
      }

      let order
      if (session) {
        order = await apiFetchAuth('/orders', session.access_token, {
          method: 'POST',
          body: JSON.stringify(orderPayload),
        })
      } else {
        order = await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify(orderPayload),
        })
      }

      clearCart()
      router.push(`/orders/${order.id}`)
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-brew-500">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10 animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/cart" className="p-2 rounded-xl text-brew-500 hover:text-brew-200 hover:bg-brew-800/50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl text-brew-50">Checkout</h1>
      </div>

      {/* Order Summary */}
      <div className="bg-brew-900 border border-brew-800 rounded-2xl p-5 mb-4">
        <h2 className="text-sm uppercase tracking-wider text-brew-400 mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map(({ item, quantity, surpriseDiscount }) => {
            const unitPrice = surpriseDiscount ? item.price / 2 : item.price
            return (
              <div key={`${item.id}-${surpriseDiscount ? 's' : 'r'}`} className="flex justify-between items-center text-sm">
                <span className="text-brew-200 flex items-center gap-2">
                  {item.name} <span className="text-brew-500">×{quantity}</span>
                  {surpriseDiscount && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/25 rounded text-emerald-400 text-[10px] font-bold">
                      <Sparkles className="w-2.5 h-2.5" />50%
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {surpriseDiscount && (
                    <span className="text-brew-600 line-through text-xs">${(item.price * quantity).toFixed(2)}</span>
                  )}
                  <span className="text-brew-200 font-medium">${(unitPrice * quantity).toFixed(2)}</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="border-t border-brew-800 mt-4 pt-4 flex justify-between items-center">
          <span className="text-brew-300 font-medium">Total</span>
          <span className="font-display text-2xl text-gold">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Guest Name */}
      <div className="bg-brew-900 border border-brew-800 rounded-2xl p-5 mb-6">
        <label className="block text-sm font-medium text-brew-300 mb-3">
          Your Name <span className="text-brew-600">(for pickup)</span>
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-brew-800 border border-brew-700 rounded-xl text-brew-100 placeholder-brew-600 focus:border-gold/50 transition-colors"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold text-brew-950 rounded-xl font-semibold hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {loading ? (
          <span className="animate-pulse-soft">Placing Order...</span>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            Place Order
          </>
        )}
      </button>

      <p className="text-center text-brew-600 text-xs mt-4">
        Your order will be prepared as soon as it&apos;s confirmed
      </p>
    </div>
  )
}
