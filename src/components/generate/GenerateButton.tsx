import { useGenerateStore } from '../../store/generateStore'
import { useGenerate } from '../../hooks/useGenerate'
import { LoadingSpinner } from '../shared/LoadingSpinner'

export function GenerateButton() {
  const { generating } = useGenerateStore()
  const { generate } = useGenerate()

  return (
    <button
      onClick={generate}
      disabled={generating}
      className="w-full py-4 border-2 border-black font-mono font-bold text-black transition-all
        hover:bg-black hover:text-white text-base uppercase tracking-widest
        disabled:opacity-40 disabled:cursor-not-allowed
        flex items-center justify-center gap-3"
    >
      {generating ? (
        <>
          <LoadingSpinner size="sm" />
          Generating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate
        </>
      )}
    </button>
  )
}
