import { Send } from 'lucide-react'
import { buildIntentUrl } from '@/lib/intentUrl'

interface Props {
  text: string
  disabled?: boolean
}

export function PostToXButton({ text, disabled }: Props) {
  const url = buildIntentUrl(text)
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled || !text.trim()) {
      e.preventDefault()
    }
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-disabled={disabled || !text.trim()}
      className={`btn-primary w-full text-base ${
        disabled || !text.trim() ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <Send className="h-5 w-5" />
      Xで投稿する
    </a>
  )
}
