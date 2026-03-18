import { useRef } from 'react'
import { Upload, Type, X, ImageIcon } from 'lucide-react'
import type { SlotType } from '../../types'
import { useSlotStore } from '../../store/slotStore'
import { useSlotUpload } from '../../hooks/useSlotUpload'

const SLOT_LABELS: Record<SlotType, string> = {
  subject: '주제',
  scene: '배경',
  style: '스타일',
}

const SLOT_DESC: Record<SlotType, string> = {
  subject: '인물, 동물, 사물',
  scene: '장소, 배경, 환경',
  style: '화풍, 색감, 조명',
}

interface Props {
  type: SlotType
  inputMode: 'image' | 'text'
  onModeChange: (mode: 'image' | 'text') => void
}

export function SlotCard({ type, inputMode, onModeChange }: Props) {
  const slot = useSlotStore((s) => s.slots[type])
  const { upload, clearSlot } = useSlotUpload()
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    if (file.type.startsWith('image/')) upload(type, file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <div>
          <p className="text-sm font-semibold text-gray-900">{SLOT_LABELS[type]}</p>
          <p className="text-xs text-gray-400">{SLOT_DESC[type]}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onModeChange('image')}
            className={`p-1.5 rounded-lg transition-colors ${inputMode === 'image' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onModeChange('text')}
            className={`p-1.5 rounded-lg transition-colors ${inputMode === 'text' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3">
        {inputMode === 'image' ? (
          <div
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer group"
            onClick={() => !slot.preview && fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {slot.preview ? (
              <>
                <img src={slot.preview} alt="" className="w-full h-full object-cover" />

                {/* Skeleton analyzing overlay */}
                {slot.analyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    {/* Pulsing skeleton stripes */}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="relative z-10 flex flex-col items-center gap-2 w-3/4">
                      <div className="w-full h-2 rounded-full bg-white/30 animate-pulse" />
                      <div className="w-4/5 h-2 rounded-full bg-white/30 animate-pulse delay-75" />
                      <div className="w-3/5 h-2 rounded-full bg-white/30 animate-pulse delay-150" />
                      <p className="text-xs text-white/80 mt-1 font-medium">분석 중...</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); clearSlot(type) }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors z-20"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <Upload className="w-6 h-6 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                <p className="text-xs text-gray-400">이미지 업로드</p>
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={slot.prompt}
            onChange={(e) => useSlotStore.getState().setSlot(type, { prompt: e.target.value })}
            placeholder={`${SLOT_LABELS[type]} 설명...`}
            className="w-full aspect-square resize-none rounded-lg bg-gray-50 border border-gray-200 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300"
          />
        )}

        {slot.prompt && inputMode === 'image' && (
          <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">{slot.prompt}</p>
        )}
        {slot.error && <p className="mt-2 text-xs text-red-500">{slot.error}</p>}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  )
}
