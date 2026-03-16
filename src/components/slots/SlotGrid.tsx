import { SlotCard } from './SlotCard'
import type { SlotType } from '../../types'

const SLOT_TYPES: SlotType[] = ['subject', 'scene', 'style']

export function SlotGrid() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {SLOT_TYPES.map((type) => (
        <SlotCard key={type} type={type} />
      ))}
    </div>
  )
}
