import { client } from './client'
import type { BatchRequest, BatchResponse, BatchStatusResponse } from '../types'

export async function createBatch(req: BatchRequest): Promise<BatchResponse> {
  const res = await client.post<BatchResponse>('/batch', req)
  return res.data
}

export async function getBatchStatus(batchId: string): Promise<BatchStatusResponse> {
  const res = await client.get<BatchStatusResponse>(`/batch/${batchId}`)
  return res.data
}
