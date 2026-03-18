import { useState } from 'react'
import { ListPlus, Repeat, Play, AlertCircle, Minus, Plus } from 'lucide-react'
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

interface StepperProps {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}

function Stepper({ value, min, max, onChange }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-gray-900 tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  )
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
  const jobCount = mode === 'direct' ? directPromptCount : count
  const charCount = promptText.length
  const lineCount = promptText.split('\n').filter((l) => l.trim()).length

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-1">배치 생성</h2>
        <p className="text-xs text-gray-400 mb-3">여러 이미지를 한 번에 생성합니다</p>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('direct')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              mode === 'direct'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            직접 입력
          </button>
          <button
            onClick={() => setMode('slot')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              mode === 'slot'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <Repeat className="w-4 h-4" />
            슬롯 반복
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {mode === 'direct' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-600">프롬프트 목록</label>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{charCount}자</span>
              {lineCount > 0 && (
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{lineCount}줄</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400">줄바꿈으로 구분, 앞 숫자는 무시됩니다</p>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={`001 Medium shot, a Korean boy...\n003 Wide shot, bright full moon...\n005 Close up, servant face...`}
            rows={8}
            className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none placeholder-gray-300 leading-relaxed"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">변형 수</label>
            <p className="text-xs text-gray-400 mb-3">현재 슬롯 설정으로 N번 생성합니다</p>
            <Stepper value={count} min={1} max={20} onChange={setCount} />
          </div>
        </div>
      )}

      <div className="h-px bg-gray-100" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600">동시 생성 수</p>
            <p className="text-xs text-gray-400 mt-0.5">최대 5개까지 동시 실행</p>
          </div>
          <Stepper value={concurrency} min={1} max={5} onChange={setConcurrency} />
        </div>
      </div>

      {jobCount > 0 && (
        <div className="bg-indigo-50 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-600">총 생성 예정</span>
          <span className="text-sm font-bold text-indigo-700">{jobCount}개 이미지</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-3 py-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={submitBatch}
        disabled={loading || (mode === 'direct' && directPromptCount === 0)}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-sm"
      >
        <Play className="w-4 h-4" />
        {loading
          ? '시작 중...'
          : jobCount > 0
            ? `${jobCount}개 이미지 생성 시작`
            : '배치 실행'}
      </button>
    </div>
  )
}
