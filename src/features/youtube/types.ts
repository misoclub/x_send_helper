export interface RegisteredChannel {
  id: string
  handle?: string
  displayName: string
  addedAt: number
}

export interface Video {
  videoId: string
  channelId: string
  channelTitle: string
  title: string
  description: string
  publishedAt: string
  thumbnailUrl: string
  url: string
}
