import { useState } from 'react'
import { ListPlus, Repeat, Play, Settings, AlertCircle } from 'lucide-react'
import { useSlotStore } from '../../store/slotStore'
import { useGenerateStore } from '../../store/generateStore'
import { useBatchStore } from '../../store/batchStore'
import { createBatch } from '../../api/batch'
import { RATIO_DIMENSIONS } from '../../types'
import type { BatchJobInput, BatchJobResult } from '../../types'

type Mode = 'slot' | 'direct'

function parsePrompts(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^\d+\s+/, '').trim())
    .filter((line) => line.length > 0)
}

export function BatchPanel() {
  const slots = useSlotStore((s) => s.slots)
  const selectedPreset = useGenerateStore((s) => s.selectedPreset)
  const selectedRatio = useGenerateStore((s) => s.selectedRatio)
  const addJob = useBatchStore((s) => s.addJob)
  const [mode, setMode] = useState<Mode>('direct')
  const [count, setCount] = useState(3)
  const [concurrency, setConcurrency] = useState(2)
  const [promptText, setPromptText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitBatch = async () => {
    setLoading(true)
    setError(null)
    try {
      let jobs: BatchJobInput[]
      if (mode === 'direct') {
        const prompts = parsePrompts(promptText)
        if (prompts.length === 0) {
          setError('프롬프트를 입력해주세요')
          setLoading(false)
          return
        }
        const { width, height } = RATIO_DIMENSIONS[selectedRatio]
        jobs = prompts.map((p) => ({
          subject_prompt: p,
          scene_prompt: slots.scene.prompt,
          style_prompt: slots.style.prompt,
          style_preset: selectedPreset,
          width,
          height,
        }))
      } else {
        const { width, height } = RATIO_DIMENSIONS[selectedRatio]
        const baseJob: BatchJobInput = {
          subject_prompt: slots.subject.prompt,
          scene_prompt: slots.scene.prompt,
          style_prompt: slots.style.prompt,
          style_preset: selectedPreset,
          width,
          height,
        }
        jobs = Array.from({ length: count }, () => ({ ...baseJob }))
      }
      const res = await createBatch({ jobs, concurrency })
      addJob({
        batchId: res.batch_id,
        total: res.total,
        status: 'running',
        results: Array.from({ length: res.total }, (_, i) => ({ index: i, status: '' } as BatchJobResult)),
        events: [],
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Batch creation failed')
    } finally {
      setLoading(false)
    }
  }

  const directPromptCount = parsePrompts(promptText).length

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">배치 모드</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('direct')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              mode === 'direct'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            직접 입력
          </button>
          <button
            onClick={() => setMode('slot')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
              mode === 'slot'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <Repeat className="w-4 h-4" />
            슬롯 반복
          </button>
        </div>
      </div>

      {mode === 'direct' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500">프롬프트 목록 (줄바꿈으로 구분)</label>
            {directPromptCount > 0 && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{directPromptCount}개</span>
            )}
          </div>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={`001 Medium shot, a Korean boy...\n003 Wide shot, bright full moon...\n005 Close up, servant face...`}
            rows={8}
            className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none placeholder-gray-300"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500 mb-1.5 block">변형 수</span>
            <input
              type="number" min={1} max={20} value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </label>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Settings className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <label className="flex items-center gap-2 flex-1">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">동시 생성</span>
          <input
            type="number" min={1} max={5} value={concurrency}
            onChange={(e) => setConcurrency(Number(e.target.value))}
            className="w-20 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={submitBatch}
        disabled={loading || (mode === 'direct' && directPromptCount === 0)}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
      >
        <Play className="w-4 h-4" />
        {loading ? '시작 중...' : mode === 'direct' ? `${directPromptCount}개 프롬프트 생성` : `${count}개 배치 실행`}
      </button>
    </div>
  )
}
