interface Props {
  message: string
  onClose: () => void
}

export function ErrorToast({ message, onClose }: Props) {
  return (
    <div className="fixed bottom-4 right-4 border border-white/20 bg-black text-white px-4 py-3 flex items-center gap-3 z-50 max-w-sm">
      <span className="flex-1 text-sm font-mono">{message}</span>
      <button onClick={onClose} className="text-white/60 hover:text-white text-lg leading-none font-mono transition-colors">
        ×
      </button>
    </div>
  )
}
