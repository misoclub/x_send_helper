import { fetchUploads, resolveChannel } from './client'
import {
  readUploadsPlaylistId,
  readVideosCache,
  writeUploadsPlaylistId,
  writeVideosCache,
} from './cache'
import type { RegisteredChannel, Video } from './types'

export interface ChannelVideos {
  channelId: string
  videos: Video[]
}

export async function loadVideosForChannel(
  channel: RegisteredChannel,
  apiKey: string,
  options: { force?: boolean } = {},
): Promise<Video[]> {
  if (!options.force) {
    const cached = readVideosCache(channel.id)
    if (cached) return cached
  }
  let uploadsId = readUploadsPlaylistId(channel.id)
  if (!uploadsId) {
    const resolved = await resolveChannel({ channelId: channel.id }, apiKey)
    uploadsId = resolved.uploadsPlaylistId
    writeUploadsPlaylistId(channel.id, uploadsId)
  }
  const items = await fetchUploads(uploadsId, apiKey)
  writeVideosCache(channel.id, items)
  return items
}

export async function loadGroupedVideos(
  channels: RegisteredChannel[],
  apiKey: string,
  options: { force?: boolean } = {},
): Promise<ChannelVideos[]> {
  return Promise.all(
    channels.map(async (ch) => {
      try {
        const videos = await loadVideosForChannel(ch, apiKey, options)
        return { channelId: ch.id, videos }
      } catch (err) {
        console.error('[loader] failed to load channel', ch.id, err)
        return { channelId: ch.id, videos: [] }
      }
    }),
  )
}
