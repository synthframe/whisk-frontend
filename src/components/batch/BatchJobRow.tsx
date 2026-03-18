import { ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { BatchJobResult } from '../../types'
import { outputBaseURL } from '../../api/client'

interface Props {
  job: BatchJobResult
  index: number
}

export function BatchJobRow({ job, index }: Props) {
  const status = job.status || 'pending'

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 w-5 text-right font-medium">{index + 1}</span>
      <StatusIcon status={status} />
      {job.image_url ? (
        <a href={`${outputBaseURL}${job.image_url}?t=${Date.now()}`} target="_blank" rel="noopener noreferrer" className="group">
          <img
            src={`${outputBaseURL}${job.image_url}?t=${Date.now()}`}
            alt={`job-${index}`}
            className="w-10 h-10 object-cover rounded-lg border border-gray-100 group-hover:ring-2 group-hover:ring-indigo-300 transition-all"
          />
        </a>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
          <span className="text-gray-300 text-xs">—</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <StatusBadge status={status} />
        {job.error && <p className="text-xs text-gray-400 mt-0.5 truncate">{job.error}</p>}
      </div>
      {job.image_url && (
        <a href={`${outputBaseURL}${job.image_url}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-indigo-500 transition-colors">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
  if (status === 'failed') return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
  return <Clock className="w-4 h-4 text-gray-300 flex-shrink-0 animate-pulse" />
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
    status === 'failed' ? 'bg-red-50 text-red-600' :
    'bg-gray-50 text-gray-400'
  const label =
    status === 'completed' ? '완료' :
    status === 'failed' ? '실패' : '대기 중'

  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md ${cls}`}>
      {label}
    </span>
  )
}
