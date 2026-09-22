import { BatteryCharging, Cable, Headphones, House, Laptop, Watch } from 'lucide-react'
import type { Category } from '@/types'

const map = {
  headphones: Headphones,
  watch: Watch,
  'battery-charging': BatteryCharging,
  house: House,
  cable: Cable,
  laptop: Laptop,
} as const

export function CategoryIcon({
  icon,
  className,
}: {
  icon: Category['icon']
  className?: string
}) {
  const Icon = map[icon]
  return <Icon className={className} aria-hidden="true" />
}
