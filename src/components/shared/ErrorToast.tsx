import { XCircle, X } from 'lucide-react'
import { useGenerateStore } from '../../store/generateStore'

export function ErrorToast() {
  const { error, setError } = useGenerateStore()
  if (!error) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-white border border-red-100 text-red-600 text-sm rounded-xl shadow-lg px-4 py-3 max-w-sm">
      <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span className="flex-1">{error}</span>
      <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-600 ml-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
