import { Wand2 } from 'lucide-react'
import { useGenerateStore } from '../../store/generateStore'
import { useSlotStore } from '../../store/slotStore'
import { useGenerate } from '../../hooks/useGenerate'

export function GenerateButton() {
  const { generating } = useGenerateStore()
  const slots = useSlotStore(s => s.slots)
  const { generate } = useGenerate()

  const hasAnyPrompt = slots.subject.prompt || slots.scene.prompt || slots.style.prompt

  return (
    <button
      onClick={generate}
      disabled={generating}
      title={!hasAnyPrompt ? '슬롯에 내용을 입력하세요' : undefined}
      className={`w-full flex items-center justify-center gap-2.5 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-lg ${
        generating
          ? 'bg-violet-700/60 cursor-not-allowed shadow-none'
          : hasAnyPrompt
            ? 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 shadow-violet-900/40 hover:shadow-violet-900/60 active:scale-[0.99]'
            : 'bg-gradient-to-r from-violet-600/60 to-purple-500/60 cursor-not-allowed shadow-none'
      }`}
    >
      {generating ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          생성 중...
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4" />
          이미지 생성
        </>
      )}
    </button>
  )
}
