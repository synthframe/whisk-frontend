import { useSlotStore } from '../store/slotStore'
import { analyzeImage } from '../api/vision'
import type { SlotType } from '../types'

export function useSlotUpload() {
  const setSlot = useSlotStore((s) => s.setSlot)
  const clearSlot = useSlotStore((s) => s.clearSlot)

  const upload = async (type: SlotType, file: File) => {
    const preview = URL.createObjectURL(file)
    setSlot(type, { file, preview, analyzing: true, error: null, prompt: '' })

    try {
      const res = await analyzeImage(file, type)
      setSlot(type, { prompt: res.prompt, analyzing: false })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Analysis failed'
      setSlot(type, { analyzing: false, error: msg })
    }
  }

  return { upload, clearSlot }
}
