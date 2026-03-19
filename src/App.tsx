import { useState } from 'react'
import { Navbar } from './components/shared/Navbar'
import { SlotGrid } from './components/slots/SlotGrid'
import { StylePresets } from './components/styles/StylePresets'
import { GenerateButton } from './components/generate/GenerateButton'
import { ResultViewer } from './components/generate/ResultViewer'
import { BatchPanel } from './components/batch/BatchPanel'
import { BatchQueue } from './components/batch/BatchQueue'
import { GalleryPanel } from './components/gallery/GalleryPanel'
import { ToastContainer } from './components/shared/Toast'
import { useGenerateStore } from './store/generateStore'
import { useBatchStore } from './store/batchStore'
import { Layers } from 'lucide-react'
import type { AspectRatio } from './types'

const RATIOS: { value: AspectRatio; label: string; desc: string }[] = [
  { value: '1:1', label: '1:1', desc: '정사각형' },
  { value: '16:9', label: '16:9', desc: '와이드' },
  { value: '9:16', label: '9:16', desc: '세로' },
  { value: '4:3', label: '4:3', desc: '일반' },
  { value: '3:4', label: '3:4', desc: '세로형' },
]

function SectionLabel({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-5 h-5 rounded-md bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-violet-400">{step}</span>
      </div>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<'single' | 'batch' | 'gallery'>('single')
  const { selectedRatio, setRatio } = useGenerateStore()
  const { jobs } = useBatchStore()

  const ratioButtons = (
    <div className="flex flex-wrap gap-1.5">
      {RATIOS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setRatio(value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            selectedRatio === value
              ? 'bg-violet-600/20 text-violet-300 border-violet-500/50 shadow-sm shadow-violet-900/20'
              : 'bg-transparent text-slate-500 border-white/[0.08] hover:border-white/[0.18] hover:text-slate-300 hover:bg-white/[0.03]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0c0c0f]">
      <Navbar mode={mode} onModeChange={setMode} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {mode === 'single' && (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6">
            {/* Left: input flow */}
            <div className="space-y-5">
              <div>
                <SectionLabel step={1} label="슬롯 설정" />
                <SlotGrid />
              </div>

              {/* Controls: style + ratio */}
              <div>
                <SectionLabel step={2} label="스타일 · 비율" />
                <div className="bg-[#141418] rounded-2xl border border-white/[0.07] divide-y divide-white/[0.05]">
                  <div className="p-4">
                    <p className="text-xs text-slate-600 mb-3">스타일 프리셋 (선택사항)</p>
                    <StylePresets />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-600 mb-3">이미지 비율</p>
                    {ratioButtons}
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel step={3} label="생성" />
                <GenerateButton />
              </div>
            </div>

            {/* Right: result — sticky */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ResultViewer />
            </div>
          </div>
        )}

        {mode === 'batch' && (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Left: slots + controls + queue */}
            <div className="space-y-5">
              <div>
                <SectionLabel step={1} label="슬롯 설정" />
                <SlotGrid />
              </div>

              <div>
                <SectionLabel step={2} label="스타일 · 비율" />
                <div className="bg-[#141418] rounded-2xl border border-white/[0.07] divide-y divide-white/[0.05]">
                  <div className="p-4">
                    <p className="text-xs text-slate-600 mb-3">스타일 프리셋 (선택사항)</p>
                    <StylePresets />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-600 mb-3">이미지 비율</p>
                    {ratioButtons}
                  </div>
                </div>
              </div>

              <div>
                <SectionLabel step={3} label="배치 결과" />
                {jobs.length > 0 ? (
                  <BatchQueue />
                ) : (
                  <div className="h-40 rounded-2xl bg-[#141418] border border-white/[0.07] flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0f0f13] border border-white/[0.06] flex items-center justify-center">
                      <Layers className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-500">배치 작업 결과가 여기에 표시됩니다</p>
                      <p className="text-xs text-slate-600 mt-0.5">우측 패널에서 배치를 시작하세요</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: batch config — sticky */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <BatchPanel />
            </div>
          </div>
        )}

        {mode === 'gallery' && (
          <GalleryPanel />
        )}
      </main>

      <ToastContainer />
    </div>
  )
}
