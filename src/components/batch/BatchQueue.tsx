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
    <div className="border-2 border-black p-5 space-y-4">
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <span className="text-sm text-black/50 font-mono tracking-widest font-bold">{batchId.slice(0, 8)}...</span>
        <span className={`text-xs px-3 py-1 border-2 font-mono uppercase tracking-widest font-bold ${
          job.status === 'completed' ? 'bg-black text-white border-black' : 'border-black text-black'
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
    return <p className="text-black/40 text-sm text-center py-10 font-mono uppercase tracking-widest font-bold">No batch jobs yet</p>
  }

  return (
    <div className="space-y-4 max-h-[32rem] overflow-y-auto">
      {jobs.map((j) => (
        <BatchQueueItem key={j.batchId} batchId={j.batchId} />
      ))}
    </div>
  )
}
