import { useCallback } from 'react'
import { z } from 'zod'
import { STORAGE_KEYS } from '@/lib/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import type { RegisteredChannel } from './types'

const channelSchema = z.object({
  id: z.string(),
  handle: z.string().optional(),
  displayName: z.string(),
  addedAt: z.number(),
})
const channelsSchema = z.array(channelSchema)

function parseChannels(raw: unknown): RegisteredChannel[] {
  const result = channelsSchema.safeParse(raw)
  return result.success ? result.data : []
}

export function useRegisteredChannels() {
  const [channels, setChannels] = useLocalStorage<RegisteredChannel[]>(
    STORAGE_KEYS.youtubeChannels,
    [],
    parseChannels,
  )

  const add = useCallback(
    (channel: RegisteredChannel) => {
      setChannels((prev) => {
        if (prev.some((c) => c.id === channel.id)) return prev
        return [...prev, channel]
      })
    },
    [setChannels],
  )

  const remove = useCallback(
    (id: string) => {
      setChannels((prev) => prev.filter((c) => c.id !== id))
    },
    [setChannels],
  )

  const rename = useCallback(
    (id: string, displayName: string) => {
      setChannels((prev) =>
        prev.map((c) => (c.id === id ? { ...c, displayName } : c)),
      )
    },
    [setChannels],
  )

  const move = useCallback(
    (id: string, delta: number) => {
      setChannels((prev) => {
        const idx = prev.findIndex((c) => c.id === id)
        if (idx < 0) return prev
        const target = Math.max(0, Math.min(prev.length - 1, idx + delta))
        if (target === idx) return prev
        const next = [...prev]
        const [item] = next.splice(idx, 1)
        next.splice(target, 0, item)
        return next
      })
    },
    [setChannels],
  )

  return { channels, add, remove, rename, move }
}
