'use client'

import { useState, useEffect } from 'react'
import { MenuItemType } from '@/types'
import { apiFetch } from '@/lib/api'
import MenuCard from '@/components/MenuCard'
import CategoryFilter from '@/components/CategoryFilter'
import PickForMe from '@/components/PickForMe'

export default function HomePage() {
  const [items, setItems] = useState<MenuItemType[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const path = category ? `/menu?category=${category}` : '/menu'
    apiFetch(path)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient pt-16 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold/70 text-sm font-medium tracking-[0.2em] uppercase mb-4 animate-fade-up">
            Artisan Coffee & Pastries
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-brew-50 leading-tight animate-fade-up stagger-2">
            Brewed to<br />
            <span className="text-gold">Perfection</span>
          </h1>
          <p className="text-brew-400 mt-4 max-w-md leading-relaxed animate-fade-up stagger-3">
            Handcrafted drinks and fresh pastries made with care.
            Order ahead and skip the line.
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl text-brew-50">Our Menu</h2>
            <p className="text-brew-500 text-sm mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
          <PickForMe />
        </div>

        <CategoryFilter selected={category} onSelect={setCategory} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            // Skeleton loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-brew-900 border border-brew-800 rounded-2xl p-5 animate-pulse">
                <div className="h-5 bg-brew-800 rounded-lg w-3/5 mb-3" />
                <div className="h-3 bg-brew-800 rounded w-4/5 mb-2" />
                <div className="h-3 bg-brew-800 rounded w-2/5 mt-4" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-4xl mb-3">☕</p>
              <p className="text-brew-400">No items found in this category</p>
            </div>
          ) : (
            items.map((item, i) => <MenuCard key={item.id} item={item} index={i} />)
          )}
        </div>
      </section>
    </div>
  )
}
