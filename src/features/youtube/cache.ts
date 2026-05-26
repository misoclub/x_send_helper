import { STORAGE_KEYS, VIDEO_CACHE_TTL_MS } from '@/lib/storage'
import type { Video } from './types'

interface VideosCacheEntry {
  fetchedAt: number
  items: Video[]
}

export function readUploadsPlaylistId(channelId: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(
      STORAGE_KEYS.youtubeUploadsPlaylist(channelId),
    )
  } catch {
    return null
  }
}

export function writeUploadsPlaylistId(
  channelId: string,
  playlistId: string,
): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.youtubeUploadsPlaylist(channelId),
      playlistId,
    )
  } catch {
    /* ignore */
  }
}

export function readVideosCache(channelId: string): Video[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(
      STORAGE_KEYS.youtubeVideos(channelId),
    )
    if (!raw) return null
    const parsed = JSON.parse(raw) as VideosCacheEntry
    if (Date.now() - parsed.fetchedAt > VIDEO_CACHE_TTL_MS) return null
    return parsed.items
  } catch {
    return null
  }
}

export function writeVideosCache(channelId: string, items: Video[]): void {
  const entry: VideosCacheEntry = { fetchedAt: Date.now(), items }
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.youtubeVideos(channelId),
      JSON.stringify(entry),
    )
  } catch {
    /* ignore */
  }
}

export function clearVideosCache(channelId: string): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.youtubeVideos(channelId))
  } catch {
    /* ignore */
  }
}
