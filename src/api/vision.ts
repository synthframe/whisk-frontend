import { client } from './client'
import type { AnalyzeResponse, SlotType } from '../types'

export async function analyzeImage(file: File, slotType: SlotType): Promise<AnalyzeResponse> {
  const form = new FormData()
  form.append('image', file)
  form.append('slot_type', slotType)
  const res = await client.post<AnalyzeResponse>('/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
