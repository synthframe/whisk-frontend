import axios from 'axios'

const backendURL = import.meta.env.VITE_BACKEND_URL ?? ''

export const client = axios.create({
  baseURL: `${backendURL}/api`,
})

export const outputBaseURL = backendURL
