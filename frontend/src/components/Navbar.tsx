'use client'

import Link from 'next/link'
import { ShoppingCart, User, Coffee } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function Navbar() {
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))

  return (
    <nav className="sticky top-0 z-50 glass animate-slide-down">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-all duration-300">
            <Coffee className="w-5 h-5 text-gold" />
          </div>
          <span className="font-display text-xl text-brew-50 tracking-wide">
            CafeBrew
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            className="relative p-3 rounded-xl text-brew-400 hover:text-gold hover:bg-brew-800/50 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-gold text-brew-950 text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="p-3 rounded-xl text-brew-400 hover:text-gold hover:bg-brew-800/50 transition-all duration-300"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
