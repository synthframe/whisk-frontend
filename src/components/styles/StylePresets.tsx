import { useGenerateStore } from '../../store/generateStore'
import type { StylePreset } from '../../types'

const PRESETS: { value: StylePreset; label: string; emoji: string }[] = [
  { value: 'photorealistic', label: 'Photo', emoji: '📷' },
  { value: 'cinematic', label: 'Cinematic', emoji: '🎬' },
  { value: 'anime', label: 'Anime', emoji: '⛩️' },
  { value: 'oil_painting', label: 'Oil Paint', emoji: '🎨' },
  { value: 'watercolor', label: 'Watercolor', emoji: '🌊' },
  { value: 'pixel_art', label: 'Pixel Art', emoji: '👾' },
  { value: 'sketched', label: 'Sketch', emoji: '✏️' },
  { value: 'pixar_3d', label: 'Pixar 3D', emoji: '🎭' },
]

export function StylePresets() {
  const { selectedPreset, setPreset } = useGenerateStore()
  return (
    <div className="flex flex-wrap gap-1.5">
      {PRESETS.map(({ value, label, emoji }) => (
        <button
          key={value}
          onClick={() => setPreset(selectedPreset === value ? '' : value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            selectedPreset === value
              ? 'bg-violet-600/25 text-violet-200 border-violet-500/60 shadow-sm shadow-violet-900/30'
              : 'bg-transparent text-slate-500 border-white/[0.08] hover:border-white/[0.18] hover:text-slate-300 hover:bg-white/[0.03]'
          }`}
        >
          <span className="text-sm leading-none">{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  )
}
