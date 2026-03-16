import { useGenerateStore } from '../../store/generateStore'
import type { StylePreset } from '../../types'

const PRESETS: { value: StylePreset; label: string; emoji: string }[] = [
  { value: 'photorealistic', label: 'Photo', emoji: '📷' },
  { value: 'cinematic', label: 'Cinematic', emoji: '🎬' },
  { value: 'anime', label: 'Anime', emoji: '🌸' },
  { value: 'oil_painting', label: 'Oil Paint', emoji: '🎨' },
  { value: 'watercolor', label: 'Watercolor', emoji: '💧' },
  { value: 'pixel_art', label: 'Pixel Art', emoji: '👾' },
  { value: 'sketched', label: 'Sketch', emoji: '✏️' },
]

export function StylePresets() {
  const { selectedPreset, setPreset } = useGenerateStore()

  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.value}
          onClick={() => setPreset(selectedPreset === p.value ? '' : p.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${selectedPreset === p.value
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
              : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
        >
          {p.emoji} {p.label}
        </button>
      ))}
    </div>
  )
}
