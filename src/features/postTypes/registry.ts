import type { PostType, PostTypeId } from './types'
import { youtubePostType } from './youtube'
import { websitePostType } from './website'

export const POST_TYPES: Record<PostTypeId, PostType> = {
  youtube: youtubePostType,
  website: websitePostType,
}

export const POST_TYPE_LIST: PostType[] = [youtubePostType, websitePostType]

export function getPostType(id: string | undefined): PostType | undefined {
  if (!id) return undefined
  return (POST_TYPES as Record<string, PostType | undefined>)[id]
}
