import { useState } from 'react'
import { Navbar } from './components/shared/Navbar'
import { SlotGrid } from './components/slots/SlotGrid'
import { StylePresets } from './components/styles/StylePresets'
import { GenerateButton } from './components/generate/GenerateButton'
import { ResultViewer } from './components/generate/ResultViewer'
import { BatchPanel } from './components/batch/BatchPanel'
import { BatchQueue } from './components/batch/BatchQueue'
import { ErrorToast } from './components/shared/ErrorToast'
import { useGenerateStore } from './store/generateStore'
import { useBatchStore } from './store/batchStore'
import type { AspectRatio } from './types'

const RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4']

export default function App() {
  const [mode, setMode] = useState<'single' | 'batch'>('single')
  const { selectedRatio, setRatio } = useGenerateStore()
  const { jobs } = useBatchStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar mode={mode} onModeChange={setMode} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {mode === 'single' ? (
          <div className="grid grid-cols-5 gap-6">
            {/* Left panel */}
            <div className="col-span-3 space-y-5">
              <section>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">입력 슬롯</h2>
                <SlotGrid />
              </section>

              <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">스타일 프리셋</h2>
                <StylePresets />
              </section>

              <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">화면 비율</h2>
                <div className="flex gap-2">
                  {RATIOS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRatio(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedRatio === r
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </section>

              <GenerateButton />
            </div>

            {/* Right panel */}
            <div className="col-span-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">결과</h2>
              <ResultViewer />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-2">
              <BatchPanel />
            </div>
            <div className="col-span-3">
              {jobs.length > 0 ? (
                <BatchQueue />
              ) : (
                <div className="h-64 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                  <p className="text-sm text-gray-400">배치 작업이 여기에 표시됩니다</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <ErrorToast />
    </div>
  )
}
