import type { BatchJobResult } from '../../types'
import { outputBaseURL } from '../../api/client'

interface Props {
  job: BatchJobResult
  index: number
}

export function BatchJobRow({ job, index }: Props) {
  const status = job.status || 'pending'

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
      <span className="text-white/40 text-xs w-6 text-right font-mono">{index + 1}</span>
      <StatusBadge status={status} />
      {job.image_url ? (
        <a href={`${outputBaseURL}${job.image_url}`} target="_blank" rel="noopener noreferrer">
          <img src={`${outputBaseURL}${job.image_url}`} alt={`job-${index}`} className="w-10 h-10 object-cover border border-white/20" />
        </a>
      ) : (
        <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
          <span className="text-white/20 text-xs font-mono">-</span>
        </div>
      )}
      {job.error && <p className="text-white/50 text-xs flex-1 truncate font-mono">{job.error}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'completed'
      ? 'border-white/40 text-white'
      : status === 'failed'
      ? 'border-white/20 text-white/40'
      : 'border-white/10 text-white/30'

  return (
    <span className={`text-xs px-2 py-0.5 border font-mono uppercase tracking-widest whitespace-nowrap ${cls}`}>
      {status}
    </span>
  )
}
