'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, LogOut, Package, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { apiFetchAuth } from '@/lib/api'
import { OrderType, LoyaltyType } from '@/types'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loyalty, setLoyalty] = useState<LoyaltyType | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      const token = session.access_token
      try {
        const [loyaltyData, ordersData] = await Promise.all([
          apiFetchAuth('/loyalty/history', token),
          apiFetchAuth('/orders', token),
        ])
        setLoyalty(loyaltyData)
        setOrders(ordersData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-brew-700 border-t-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-display text-3xl text-brew-50">Profile</h1>
          <p className="text-brew-500 text-sm mt-1">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-brew-500 hover:text-red-400 hover:bg-red-400/10 border border-brew-800 hover:border-red-400/20 transition-all duration-300 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Loyalty Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gold-900/40 via-gold-800/20 to-brew-900 border border-gold/20 rounded-2xl p-8 mb-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center">
              <Star className="w-5 h-5 text-gold" />
            </div>
            <span className="text-brew-400 text-sm uppercase tracking-wider">Loyalty Points</span>
          </div>
          <p className="font-display text-5xl text-gold">{loyalty?.balance ?? 0}</p>
          <p className="text-brew-400 text-sm mt-2">Keep ordering to earn more rewards</p>
        </div>
      </div>

      {/* Order History */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Package className="w-5 h-5 text-brew-500" />
          <h2 className="font-display text-xl text-brew-50">Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="bg-brew-900 border border-brew-800 rounded-2xl p-8 text-center">
            <p className="text-brew-500">No orders yet</p>
            <Link href="/" className="inline-block mt-3 text-gold text-sm hover:text-gold-light transition-colors">
              Place your first order
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className={`opacity-0 animate-fade-up stagger-${Math.min(i + 1, 8)} block group bg-brew-900 border border-brew-800 rounded-2xl p-5 hover:border-gold/20 transition-all duration-300`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-sm text-brew-300">#{order.id.slice(0, 8)}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-brew-500 text-sm">{order.items.length} item(s)</span>
                      <span className="text-brew-700">·</span>
                      <span className="font-display text-gold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-lg text-xs font-medium capitalize">
                      {order.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-brew-700 group-hover:text-gold transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
