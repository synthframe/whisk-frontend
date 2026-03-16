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
      className="w-full py-3 rounded-xl font-semibold text-white transition-all
        bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
        disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30
        flex items-center justify-center gap-2"
    >
      {generating ? (
        <>
          <LoadingSpinner size="sm" />
          Generating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate
        </>
      )}
    </button>
  )
}
