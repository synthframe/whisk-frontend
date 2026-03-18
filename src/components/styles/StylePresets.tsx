import { useGenerateStore } from '../../store/generateStore'
import type { StylePreset } from '../../types'

const PRESETS: { value: StylePreset; label: string }[] = [
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'anime', label: 'Anime' },
  { value: 'oil_painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'pixel_art', label: 'Pixel Art' },
  { value: 'sketched', label: 'Sketched' },
  { value: 'pixar_3d', label: 'Pixar 3D' },
]

export function StylePresets() {
  const { selectedPreset, setPreset } = useGenerateStore()

  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setPreset(selectedPreset === value ? '' : value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
            selectedPreset === value
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
