import { client } from './client'

export interface ImageHistoryItem {
  id: string
  url: string
  subject_prompt: string
  scene_prompt: string
  style_prompt: string
  style_preset: string
  width: number
  height: number
  created_at: string
}

export interface ImagePage {
  images: ImageHistoryItem[]
  total: number
  page: number
  page_size: number
  has_next: boolean
}

export async function getImages(page = 1, pageSize = 20): Promise<ImagePage> {
  const res = await client.get('/images', { params: { page, page_size: pageSize } })
  return res.data
}
