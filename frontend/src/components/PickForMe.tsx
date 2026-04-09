'use client'

import { useState, useEffect } from 'react'
import { Plus, RefreshCw, X, Sparkles, Dice5, ShoppingCart, Lock } from 'lucide-react'
import { MenuItemType } from '@/types'
import { apiFetch } from '@/lib/api'
import { useCartStore } from '@/lib/store/cart'

const categories = [
  { value: 'coffee', label: 'Coffee', icon: '☕', color: 'from-amber-900/60 to-amber-950/80', border: 'hover:border-amber-700/60', glow: 'hover:shadow-amber-900/20' },
  { value: 'espresso', label: 'Espresso', icon: '⚡', color: 'from-stone-800/60 to-stone-900/80', border: 'hover:border-stone-600/60', glow: 'hover:shadow-stone-800/20' },
  { value: 'tea', label: 'Tea', icon: '🍵', color: 'from-emerald-900/50 to-emerald-950/70', border: 'hover:border-emerald-700/50', glow: 'hover:shadow-emerald-900/20' },
  { value: 'pastry', label: 'Pastry', icon: '🥐', color: 'from-orange-900/50 to-orange-950/70', border: 'hover:border-orange-700/50', glow: 'hover:shadow-orange-900/20' },
]

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function getUsedCategories(): string[] {
  try {
    const data = JSON.parse(localStorage.getItem('surprise-picks') || '{}')
    if (data.date === getTodayKey()) {
      return data.categories || []
    }
    return []
  } catch {
    return []
  }
}

function markCategoryUsed(category: string) {
  const today = getTodayKey()
  const used = getUsedCategories()
  if (!used.includes(category)) {
    used.push(category)
  }
  localStorage.setItem('surprise-picks', JSON.stringify({ date: today, categories: used }))
}

interface Props {
  excluded?: string[]
}

export default function PickForMe({ excluded }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'category' | 'rolling' | 'result'>('category')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [pickedItem, setPickedItem] = useState<MenuItemType | null>(null)
  const [rollingEmoji, setRollingEmoji] = useState('🎲')
  const [added, setAdded] = useState(false)
  const [usedCategories, setUsedCategories] = useState<string[]>([])
  const addItem = useCartStore((s) => s.addItem)

  // Load used categories on mount and when modal opens
  useEffect(() => {
    setUsedCategories(getUsedCategories())
  }, [open])

  // Slot-machine style emoji cycling during "rolling" state
  useEffect(() => {
    if (step !== 'rolling') return
    const emojis = ['☕', '⚡', '🍵', '🥐', '🎲', '✨', '🔮']
    let i = 0
    const interval = setInterval(() => {
      i = (i + 1) % emojis.length
      setRollingEmoji(emojis[i])
    }, 120)
    return () => clearInterval(interval)
  }, [step])

  const pickRandom = async (cat: string) => {
    if (usedCategories.includes(cat)) return
    setStep('rolling')
    setSelectedCategory(cat)
    setAdded(false)
    try {
      const params = new URLSearchParams({ category: cat })
      if (excluded) excluded.forEach((a) => params.append('exclude', a))
      const item = await apiFetch(`/menu/random?${params}`)
      await new Promise((r) => setTimeout(r, 1000))
      setPickedItem(item)
      setStep('result')
    } catch {
      setPickedItem(null)
      setStep('category')
    }
  }

  const handleAddToCart = () => {
    if (pickedItem) {
      addItem(pickedItem, true) // true = surprise discount
      markCategoryUsed(selectedCategory)
      setUsedCategories(getUsedCategories())
      setAdded(true)
      setTimeout(() => {
        setOpen(false)
        setStep('category')
        setPickedItem(null)
        setAdded(false)
      }, 800)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStep('category')
    setPickedItem(null)
    setAdded(false)
  }

  const allUsed = usedCategories.length >= categories.length
  const availableCount = categories.length - usedCategories.length

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="group relative flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 active:scale-95 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-gold-600/20 via-gold/30 to-gold-600/20 opacity-100 group-hover:opacity-100 transition-opacity" />
        <span className="absolute inset-[1px] bg-brew-950 rounded-[15px]" />
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

        <Dice5 className="w-4 h-4 text-gold relative z-10 group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-gold relative z-10">Surprise Me</span>
        {availableCount > 0 && !allUsed && (
          <span className="relative z-10 bg-gold/20 text-gold text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            {availableCount} left
          </span>
        )}
        {allUsed && (
          <Lock className="w-3.5 h-3.5 text-gold/40 relative z-10" />
        )}
        <Sparkles className="w-3.5 h-3.5 text-gold/50 relative z-10 group-hover:text-gold group-hover:animate-pulse-soft transition-colors" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div
            className="relative w-full max-w-[380px] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -inset-4 bg-gold/5 rounded-3xl blur-2xl" />

            <div className="relative bg-brew-900/95 backdrop-blur-xl border border-brew-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              <div className="h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="p-6">
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-brew-800/80 border border-brew-700/50 flex items-center justify-center text-brew-500 hover:text-brew-200 hover:border-brew-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Category Selection */}
                {step === 'category' && (
                  <div className="animate-fade-up">
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                        <Dice5 className="w-7 h-7 text-gold" />
                      </div>
                      <h2 className="font-display text-2xl text-brew-50">Feeling Lucky?</h2>
                      <p className="text-brew-500 text-sm mt-1">Pick a vibe, get <span className="text-gold font-semibold">50% off</span></p>
                      {allUsed && (
                        <p className="text-brew-600 text-xs mt-2">You&apos;ve used all picks for today — come back tomorrow!</p>
                      )}
                    </div>

                    {/* Discount badge */}
                    <div className="flex items-center justify-center gap-2 mb-5 px-4 py-2 bg-gold/5 border border-gold/15 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span className="text-gold text-xs font-medium">50% OFF — 1 surprise pick per category per day</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => {
                        const isUsed = usedCategories.includes(cat.value)
                        return (
                          <button
                            key={cat.value}
                            onClick={() => pickRandom(cat.value)}
                            disabled={isUsed}
                            className={`group/cat relative overflow-hidden p-5 rounded-2xl font-medium transition-all duration-300 active:scale-95 ${
                              isUsed
                                ? 'bg-brew-800/30 border border-brew-800/50 text-brew-600 cursor-not-allowed opacity-50'
                                : `bg-gradient-to-br ${cat.color} border border-brew-700/40 text-brew-300 ${cat.border} ${cat.glow} hover:shadow-lg`
                            }`}
                          >
                            <span className={`text-3xl block mb-2 ${isUsed ? 'grayscale' : 'group-hover/cat:scale-110'} transition-transform duration-300`}>
                              {cat.icon}
                            </span>
                            <span className="text-sm">{cat.label}</span>
                            {isUsed && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brew-700/60 flex items-center justify-center">
                                <Lock className="w-3 h-3 text-brew-500" />
                              </div>
                            )}
                            {!isUsed && (
                              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/cat:opacity-100 transition-opacity duration-300" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Rolling Animation */}
                {step === 'rolling' && (
                  <div className="text-center py-8 animate-fade-in">
                    <div className="relative w-24 h-24 mx-auto mb-5">
                      <div className="absolute inset-0 rounded-full border-2 border-brew-700 border-t-gold animate-spin" />
                      <div className="absolute inset-2 rounded-full bg-gold/5 animate-pulse-soft" />
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        {rollingEmoji}
                      </div>
                    </div>
                    <p className="font-display text-lg text-brew-200">Finding your deal</p>
                    <div className="flex justify-center gap-1 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-soft" style={{ animationDelay: '0s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}

                {/* Result */}
                {step === 'result' && pickedItem && (
                  <div className="animate-scale-in">
                    <div className="text-center mb-5">
                      <Sparkles className="w-5 h-5 text-gold mx-auto mb-2" />
                      <h2 className="font-display text-lg text-brew-300">We think you&apos;ll love</h2>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-gold/8 via-gold/4 to-transparent border border-gold/20 rounded-2xl p-6 mb-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                      {/* 50% off badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/25 rounded-lg mb-4">
                        <span className="text-emerald-400 text-xs font-bold">50% OFF</span>
                      </div>

                      <div className="relative">
                        <h3 className="font-display text-3xl text-gold-light leading-tight">{pickedItem.name}</h3>
                        <p className="text-sm text-brew-400 mt-3 leading-relaxed">{pickedItem.description}</p>
                        <div className="flex items-baseline gap-3 mt-4">
                          {/* Discounted price */}
                          <div className="flex items-baseline gap-1">
                            <span className="text-gold/60 text-sm">$</span>
                            <span className="text-gold font-display text-3xl">{(pickedItem.price / 2).toFixed(2)}</span>
                          </div>
                          {/* Original price struck through */}
                          <span className="text-brew-600 line-through text-sm">${pickedItem.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => pickRandom(selectedCategory)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-brew-700 rounded-xl text-brew-300 hover:border-brew-600 hover:text-brew-200 transition-all duration-300 text-sm active:scale-95"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-95 ${
                          added
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gold text-brew-950 hover:bg-gold-light'
                        }`}
                      >
                        {added ? (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
