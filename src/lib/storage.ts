export const STORAGE_KEYS = {
  youtubeApiKey: 'xsh:youtube:apiKey',
  youtubeChannels: 'xsh:youtube:channels:v1',
  youtubeUploadsPlaylist: (channelId: string) =>
    `xsh:youtube:uploadsPlaylist:${channelId}`,
  youtubeVideos: (channelId: string) => `xsh:youtube:videos:${channelId}`,
  templates: 'xsh:templates:v1',
  templatesByChannel: 'xsh:templates:byChannel:v1',
  uiLastPostType: 'xsh:ui:lastPostType',
  uiLastChannelSelection: 'xsh:ui:lastChannelSelection',
} as const

export const VIDEO_CACHE_TTL_MS = 10 * 60 * 1000
