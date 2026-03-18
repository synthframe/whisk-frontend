import { client } from './client'

export async function register(email: string, password: string, name: string) {
  const res = await client.post('/auth/register', { email, password, name })
  return res.data as { token: string; user: { id: string; email: string; name: string } }
}

export async function login(email: string, password: string) {
  const res = await client.post('/auth/login', { email, password })
  return res.data as { token: string; user: { id: string; email: string; name: string } }
}

export async function getMe() {
  const res = await client.get('/auth/me')
  return res.data as { id: string; email: string; name: string }
}
