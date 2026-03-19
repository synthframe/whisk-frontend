import { useSlotStore } from '../store/slotStore'
import { useGenerateStore } from '../store/generateStore'
import { useToastStore } from '../store/toastStore'
import { generateImage, pollGenerateStatus } from '../api/generate'
import { RATIO_DIMENSIONS } from '../types'

export function useGenerate() {
  const slots = useSlotStore((s) => s.slots)
  const { selectedPreset, selectedRatio, mainPrompt, setGenerating, setResult, setError, setJobId } = useGenerateStore()
  const addToast = useToastStore((s) => s.addToast)

  const generate = async () => {
    setGenerating(true)
    setError(null)
    setResult(null)

    try {
      const { width, height } = RATIO_DIMENSIONS[selectedRatio]
      // Combine mainPrompt with slot subject (mainPrompt takes priority as the main description)
      const subjectPrompt = [mainPrompt.trim(), slots.subject.prompt.trim()].filter(Boolean).join(', ')
      const res = await generateImage({
        subject_prompt: subjectPrompt,
        scene_prompt: slots.scene.prompt,
        style_prompt: slots.style.prompt,
        style_preset: selectedPreset,
        width,
        height,
      })
      setJobId(res.id)

      const poll = async () => {
        const status = await pollGenerateStatus(res.id)
        if (status.status === 'completed' && status.image_url) {
          setResult(status.image_url)
          setGenerating(false)
          addToast('이미지 생성 완료!', 'success')
        } else if (status.status === 'failed') {
          const errMsg = status.error ?? 'Generation failed'
          setError(errMsg)
          setGenerating(false)
          addToast(errMsg, 'error')
        } else {
          setTimeout(poll, 2000)
        }
      }
      setTimeout(poll, 2000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Generation failed'
      setError(msg)
      setGenerating(false)
      addToast(msg, 'error')
    }
  }

  return { generate }
}
