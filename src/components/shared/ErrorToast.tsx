interface Props {
  message: string
  onClose: () => void
}

export function ErrorToast({ message, onClose }: Props) {
  return (
    <div className="fixed bottom-6 right-6 border-2 border-black bg-white text-black px-5 py-4 flex items-center gap-4 z-50 max-w-sm">
      <span className="flex-1 text-sm font-mono font-bold">{message}</span>
      <button onClick={onClose} className="text-black/50 hover:text-black text-xl leading-none font-mono transition-colors">
        ×
      </button>
    </div>
  )
}
