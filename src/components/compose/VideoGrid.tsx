import type { Video } from '@/features/youtube/types'

interface Props {
  videos: Video[]
  selectedVideoId?: string
  onSelect: (video: Video) => void
}

export function VideoGrid({ videos, selectedVideoId, onSelect }: Props) {
  if (videos.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-slate-500">
        動画が見つかりませんでした
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => {
        const active = v.videoId === selectedVideoId
        return (
          <button
            key={v.videoId}
            type="button"
            onClick={() => onSelect(v)}
            className={`card overflow-hidden text-left transition hover:shadow ${
              active ? 'ring-2 ring-brand' : ''
            }`}
          >
            {v.thumbnailUrl ? (
              <img
                src={v.thumbnailUrl}
                alt=""
                className="aspect-video w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
            )}
            <div className="space-y-1 p-3">
              <div className="line-clamp-2 text-sm font-medium">{v.title}</div>
              <div className="text-xs text-slate-500">
                {v.channelTitle}
                {v.publishedAt
                  ? ` · ${new Date(v.publishedAt).toLocaleDateString('ja-JP')}`
                  : ''}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
