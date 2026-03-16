import { useBatchStore } from '../../store/batchStore'
import { useBatchSSE } from '../../hooks/useBatchSSE'
import { BatchProgress } from './BatchProgress'
import { BatchJobRow } from './BatchJobRow'

interface Props {
  batchId: string
}

function BatchQueueItem({ batchId }: Props) {
  useBatchSSE(batchId)
  const job = useBatchStore((s) => s.jobs.find((j) => j.batchId === batchId))
  if (!job) return null

  const completed = job.results.filter((r) => r.status === 'completed').length
  const failed = job.results.filter((r) => r.status === 'failed').length

  return (
    <div className="border border-white/20 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="text-xs text-white/40 font-mono tracking-widest">{batchId.slice(0, 8)}...</span>
        <span className={`text-xs px-2 py-0.5 border font-mono uppercase tracking-widest ${
          job.status === 'completed' ? 'border-white/40 text-white' : 'border-white/20 text-white/50'
        }`}>
          {job.status}
        </span>
      </div>
      <BatchProgress completed={completed} failed={failed} total={job.total} />
      <div>
        {job.results.map((result, i) => (
          <BatchJobRow key={i} job={result} index={i} />
        ))}
      </div>
    </div>
  )
}

export function BatchQueue() {
  const jobs = useBatchStore((s) => s.jobs)

  if (jobs.length === 0) {
    return <p className="text-white/30 text-xs text-center py-8 font-mono uppercase tracking-widest">No batch jobs yet</p>
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {jobs.map((j) => (
        <BatchQueueItem key={j.batchId} batchId={j.batchId} />
      ))}
    </div>
  )
}
