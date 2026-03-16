import { useRef, useState } from 'react'
import { useSlotStore } from '../../store/slotStore'
import { useSlotUpload } from '../../hooks/useSlotUpload'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import type { SlotType } from '../../types'

const SLOT_LABELS: Record<SlotType, string> = {
  subject: 'Subject',
  scene: 'Scene',
  style: 'Style',
}

const SLOT_DESCRIPTIONS: Record<SlotType, string> = {
  subject: 'Main character or object',
  scene: 'Background / environment',
  style: 'Artistic style & mood',
}

interface Props {
  type: SlotType
}

export function SlotCard({ type }: Props) {
  const slot = useSlotStore((s) => s.slots[type])
  const setSlot = useSlotStore((s) => s.setSlot)
  const { upload, clearSlot } = useSlotUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputMode, setInputMode] = useState<'image' | 'text'>('text')

  const handleFile = (file: File) => upload(type, file)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  const hasContent = slot.file || slot.prompt

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between border-b-2 border-black pb-3">
        <div>
          <h3 className="font-mono font-bold text-black uppercase tracking-widest text-base">{SLOT_LABELS[type]}</h3>
          <p className="text-sm text-black/50 font-mono mt-0.5">{SLOT_DESCRIPTIONS[type]}</p>
        </div>
        <div className="flex items-center gap-3 ml-2 shrink-0">
          <div className="flex border-2 border-black">
            <button
              onClick={() => setInputMode('image')}
              className={`px-3 py-1 text-xs font-mono font-bold transition-all uppercase tracking-widest ${
                inputMode === 'image' ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white'
              }`}
            >
              이미지
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-3 py-1 text-xs font-mono font-bold transition-all uppercase tracking-widest ${
                inputMode === 'text' ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white'
              }`}
            >
              텍스트
            </button>
          </div>
          {hasContent && (
            <button
              onClick={() => clearSlot(type)}
              className="text-black/40 hover:text-black text-xs transition-colors font-mono uppercase tracking-widest font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {inputMode === 'image' ? (
        <>
          <div
            className="relative aspect-square border-2 border-dashed border-black transition-all cursor-pointer overflow-hidden hover:border-black"
            onClick={() => !slot.preview && inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {slot.preview ? (
              <>
                <img src={slot.preview} alt={type} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                >
                  <span className="text-white text-sm font-mono uppercase tracking-widest border-2 border-white px-4 py-2 font-bold">Change</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
                <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
                  <svg className="w-6 h-6 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-black/50 text-sm text-center font-mono font-bold">Drop image or click to upload</span>
              </div>
            )}
            {slot.analyzing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center gap-3">
                <LoadingSpinner size="sm" />
                <span className="text-black text-sm font-mono uppercase tracking-widest font-bold">Analyzing...</span>
              </div>
            )}
          </div>
          {slot.prompt && <p className="text-sm text-black/60 italic line-clamp-3 font-mono">{slot.prompt}</p>}
          {slot.error && <p className="text-sm text-black font-mono font-bold">{slot.error}</p>}
        </>
      ) : (
        <textarea
          value={slot.prompt}
          onChange={(e) => setSlot(type, { prompt: e.target.value })}
          placeholder={`${SLOT_DESCRIPTIONS[type]}를 텍스트로 입력하세요`}
          rows={5}
          className="w-full bg-white text-black border-2 border-black px-4 py-3 text-sm font-mono
            focus:outline-none resize-none placeholder:text-black/30 transition-colors"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
