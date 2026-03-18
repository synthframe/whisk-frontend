import { Download } from 'lucide-react'
import { useGenerateStore } from '../../store/generateStore'
import { outputBaseURL } from '../../api/client'

async function downloadImage(imageUrl: string, filename: string) {
  const res = await fetch(`${outputBaseURL}${imageUrl}`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function ResultViewer() {
  const { generating, resultImageUrl, resultTs, error } = useGenerateStore()

  if (!generating && !resultImageUrl && !error) {
    return (
      <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">생성된 이미지가 여기에 표시됩니다</p>
      </div>
    )
  }

  if (generating) {
    return (
      <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm text-indigo-600 font-medium">이미지 생성 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-square rounded-xl bg-red-50 border border-red-100 flex items-center justify-center p-6">
        <p className="text-sm text-red-500 text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden shadow-md group">
      <img
        src={`${outputBaseURL}${resultImageUrl}?t=${resultTs}`}
        alt="Generated"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      <button
        onClick={() => downloadImage(resultImageUrl!, 'whisk.png')}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 text-xs font-medium px-3 py-2 rounded-lg shadow transition-colors opacity-0 group-hover:opacity-100"
      >
        <Download className="w-3.5 h-3.5" />
        다운로드
      </button>
    </div>
  )
}
