import type { BatchJobResult } from '../../types'
import { outputBaseURL } from '../../api/client'

interface Props {
  job: BatchJobResult
  index: number
}

export function BatchJobRow({ job, index }: Props) {
  const status = job.status || 'pending'

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-white/40 text-xs w-6 text-right">{index + 1}</span>
      <StatusBadge status={status} />
      {job.image_url ? (
        <a href={`${outputBaseURL}${job.image_url}`} target="_blank" rel="noopener noreferrer">
          <img src={`${outputBaseURL}${job.image_url}`} alt={`job-${index}`} className="w-10 h-10 rounded object-cover" />
        </a>
      ) : (
        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
          <span className="text-white/20 text-xs">-</span>
        </div>
      )}
      {job.error && <p className="text-red-400 text-xs flex-1 truncate">{job.error}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'completed'
      ? 'bg-green-600/30 text-green-400'
      : status === 'failed'
      ? 'bg-red-600/30 text-red-400'
      : 'bg-white/10 text-white/50'

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${cls} whitespace-nowrap`}>
      {status}
    </span>
  )
}
