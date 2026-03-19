import { useRef } from 'react'
import { Upload, Type, X, Loader2, Image as ImageIcon } from 'lucide-react'
import type { SlotType } from '../../types'
import { useSlotStore } from '../../store/slotStore'
import { useSlotUpload } from '../../hooks/useSlotUpload'

const SLOT_CONFIG = {
  subject: {
    label: '주제',
    desc: '인물 · 사물 · 동물',
    color: 'from-blue-600/20 to-cyan-600/20',
    dot: 'bg-blue-500',
    ring: 'focus:border-blue-500/50',
    placeholder: 'e.g. a Korean boy, close up portrait, detailed eyes...',
  },
  scene: {
    label: '배경',
    desc: '장소 · 환경 · 공간',
    color: 'from-emerald-600/20 to-teal-600/20',
    dot: 'bg-emerald-500',
    ring: 'focus:border-emerald-500/50',
    placeholder: 'e.g. night sky, bright full moon, ancient forest...',
  },
  style: {
    label: '스타일',
    desc: '화풍 · 색감 · 조명',
    color: 'from-violet-600/20 to-purple-600/20',
    dot: 'bg-violet-500',
    ring: 'focus:border-violet-500/50',
    placeholder: 'e.g. cinematic lighting, film grain, dramatic shadows...',
  },
}

interface Props {
  type: SlotType
  inputMode: 'image' | 'text'
  onModeChange: (mode: 'image' | 'text') => void
}

export function SlotCard({ type, inputMode, onModeChange }: Props) {
  const slot = useSlotStore(s => s.slots[type])
  const { upload, clearSlot } = useSlotUpload()
  const fileRef = useRef<HTMLInputElement>(null)
  const cfg = SLOT_CONFIG[type]

  function handleFile(file: File) {
    if (file.type.startsWith('image/')) upload(type, file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const hasContent = slot.prompt.trim().length > 0 || !!slot.preview

  return (
    <div className={`rounded-2xl bg-[#141418] border transition-all duration-200 ${
      hasContent ? 'border-white/[0.12]' : 'border-white/[0.07] hover:border-white/[0.12]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <p className="text-sm font-semibold text-slate-100">{cfg.label}</p>
          <p className="text-xs text-slate-600 hidden lg:block">{cfg.desc}</p>
        </div>
        <div className="flex bg-[#0c0c0f] rounded-lg p-0.5 gap-px">
          <button
            onClick={() => onModeChange('image')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              inputMode === 'image'
                ? 'bg-white/[0.08] text-slate-200'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>이미지</span>
          </button>
          <button
            onClick={() => onModeChange('text')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              inputMode === 'text'
                ? 'bg-white/[0.08] text-slate-200'
                : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <Type className="w-3 h-3" />
            <span>텍스트</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {inputMode === 'image' ? (
          <div className="space-y-2">
            <div
              className="relative h-28 rounded-xl overflow-hidden bg-[#0f0f13] border border-white/[0.06] hover:border-violet-500/30 transition-all cursor-pointer"
              onClick={() => !slot.preview && fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {slot.preview ? (
                <>
                  <img src={slot.preview} alt="" className="w-full h-full object-cover" />
                  {slot.analyzing && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                      <p className="text-xs text-slate-300">이미지 분석 중...</p>
                    </div>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); clearSlot(type) }}
                    className="absolute top-2 right-2 w-5 h-5 bg-black/80 hover:bg-black rounded-full flex items-center justify-center transition-colors border border-white/[0.1]"
                  >
                    <X className="w-2.5 h-2.5 text-white" />
                  </button>
                  {!slot.analyzing && slot.prompt && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent" />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 group/upload">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center transition-transform group-hover/upload:scale-105`}>
                    <Upload className="w-4 h-4 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-600">드래그하거나 클릭하여 업로드</p>
                </div>
              )}
            </div>

            {slot.preview && (
              <div className="relative">
                <textarea
                  value={slot.prompt}
                  onChange={e => useSlotStore.getState().setSlot(type, { prompt: e.target.value })}
                  placeholder="분석된 프롬프트 (수정 가능)..."
                  className={`w-full h-14 resize-none rounded-xl bg-[#0f0f13] border border-white/[0.06] text-xs p-2.5 pr-8 text-slate-300 placeholder-slate-700 focus:outline-none ${cfg.ring} transition-colors leading-relaxed`}
                />
                {slot.prompt && (
                  <button
                    onClick={() => useSlotStore.getState().setSlot(type, { prompt: '' })}
                    className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center text-slate-700 hover:text-slate-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {slot.error && <p className="text-xs text-red-400">{slot.error}</p>}
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={slot.prompt}
              onChange={e => useSlotStore.getState().setSlot(type, { prompt: e.target.value })}
              placeholder={cfg.placeholder}
              className={`w-full h-28 resize-none rounded-xl bg-[#0f0f13] border border-white/[0.06] text-sm p-3 pb-7 text-slate-200 placeholder-slate-600 focus:outline-none ${cfg.ring} transition-colors leading-relaxed`}
            />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] text-slate-700">
                {slot.prompt.length === 0 ? cfg.desc : ''}
              </span>
              <div className="flex items-center gap-2 pointer-events-auto">
                {slot.prompt.length > 0 && (
                  <span className={`text-[10px] tabular-nums ${slot.prompt.length > 300 ? 'text-amber-500' : 'text-slate-700'}`}>
                    {slot.prompt.length}자
                  </span>
                )}
                {slot.prompt.length > 0 && (
                  <button
                    onClick={() => useSlotStore.getState().setSlot(type, { prompt: '' })}
                    className="w-3.5 h-3.5 flex items-center justify-center text-slate-700 hover:text-slate-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}
