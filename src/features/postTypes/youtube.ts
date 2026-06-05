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
      key: 'songtitle',
      label: '楽曲名',
      kind: 'text',
      placeholder: '動画を選択すると「」『』内を自動抽出します',
      helpText:
        '動画タイトル内の「」または『』で囲まれた部分を楽曲名として自動抽出します。自由に編集できます。',
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
      key: 'hashtags',
      label: 'ハッシュタグ',
      kind: 'text',
      placeholder: '#example #タグ',
      helpText: '動画タイトルに含まれるハッシュタグを自動抽出します。自由に追記・編集できます。',
    },
    {
      key: 'mood',
      label: '雰囲気・コメント (自由入力)',
      kind: 'textarea',
      placeholder: '例: 切ない / 疾走感のある / etc.\n改行もOK',
    },
  ],
  defaultTemplateId: 'builtin-yt-newrelease',
  supportsDataSource: true,
}
