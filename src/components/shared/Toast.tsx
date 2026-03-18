import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const STYLES = {
  success: 'border-emerald-100 text-emerald-700 bg-white',
  error: 'border-red-100 text-red-600 bg-white',
  info: 'border-blue-100 text-blue-600 bg-white',
}

const ICON_STYLES = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 border rounded-xl shadow-lg px-4 py-3 max-w-sm pointer-events-auto
              animate-in slide-in-from-right-4 fade-in duration-200
              ${STYLES[toast.type]}`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${ICON_STYLES[toast.type]}`} />
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-300 hover:text-gray-500 transition-colors ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
