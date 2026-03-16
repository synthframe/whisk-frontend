import { useGenerateStore } from '../../store/generateStore'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { outputBaseURL } from '../../api/client'

export function ResultViewer() {
  const { generating, resultImageUrl, error } = useGenerateStore()

  if (!generating && !resultImageUrl && !error) {
    return (
      <div className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center">
        <p className="text-white/30 text-sm">Generated image will appear here</p>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-white/50 text-sm">Creating your image...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-square rounded-xl border-2 border-dashed border-red-500/30 flex items-center justify-center p-4">
        <p className="text-red-400 text-sm text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden aspect-square">
      <img src={`${outputBaseURL}${resultImageUrl}`} alt="Generated" className="w-full h-full object-cover" />
      <a
        href={`${outputBaseURL}${resultImageUrl}`}
        download
        className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
      >
        Download
      </a>
    </div>
  )
}
