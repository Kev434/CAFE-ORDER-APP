'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { MenuItemType } from '@/types'
import { useCartStore } from '@/lib/store/cart'

interface Props {
  item: MenuItemType
  index?: number
}

const categoryStyles: Record<string, { gradient: string; emoji: string; accent: string }> = {
  coffee: {
    gradient: 'from-amber-950/80 via-amber-900/40 to-brew-900',
    emoji: '☕',
    accent: 'bg-amber-800/30',
  },
  espresso: {
    gradient: 'from-stone-900/80 via-stone-800/40 to-brew-900',
    emoji: '⚡',
    accent: 'bg-stone-700/30',
  },
  tea: {
    gradient: 'from-emerald-950/60 via-emerald-900/30 to-brew-900',
    emoji: '🍵',
    accent: 'bg-emerald-900/30',
  },
  pastry: {
    gradient: 'from-orange-950/60 via-orange-900/30 to-brew-900',
    emoji: '🥐',
    accent: 'bg-orange-900/30',
  },
}

export default function MenuCard({ item, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const style = categoryStyles[item.category] || categoryStyles.coffee

  return (
    <div className={`opacity-0 animate-fade-up stagger-${Math.min(index + 1, 8)}`}>
      <div className="group relative bg-brew-900 border border-brew-800 rounded-2xl overflow-hidden hover:border-gold/30 hover:gold-glow transition-all duration-500">
        {/* Image / Visual Header */}
        {item.imageUrl ? (
          <div className="relative h-44 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brew-900 via-brew-900/20 to-transparent" />
            <span className="absolute top-3 left-3 text-2xl">{style.emoji}</span>
          </div>
        ) : (
          <div className={`relative h-36 bg-gradient-to-br ${style.gradient} overflow-hidden`}>
            {/* Decorative circles */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 ${style.accent} rounded-full blur-xl`} />
            <div className={`absolute -bottom-4 -left-4 w-20 h-20 ${style.accent} rounded-full blur-lg`} />
            {/* Large emoji as visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500 drop-shadow-lg select-none">
                {style.emoji}
              </span>
            </div>
            {/* Category label */}
            <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.15em] text-brew-400/70 font-medium">
              {item.category}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-lg text-brew-50 group-hover:text-gold-light transition-colors duration-300">
            {item.name}
          </h3>
          <p className="text-sm text-brew-500 mt-1.5 leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {item.allergens && item.allergens.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.allergens.map((a) => (
                <span
                  key={a}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-brew-800/80 text-brew-400 border border-brew-800"
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-brew-800/60">
            <span className="text-gold font-display text-xl">
              ${item.price.toFixed(2)}
            </span>
            <button
              onClick={handleAdd}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                added
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 hover:border-gold/40 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
