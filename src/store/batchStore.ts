import { create } from 'zustand'
import type { BatchJobResult } from '../types'

export interface BatchJob {
  batchId: string
  total: number
  status: string
  results: BatchJobResult[]
  events: string[]
}

interface BatchStore {
  jobs: BatchJob[]
  addJob: (job: BatchJob) => void
  updateJob: (batchId: string, update: Partial<BatchJob>) => void
  appendEvent: (batchId: string, event: string) => void
}

export const useBatchStore = create<BatchStore>((set) => ({
  jobs: [],
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateJob: (batchId, update) =>
    set((state) => ({
      jobs: state.jobs.map((j) => (j.batchId === batchId ? { ...j, ...update } : j)),
    })),
  appendEvent: (batchId, event) =>
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.batchId === batchId ? { ...j, events: [...j.events, event] } : j
      ),
    })),
}))
