import { addQuota } from './quota'
import type { Video } from './types'

const API_BASE = 'https://www.googleapis.com/youtube/v3'

export class YouTubeApiError extends Error {
  readonly status: number
  readonly reason?: string
  constructor(message: string, status: number, reason?: string) {
    super(message)
    this.status = status
    this.reason = reason
    this.name = 'YouTubeApiError'
  }
}

async function call<T>(
  path: string,
  params: Record<string, string>,
  apiKey: string,
  quotaCost: number,
): Promise<T> {
  const query = new URLSearchParams({ ...params, key: apiKey })
  const url = `${API_BASE}/${path}?${query.toString()}`
  const res = await fetch(url, {
    referrerPolicy: 'no-referrer-when-downgrade',
  })
  addQuota(quotaCost)
  if (!res.ok) {
    let reason: string | undefined
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      const err = body?.error
      message = err?.message ?? message
      reason = err?.errors?.[0]?.reason
    } catch {
      /* non-json body */
    }
    throw new YouTubeApiError(message, res.status, reason)
  }
  return (await res.json()) as T
}

interface ChannelsListResponse {
  items?: Array<{
    id: string
    snippet?: { title?: string }
    contentDetails?: { relatedPlaylists?: { uploads?: string } }
  }>
}

export interface ResolvedChannel {
  channelId: string
  displayName: string
  uploadsPlaylistId: string
}

export async function resolveChannel(
  input: { handle?: string; channelId?: string },
  apiKey: string,
): Promise<ResolvedChannel> {
  const params: Record<string, string> = {
    part: 'snippet,contentDetails',
  }
  if (input.channelId) {
    params.id = input.channelId
  } else if (input.handle) {
    const handle = input.handle.startsWith('@')
      ? input.handle
      : `@${input.handle}`
    params.forHandle = handle
  } else {
    throw new Error('Either channelId or handle is required')
  }
  const data = await call<ChannelsListResponse>('channels', params, apiKey, 1)
  const item = data.items?.[0]
  if (!item) throw new YouTubeApiError('チャンネルが見つかりませんでした', 404)
  const uploads = item.contentDetails?.relatedPlaylists?.uploads
  if (!uploads) throw new YouTubeApiError('uploads playlist が取得できません', 500)
  return {
    channelId: item.id,
    displayName: item.snippet?.title ?? input.handle ?? item.id,
    uploadsPlaylistId: uploads,
  }
}

export async function verifyApiKey(apiKey: string): Promise<void> {
  await call<{ items?: unknown[] }>(
    'i18nRegions',
    { part: 'snippet', hl: 'ja_JP' },
    apiKey,
    1,
  )
}

interface PlaylistItemsResponse {
  items?: Array<{
    snippet?: {
      title?: string
      description?: string
      publishedAt?: string
      channelId?: string
      channelTitle?: string
      thumbnails?: {
        medium?: { url?: string }
        high?: { url?: string }
        default?: { url?: string }
      }
      resourceId?: { videoId?: string }
    }
    contentDetails?: { videoId?: string; videoPublishedAt?: string }
  }>
  nextPageToken?: string
}

export async function fetchUploads(
  uploadsPlaylistId: string,
  apiKey: string,
  maxResults = 50,
): Promise<Video[]> {
  const data = await call<PlaylistItemsResponse>(
    'playlistItems',
    {
      part: 'snippet,contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: String(maxResults),
    },
    apiKey,
    1,
  )
  const items = data.items ?? []
  const videos: Video[] = []
  for (const item of items) {
    const videoId =
      item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId
    if (!videoId) continue
    const snippet = item.snippet
    const thumb =
      snippet?.thumbnails?.medium?.url ??
      snippet?.thumbnails?.high?.url ??
      snippet?.thumbnails?.default?.url ??
      ''
    videos.push({
      videoId,
      channelId: snippet?.channelId ?? '',
      channelTitle: snippet?.channelTitle ?? '',
      title: snippet?.title ?? '(無題)',
      description: snippet?.description ?? '',
      publishedAt:
        item.contentDetails?.videoPublishedAt ?? snippet?.publishedAt ?? '',
      thumbnailUrl: thumb,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    })
  }
  return videos
}
