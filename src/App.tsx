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
import { Layers, PenLine } from 'lucide-react'
import type { AspectRatio } from './types'

const RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4']

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
  const { selectedRatio, setRatio, mainPrompt, setMainPrompt } = useGenerateStore()
  const { jobs } = useBatchStore()

  const ratioButtons = (
    <div className="flex flex-wrap gap-2">
      {RATIOS.map((r) => (
        <button
          key={r}
          onClick={() => setRatio(r)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            selectedRatio === r
              ? 'bg-violet-600/20 text-violet-300 border-violet-500/50 shadow-sm shadow-violet-900/20'
              : 'bg-transparent text-slate-500 border-white/[0.08] hover:border-white/[0.18] hover:text-slate-300 hover:bg-white/[0.03]'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  )

  const styleRatioCard = (
    <div className="bg-[#141418] rounded-2xl border border-white/[0.07] overflow-hidden">
      <div className="p-5 border-b border-white/[0.05]">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">스타일 프리셋</p>
        <StylePresets />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">이미지 비율</p>
        {ratioButtons}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0c0c0f]">
      <Navbar mode={mode} onModeChange={setMode} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {mode === 'single' && (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] gap-7">
            {/* Left: input flow */}
            <div className="space-y-6">

              {/* 1. 프롬프트 직접 입력 */}
              <div>
                <SectionLabel step={1} label="프롬프트" />
                <div className="bg-[#141418] rounded-2xl border border-white/[0.07] overflow-hidden hover:border-white/[0.12] transition-colors">
                  <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.05]">
                    <PenLine className="w-4 h-4 text-slate-500" />
                    <p className="text-sm font-semibold text-slate-300">이미지 설명</p>
                    <span className="ml-auto text-xs text-slate-700">선택사항 · 아래 슬롯과 조합됩니다</span>
                  </div>
                  <div className="relative p-3">
                    <textarea
                      value={mainPrompt}
                      onChange={(e) => setMainPrompt(e.target.value)}
                      placeholder="원하는 이미지를 자유롭게 설명하세요&#10;예: a cinematic close-up of a Korean girl in a rainy city street, neon lights reflecting on wet pavement..."
                      className="w-full h-32 resize-none bg-transparent text-sm text-slate-200 placeholder-slate-700 focus:outline-none leading-relaxed p-2"
                    />
                    {mainPrompt.length > 0 && (
                      <div className="absolute bottom-4 right-5 flex items-center gap-2">
                        <span className={`text-[10px] tabular-nums ${mainPrompt.length > 500 ? 'text-amber-500' : 'text-slate-700'}`}>
                          {mainPrompt.length}자
                        </span>
                        <button
                          onClick={() => setMainPrompt('')}
                          className="text-[10px] text-slate-700 hover:text-slate-400 transition-colors px-1.5 py-0.5 rounded border border-white/[0.06] hover:border-white/[0.12]"
                        >
                          지우기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. 슬롯 설정 */}
              <div>
                <SectionLabel step={2} label="슬롯 설정" />
                <SlotGrid />
              </div>

              {/* 3. 스타일 · 비율 */}
              <div>
                <SectionLabel step={3} label="스타일 · 비율" />
                {styleRatioCard}
              </div>

              {/* 4. 생성 */}
              <div>
                <SectionLabel step={4} label="생성" />
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
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-7">
            {/* Left: slots + controls + queue */}
            <div className="space-y-6">
              <div>
                <SectionLabel step={1} label="슬롯 설정" />
                <SlotGrid />
              </div>

              <div>
                <SectionLabel step={2} label="스타일 · 비율" />
                {styleRatioCard}
              </div>

              <div>
                <SectionLabel step={3} label="배치 결과" />
                {jobs.length > 0 ? (
                  <BatchQueue />
                ) : (
                  <div className="h-44 rounded-2xl bg-[#141418] border border-white/[0.07] flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0f0f13] border border-white/[0.06] flex items-center justify-center">
                      <Layers className="w-6 h-6 text-slate-700" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-500">배치 결과가 여기에 표시됩니다</p>
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
