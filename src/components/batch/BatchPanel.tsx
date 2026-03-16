import { useState } from 'react'
import { useSlotStore } from '../../store/slotStore'
import { useGenerateStore } from '../../store/generateStore'
import { useBatchStore } from '../../store/batchStore'
import { createBatch } from '../../api/batch'
import { BatchQueue } from './BatchQueue'
import type { BatchJobInput, BatchJobResult } from '../../types'

export function BatchPanel() {
  const slots = useSlotStore((s) => s.slots)
  const selectedPreset = useGenerateStore((s) => s.selectedPreset)
  const addJob = useBatchStore((s) => s.addJob)
  const [count, setCount] = useState(3)
  const [concurrency, setConcurrency] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitBatch = async () => {
    setLoading(true)
    setError(null)
    try {
      const baseJob: BatchJobInput = {
        subject_prompt: slots.subject.prompt,
        scene_prompt: slots.scene.prompt,
        style_prompt: slots.style.prompt,
        style_preset: selectedPreset,
      }
      const jobs = Array.from({ length: count }, () => ({ ...baseJob }))
      const res = await createBatch({ jobs, concurrency })
      addJob({
        batchId: res.batch_id,
        total: res.total,
        status: 'running',
        results: Array.from({ length: res.total }, (_, i) => ({
          index: i,
          status: '',
        } as BatchJobResult)),
        events: [],
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Batch creation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-xl p-4 space-y-3">
        <h3 className="text-white font-medium text-sm">Batch Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-white/50 text-xs">Variations</span>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </label>
          <label className="space-y-1">
            <span className="text-white/50 text-xs">Concurrency</span>
            <input
              type="number"
              min={1}
              max={5}
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </label>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          onClick={submitBatch}
          disabled={loading}
          className="w-full py-2 rounded-lg font-medium text-sm text-white transition-all
            bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Starting...' : `Run ${count} Batch Jobs`}
        </button>
      </div>
      <BatchQueue />
    </div>
  )
}
