import { create } from 'zustand'
import type { StylePreset } from '../types'

interface GenerateStore {
  selectedPreset: StylePreset | ''
  generating: boolean
  resultImageUrl: string | null
  jobId: string | null
  error: string | null
  setPreset: (preset: StylePreset | '') => void
  setGenerating: (v: boolean) => void
  setResult: (url: string | null) => void
  setJobId: (id: string | null) => void
  setError: (e: string | null) => void
}

export const useGenerateStore = create<GenerateStore>((set) => ({
  selectedPreset: 'photorealistic',
  generating: false,
  resultImageUrl: null,
  jobId: null,
  error: null,
  setPreset: (preset) => set({ selectedPreset: preset }),
  setGenerating: (v) => set({ generating: v }),
  setResult: (url) => set({ resultImageUrl: url }),
  setJobId: (id) => set({ jobId: id }),
  setError: (e) => set({ error: e }),
}))
