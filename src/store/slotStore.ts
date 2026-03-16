import { create } from 'zustand'
import type { SlotType } from '../types'

export interface SlotState {
  file: File | null
  preview: string | null
  prompt: string
  analyzing: boolean
  error: string | null
}

interface SlotStore {
  slots: Record<SlotType, SlotState>
  setSlot: (type: SlotType, update: Partial<SlotState>) => void
  clearSlot: (type: SlotType) => void
}

const defaultSlot = (): SlotState => ({
  file: null,
  preview: null,
  prompt: '',
  analyzing: false,
  error: null,
})

export const useSlotStore = create<SlotStore>((set) => ({
  slots: {
    subject: defaultSlot(),
    scene: defaultSlot(),
    style: defaultSlot(),
  },
  setSlot: (type, update) =>
    set((state) => ({
      slots: { ...state.slots, [type]: { ...state.slots[type], ...update } },
    })),
  clearSlot: (type) =>
    set((state) => ({
      slots: { ...state.slots, [type]: defaultSlot() },
    })),
}))
