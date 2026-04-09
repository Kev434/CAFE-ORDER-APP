'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { OrderType } from '@/types'
import { apiFetch } from '@/lib/api'
import Link from 'next/link'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<OrderType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch(`/orders/${id}`)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-brew-700 border-t-gold animate-spin mx-auto mb-4" />
          <p className="text-brew-500 text-sm">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-brew-500">Order not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      {/* Success Header */}
      <div className="text-center mb-10 animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="font-display text-3xl text-brew-50">Order Placed!</h1>
        <p className="text-brew-500 mt-2 font-mono text-sm">#{order.id.slice(0, 8)}</p>
      </div>

      {/* Order Details */}
      <div className="bg-brew-900 border border-brew-800 rounded-2xl p-5 animate-fade-up stagger-2">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-brew-800">
          <span className="text-brew-400 text-sm">Status</span>
          <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-lg text-sm font-medium capitalize">
            {order.status}
          </span>
        </div>

        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-brew-200">
                {item.name} <span className="text-brew-500">×{item.quantity}</span>
              </span>
              <span className="text-brew-200">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-brew-800 mt-4 pt-4 flex justify-between items-center">
          <span className="text-brew-300 font-medium">Total</span>
          <span className="font-display text-2xl text-gold">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center mt-8 animate-fade-up stagger-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-brew-950 rounded-xl font-semibold hover:bg-gold-light transition-all duration-300 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>
      </div>
    </div>
  )
}
