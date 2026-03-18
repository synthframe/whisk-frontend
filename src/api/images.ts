import { client } from './client'

export interface ImageHistoryItem {
  id: string
  url: string
  created_at: string
}

export async function getImages(): Promise<ImageHistoryItem[]> {
  const res = await client.get('/images')
  return res.data
}
