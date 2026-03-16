import { useGenerateStore } from '../../store/generateStore'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { outputBaseURL } from '../../api/client'

export function ResultViewer() {
  const { generating, resultImageUrl, error } = useGenerateStore()

  if (!generating && !resultImageUrl && !error) {
    return (
      <div className="aspect-square border-2 border-dashed border-black flex items-center justify-center">
        <p className="text-black/40 text-sm font-mono uppercase tracking-widest">Generated image will appear here</p>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="aspect-square border-2 border-dashed border-black flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-black/60 text-sm font-mono uppercase tracking-widest">Creating your image...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-square border-2 border-dashed border-black flex items-center justify-center p-6">
        <p className="text-black text-sm text-center font-mono">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden aspect-square border-2 border-black">
      <img src={`${outputBaseURL}${resultImageUrl}`} alt="Generated" className="w-full h-full object-cover" />
      <a
        href={`${outputBaseURL}${resultImageUrl}`}
        download
        className="absolute bottom-3 right-3 border-2 border-black bg-white text-black text-xs px-4 py-2 font-mono uppercase tracking-widest transition-all hover:bg-black hover:text-white font-bold"
      >
        Download
      </a>
    </div>
  )
}
