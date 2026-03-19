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
  // backwards compat: old API returned a plain array
  if (Array.isArray(res.data)) {
    return { images: res.data, total: res.data.length, page: 1, page_size: res.data.length, has_next: false }
  }
  return res.data
}
