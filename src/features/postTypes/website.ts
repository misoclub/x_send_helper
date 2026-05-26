import { Globe } from 'lucide-react'
import type { PostType } from './types'

export const websitePostType: PostType = {
  id: 'website',
  label: 'Webサイト告知',
  description: '任意のWebページへのリンク付き告知テキストを生成',
  icon: Globe,
  variables: [
    {
      key: 'title',
      label: 'タイトル / 見出し',
      kind: 'text',
      required: true,
      placeholder: '例: ブログ記事を更新しました',
    },
    {
      key: 'summary',
      label: '本文 (自由入力)',
      kind: 'textarea',
      placeholder: '記事の内容を簡潔に紹介してください',
    },
    {
      key: 'url',
      label: 'URL',
      kind: 'url',
      required: true,
      placeholder: 'https://example.com/...',
    },
  ],
  defaultTemplateId: 'builtin-web-default',
  supportsDataSource: false,
}
