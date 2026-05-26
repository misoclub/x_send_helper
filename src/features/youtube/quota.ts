const KEY = 'xsh:youtube:quota:v1'

interface QuotaState {
  date: string
  used: number
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function read(): QuotaState {
  if (typeof window === 'undefined') return { date: today(), used: 0 }
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return { date: today(), used: 0 }
    const parsed = JSON.parse(raw) as QuotaState
    if (parsed.date !== today()) return { date: today(), used: 0 }
    return parsed
  } catch {
    return { date: today(), used: 0 }
  }
}

function write(state: QuotaState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

export function addQuota(cost: number): number {
  const state = read()
  state.used += cost
  write(state)
  return state.used
}

export function getQuotaUsed(): number {
  return read().used
}
