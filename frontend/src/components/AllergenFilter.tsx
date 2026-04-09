'use client'

const allergens = [
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'gluten', label: 'Gluten', icon: '🌾' },
  { value: 'nuts', label: 'Nuts', icon: '🥜' },
  { value: 'soy', label: 'Soy', icon: '🫘' },
  { value: 'eggs', label: 'Eggs', icon: '🥚' },
]

interface Props {
  excluded: string[]
  onToggle: (allergen: string) => void
}

export default function AllergenFilter({ excluded, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-brew-500 text-xs font-medium uppercase tracking-wider self-center mr-1">
        Exclude:
      </span>
      {allergens.map((a) => {
        const active = excluded.includes(a.value)
        return (
          <button
            key={a.value}
            onClick={() => onToggle(a.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
              active
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'bg-brew-900 text-brew-500 border border-brew-800 hover:border-brew-700 hover:text-brew-300'
            }`}
          >
            <span>{a.icon}</span>
            {a.label}
          </button>
        )
      })}
    </div>
  )
}
