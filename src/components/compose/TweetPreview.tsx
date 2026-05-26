import { RotateCcw } from 'lucide-react'
import { TWEET_MAX_LENGTH, countTweetLength } from '@/lib/countTweetLength'

interface Props {
  text: string
  onChange: (next: string) => void
  isManual: boolean
  onReset: () => void
}

export function TweetPreview({ text, onChange, isManual, onReset }: Props) {
  const length = countTweetLength(text)
  const over = length > TWEET_MAX_LENGTH
  const rows = Math.max(5, Math.min(20, text.split('\n').length + 1))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">プレビュー</span>
        <div className="flex items-center gap-3">
          {isManual ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs text-brand underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              テンプレに戻す
            </button>
          ) : null}
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
      </div>
      <textarea
        className="card w-full whitespace-pre-wrap break-words bg-white p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand/30 dark:bg-slate-900"
        style={{ resize: 'vertical' }}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="テンプレートと入力欄を埋めるか、ここに直接編集してください"
        rows={rows}
        spellCheck={false}
      />
      {isManual ? (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          手動編集中：テンプレートや変数の変更は反映されません。元に戻すには右上の「テンプレに戻す」を押してください。
        </p>
      ) : null}
    </div>
  )
}
