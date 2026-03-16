import axios from 'axios'

const backendURL = 'https://whisk-backend.dsmhs.kr'

export const client = axios.create({
  baseURL: `${backendURL}/api`,
})

export const outputBaseURL = backendURL
