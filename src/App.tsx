import { useState } from 'react'
import { SlotGrid } from './components/slots/SlotGrid'
import { StylePresets } from './components/styles/StylePresets'
import { GenerateButton } from './components/generate/GenerateButton'
import { ResultViewer } from './components/generate/ResultViewer'
import { BatchPanel } from './components/batch/BatchPanel'
import { useGenerateStore } from './store/generateStore'
import { ErrorToast } from './components/shared/ErrorToast'

type Mode = 'single' | 'batch'

export default function App() {
  const [mode, setMode] = useState<Mode>('single')
  const { error, setError } = useGenerateStore()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <h1 className="text-lg font-bold text-white">Whisk Clone</h1>
        </div>
        {/* Mode Toggle */}
        <div className="flex items-center bg-white/10 rounded-lg p-1">
          {(['single', 'batch'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize
                ${mode === m ? 'bg-white text-gray-900' : 'text-white/60 hover:text-white'}`}
            >
              {m === 'single' ? 'Single' : 'Batch'}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Image Slots */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
            Compose Your Image
          </h2>
          <SlotGrid />
        </section>

        {/* Style Presets */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-4">
            Style Preset
          </h2>
          <StylePresets />
        </section>

        {/* Generate / Batch */}
        {mode === 'single' ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <GenerateButton />
              <p className="text-white/30 text-xs text-center">
                Powered by FLUX.1-schnell via together.ai
              </p>
            </div>
            <ResultViewer />
          </div>
        ) : (
          <BatchPanel />
        )}
      </main>

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  )
}
