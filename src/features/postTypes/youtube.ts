import { Youtube } from 'lucide-react'
import type { PostType } from './types'

export const youtubePostType: PostType = {
  id: 'youtube',
  label: 'YouTube動画告知',
  description: '登録チャンネルの公開動画を選んで投稿テキストを生成',
  icon: Youtube,
  variables: [
    {
      key: 'title',
      label: '動画タイトル',
      kind: 'text',
      required: true,
      placeholder: '動画を選択すると自動入力されます',
      autoFilled: true,
    },
    {
      key: 'channelTitle',
      label: 'チャンネル名',
      kind: 'text',
      placeholder: '動画を選択すると自動入力されます',
      autoFilled: true,
    },
    {
      key: 'url',
      label: '動画URL',
      kind: 'url',
      required: true,
      placeholder: 'https://www.youtube.com/watch?v=...',
      autoFilled: true,
    },
    {
      key: 'mood',
      label: '雰囲気・コメント (自由入力)',
      kind: 'text',
      placeholder: '例: 切ない / 疾走感のある / etc.',
    },
  ],
  defaultTemplateId: 'builtin-yt-newrelease',
  supportsDataSource: true,
}
