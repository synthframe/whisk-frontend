import axios from 'axios'

const backendURL = 'https://whisk-backend.dsmhs.kr'

export const client = axios.create({
  baseURL: `${backendURL}/api`,
})

client.interceptors.request.use((config) => {
  const stored = localStorage.getItem('whisk-auth')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch {}
  }
  return config
})

export const outputBaseURL = backendURL
