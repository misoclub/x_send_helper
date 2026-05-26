import { TWEET_MAX_LENGTH, countTweetLength } from '@/lib/countTweetLength'

interface Props {
  text: string
}

export function TweetPreview({ text }: Props) {
  const length = countTweetLength(text)
  const over = length > TWEET_MAX_LENGTH
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">プレビュー</span>
        <span
          className={
            over
              ? 'font-mono text-red-500'
              : 'font-mono text-slate-500 dark:text-slate-400'
          }
          aria-live="polite"
        >
          {length} / {TWEET_MAX_LENGTH}
        </span>
      </div>
      <div className="card whitespace-pre-wrap break-words p-4 text-sm leading-relaxed">
        {text || (
          <span className="text-slate-400">
            テンプレートと入力欄を埋めるとここにプレビューが表示されます
          </span>
        )}
      </div>
    </div>
  )
}
