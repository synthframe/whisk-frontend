interface Props {
  completed: number
  failed: number
  total: number
}

export function BatchProgress({ completed, failed, total }: Props) {
  const pct = total > 0 ? Math.round(((completed + failed) / total) * 100) : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/50">
        <span>{completed} completed · {failed} failed</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full flex">
          <div
            className="bg-green-500 transition-all duration-300"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-300"
            style={{ width: `${total > 0 ? (failed / total) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}
