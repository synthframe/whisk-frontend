import { useEffect, useState } from 'react'
import { RefreshCw, Download, GalleryHorizontal, ExternalLink } from 'lucide-react'
import { getImages } from '../../api/images'
import type { ImageHistoryItem } from '../../api/images'
import { outputBaseURL } from '../../api/client'

function SkeletonCard() {
  return (
    <div className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
  )
}

async function downloadImage(url: string, filename: string) {
  const res = await fetch(`${outputBaseURL}${url}`)
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export function GalleryPanel() {
  const [images, setImages] = useState<ImageHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const fetchImages = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getImages()
      setImages(data)
    } catch {
      setError('이미지를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleDownload = async (item: ImageHistoryItem) => {
    setDownloadingId(item.id)
    try {
      await downloadImage(item.url, `whisk_${item.id.slice(0, 8)}.png`)
    } catch {
      // ignore
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">이미지 갤러리</h2>
          <p className="text-xs text-gray-400 mt-0.5">내가 생성한 이미지 목록</p>
        </div>
        <button
          onClick={fetchImages}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <GalleryHorizontal className="w-8 h-8 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">아직 생성된 이미지가 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">이미지를 생성하면 여기에 표시됩니다</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400">{images.length}개의 이미지</p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                <img
                  src={`${outputBaseURL}${item.url}`}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`${outputBaseURL}${item.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 bg-white/90 hover:bg-white text-gray-800 text-xs font-medium py-1.5 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      열기
                    </a>
                    <button
                      onClick={() => handleDownload(item)}
                      disabled={downloadingId === item.id}
                      className="flex-1 flex items-center justify-center gap-1 bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-medium py-1.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      <Download className="w-3 h-3" />
                      {downloadingId === item.id ? '...' : '저장'}
                    </button>
                  </div>
                </div>

                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white/80 bg-black/40 px-1.5 py-0.5 rounded-md">
                    {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
