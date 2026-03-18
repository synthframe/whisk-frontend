import { Wand2 } from 'lucide-react'
import { useGenerateStore } from '../../store/generateStore'
import { useGenerate } from '../../hooks/useGenerate'

export function GenerateButton() {
  const { generating } = useGenerateStore()
  const { generate } = useGenerate()

  return (
    <button
      onClick={generate}
      disabled={generating}
      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-sm"
    >
      <Wand2 className="w-4 h-4" />
      {generating ? '생성 중...' : '이미지 생성'}
    </button>
  )
}
