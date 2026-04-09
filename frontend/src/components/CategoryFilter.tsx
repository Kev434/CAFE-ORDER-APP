'use client'

const categories = [
  { value: '', label: 'All', icon: '✦' },
  { value: 'coffee', label: 'Coffee', icon: '☕' },
  { value: 'espresso', label: 'Espresso', icon: '⚡' },
  { value: 'tea', label: 'Tea', icon: '🍵' },
  { value: 'pastry', label: 'Pastry', icon: '🥐' },
]

interface Props {
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
            selected === cat.value
              ? 'bg-gold/15 text-gold border border-gold/30 gold-glow'
              : 'bg-brew-900 text-brew-400 border border-brew-800 hover:border-brew-700 hover:text-brew-200'
          }`}
        >
          <span className="text-base">{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  )
}
