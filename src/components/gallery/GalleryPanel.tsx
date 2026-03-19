import { useEffect, useState } from 'react'
import { RefreshCw, Download, GalleryHorizontal, ExternalLink, MessageSquare, Sparkles } from 'lucide-react'
import { getImages } from '../../api/images'
import type { ImageHistoryItem } from '../../api/images'
import { outputBaseURL } from '../../api/client'
import { ImageChatPanel } from './ImageChatPanel'

function SkeletonCard() {
  return (
    <div className="space-y-2">
      <div className="aspect-square rounded-xl skeleton" />
      <div className="h-3 w-3/4 rounded skeleton" />
      <div className="h-3 w-1/2 rounded skeleton" />
    </div>
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

function ImageCard({ item, onRefine, onDownload, downloading }: {
  item: ImageHistoryItem
  onRefine: () => void
  onDownload: () => void
  downloading: boolean
}) {
  return (
    <div className="group flex flex-col rounded-xl overflow-hidden bg-[#141418] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={`${outputBaseURL}${item.url}`}
          alt=""
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Overlay actions */}
        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onRefine}
              className="flex-1 flex items-center justify-center gap-1 bg-violet-600/90 hover:bg-violet-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors backdrop-blur-sm shadow-lg"
            >
              <Sparkles className="w-3 h-3" />
              리파인
            </button>
            <button
              onClick={onDownload}
              disabled={downloading}
              className="flex items-center justify-center bg-black/70 backdrop-blur-sm hover:bg-black/90 text-slate-200 p-1.5 rounded-lg transition-colors disabled:opacity-60 border border-white/[0.1]"
              title="다운로드"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <a
              href={`${outputBaseURL}${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-black/70 backdrop-blur-sm hover:bg-black/90 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg transition-colors border border-white/[0.1]"
              title="원본 보기"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Date badge */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-white/80 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
            {formatDate(item.created_at)}
          </span>
        </div>
      </div>

      {/* Prompt info */}
      {(item.subject_prompt || item.scene_prompt) && (
        <div className="px-3 py-2.5 space-y-1.5 border-t border-white/[0.05]">
          {item.subject_prompt && (
            <div className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-1">{item.subject_prompt}</p>
            </div>
          )}
          {item.scene_prompt && (
            <div className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-1">{item.scene_prompt}</p>
            </div>
          )}
          {item.style_prompt && (
            <div className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
              <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-1">{item.style_prompt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function GalleryPanel() {
  const [images, setImages] = useState<ImageHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [chatImage, setChatImage] = useState<ImageHistoryItem | null>(null)

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
    <>
      {chatImage && <ImageChatPanel image={chatImage} onClose={() => setChatImage(null)} />}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">이미지 갤러리</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {loading ? '로딩 중...' : `${images.length}개의 이미지`}
            </p>
          </div>
          <button
            onClick={fetchImages}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-white/[0.08] text-sm text-slate-400 hover:border-white/[0.18] hover:text-slate-200 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#141418] border border-white/[0.08] flex items-center justify-center">
              <GalleryHorizontal className="w-8 h-8 text-slate-700" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">아직 생성된 이미지가 없습니다</p>
              <p className="text-xs text-slate-600 mt-1">이미지를 생성하면 여기에 표시됩니다</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                onRefine={() => setChatImage(item)}
                onDownload={() => handleDownload(item)}
                downloading={downloadingId === item.id}
              />
            ))}
          </div>
        )}

        {/* Refine panel hint */}
        {!loading && images.length > 0 && (
          <div className="flex items-center justify-center gap-2 py-2">
            <MessageSquare className="w-3.5 h-3.5 text-slate-700" />
            <p className="text-xs text-slate-700">이미지를 클릭해 리파인하세요</p>
          </div>
        )}
      </div>
    </>
  )
}
