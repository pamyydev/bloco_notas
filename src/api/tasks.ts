export type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
  createdAt?: string
  updatedAt?: string
}

export type TaskPayload = {
  title: string
  description?: string
  completed?: boolean
}

const BASE_URL = "http://18.230.148.208:8080/api/api"

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Erro ${res.status}`)
  }
  const contentType = res.headers.get('Content-Type') || ''
  if (contentType.includes('application/json')) return (await res.json()) as T
  return undefined as unknown as T
}

export const tasksApi = {
  list: (params?: { q?: string; status?: boolean }) => {
    const url = new URL(`${BASE_URL}/tasks`)
    if (typeof params?.status === 'boolean') {
      url.pathname = `${BASE_URL}/tasks/status/${params.status}`.replace(BASE_URL, '')
      // above replace keeps proper absolute URL
      return http<Task[]>(`${BASE_URL}/tasks/status/${params.status}`)
    }
    if (params?.q) url.searchParams.set('q', params.q)
    return http<Task[]>(url.toString())
  },
  search: (q: string) => http<Task[]>(`${BASE_URL}/tasks/search?q=${encodeURIComponent(q)}`),
  stats: () => http<Record<string, number>>(`${BASE_URL}/tasks/stats`),
  get: (id: number) => http<Task>(`${BASE_URL}/tasks/${id}`),
  create: (payload: TaskPayload) => http<Task>(`${BASE_URL}/tasks`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: TaskPayload) => http<Task>(`${BASE_URL}/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  toggle: (id: number) => http<Task>(`${BASE_URL}/tasks/${id}/toggle`, { method: 'PATCH' }),
  remove: (id: number) => http<void>(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' }),
}
