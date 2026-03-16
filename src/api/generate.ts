import { client } from './client'
import type { GenerateRequest, GenerateResponse } from '../types'

export async function generateImage(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await client.post<GenerateResponse>('/generate', req)
  return res.data
}

export async function pollGenerateStatus(id: string): Promise<GenerateResponse> {
  const res = await client.get<GenerateResponse>(`/generate/${id}`)
  return res.data
}
