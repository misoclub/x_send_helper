import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { getPostType } from '@/features/postTypes/registry'
import type { VariableValues } from '@/features/postTypes/types'
import { useTemplates } from '@/features/templates/store'
import { renderTemplate } from '@/features/templates/render'
import { useRegisteredChannels } from '@/features/youtube/channelsStore'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/storage'
import { extractHashtagsFromTitle, mergeHashtags } from '@/lib/extractHashtags'
import {
  loadGroupedVideos,
  loadVideosForChannel,
  type ChannelVideos,
} from '@/features/youtube/loader'
import type { Video } from '@/features/youtube/types'
import { YouTubeApiError } from '@/features/youtube/client'
import { VariableForm } from '@/components/compose/VariableForm'
import { TweetPreview } from '@/components/compose/TweetPreview'
import { PostToXButton } from '@/components/compose/PostToXButton'
import {
  ChannelSelector,
  type ChannelSelection,
} from '@/components/compose/ChannelSelector'
import { VideoGrid } from '@/components/compose/VideoGrid'
import { TemplateSelect } from '@/components/compose/TemplateSelect'

export function ComposeRoute() {
  const { postTypeId } = useParams<{ postTypeId: string }>()
  const postType = getPostType(postTypeId)

  if (!postType) {
    return (
      <div className="card p-6 text-sm">
        不明な投稿タイプです。
        <Link to="/" className="ml-2 text-brand underline">
          ホームへ戻る
        </Link>
      </div>
    )
  }

  return <ComposeView key={postType.id} postTypeId={postType.id} />
}

function parseTemplatesByChannel(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'string') out[k] = v
  }
  return out
}

function ComposeView({ postTypeId }: { postTypeId: 'youtube' | 'website' }) {
  const postType = getPostType(postTypeId)!
  const templates = useTemplates()
  const availableTemplates = useMemo(
    () => templates.all.filter((t) => t.postTypeId === postType.id),
    [templates.all, postType.id],
  )
  const [templateId, setTemplateId] = useState(() => {
    const exists = availableTemplates.find(
      (t) => t.id === postType.defaultTemplateId,
    )
    return exists?.id ?? availableTemplates[0]?.id ?? ''
  })
  useEffect(() => {
    if (!availableTemplates.find((t) => t.id === templateId)) {
      setTemplateId(availableTemplates[0]?.id ?? '')
    }
  }, [availableTemplates, templateId])

  const [values, setValues] = useState<VariableValues>({})
  const [manualText, setManualText] = useState<string | null>(null)
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [templatesByChannel, setTemplatesByChannel] = useLocalStorage<
    Record<string, string>
  >(STORAGE_KEYS.templatesByChannel, {}, parseTemplatesByChannel)
  const template = availableTemplates.find((t) => t.id === templateId)
  const renderValues = useMemo(() => {
    if (!template?.defaultHashtags) return values
    const expanded = renderTemplate(template.defaultHashtags, values)
    const merged = mergeHashtags(expanded, values.hashtags)
    return { ...values, hashtags: merged }
  }, [template, values])
  const rendered = template ? renderTemplate(template.body, renderValues) : ''
  const displayText = manualText ?? rendered
  const lockedKeys = useMemo(
    () =>
      new Set(
        postType.variables.filter((v) => v.autoFilled).map((v) => v.key),
      ),
    [postType.variables],
  )

  const handlePickVideo = (video: Video) => {
    setActiveChannelId(video.channelId)
    const { cleanTitle, hashtags } = extractHashtagsFromTitle(video.title)
    setValues((prev) => ({
      ...prev,
      title: cleanTitle,
      url: video.url,
      channelTitle: video.channelTitle,
      hashtags,
    }))
    const saved = templatesByChannel[video.channelId]
    if (saved && availableTemplates.some((t) => t.id === saved)) {
      setTemplateId(saved)
    }
  }

  const handleTemplateChange = (id: string) => {
    setTemplateId(id)
    if (activeChannelId) {
      setTemplatesByChannel((prev) => ({ ...prev, [activeChannelId]: id }))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{postType.label}</h1>

      {postType.id === 'youtube' ? (
        <YouTubePicker onPick={handlePickVideo} />
      ) : null}

      <TemplateSelect
        templates={availableTemplates}
        value={templateId}
        onChange={handleTemplateChange}
      />

      <VariableForm
        variables={postType.variables}
        values={values}
        onChange={setValues}
        lockedKeys={lockedKeys}
      />

      <TweetPreview
        text={displayText}
        onChange={setManualText}
        isManual={manualText !== null}
        onReset={() => setManualText(null)}
      />

      {postType.id === 'youtube' && !activeChannelId ? (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          上から動画を選択するとXへの投稿ボタンが有効になります。
        </p>
      ) : null}

      <PostToXButton
        text={displayText}
        disabled={
          (!template && !manualText) ||
          (postType.id === 'youtube' && !activeChannelId)
        }
      />

      <p className="text-xs text-slate-500">
        ※ Xアプリ/ブラウザの投稿画面が開きます。画像添付はX側で別途行ってください。
      </p>
    </div>
  )
}

const PAGE_SIZE = 3

function YouTubePicker({ onPick }: { onPick: (video: Video) => void }) {
  const [apiKey] = useLocalStorage<string>(STORAGE_KEYS.youtubeApiKey, '')
  const { channels } = useRegisteredChannels()
  const [selection, setSelection] = useLocalStorage<ChannelSelection>(
    STORAGE_KEYS.uiLastChannelSelection,
    'all',
  )
  const [grouped, setGrouped] = useState<ChannelVideos[]>([])
  const [pages, setPages] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>()

  const reload = async (force: boolean) => {
    if (!apiKey) {
      setError('YouTube APIキーが未設定です。設定画面で登録してください。')
      setGrouped([])
      return
    }
    if (channels.length === 0) {
      setError('チャンネルが未登録です。設定画面で追加してください。')
      setGrouped([])
      return
    }
    setError(null)
    setLoading(true)
    try {
      if (selection === 'all') {
        setGrouped(await loadGroupedVideos(channels, apiKey, { force }))
      } else {
        const target = channels.find((c) => c.id === selection)
        if (!target) {
          setGrouped([])
          return
        }
        const videos = await loadVideosForChannel(target, apiKey, { force })
        setGrouped([{ channelId: target.id, videos }])
      }
    } catch (e) {
      if (e instanceof YouTubeApiError) {
        if (e.reason === 'quotaExceeded') {
          setError('YouTube APIのクォータを使い切りました。明日0時(PT)まで待つかキーを変更してください。')
        } else if (e.status === 400 || e.status === 403) {
          setError(`APIキーが無効か制限されています: ${e.message}`)
        } else {
          setError(`YouTube API エラー: ${e.message}`)
        }
      } else {
        setError(e instanceof Error ? e.message : '不明なエラー')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPages({})
    void reload(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, apiKey, channels.length])

  const channelOrder = useMemo(
    () => new Map(channels.map((c, i) => [c.id, i] as const)),
    [channels],
  )

  const sections = useMemo(() => {
    return grouped
      .filter((g) => g.videos.length > 0)
      .map((g) => {
        const channel = channels.find((c) => c.id === g.channelId)
        const page = pages[g.channelId] ?? 1
        const limit = page * PAGE_SIZE
        return {
          channelId: g.channelId,
          channelName: channel?.displayName ?? g.channelId,
          visible: g.videos.slice(0, limit),
          total: g.videos.length,
          hasMore: g.videos.length > limit,
        }
      })
      .sort(
        (a, b) =>
          (channelOrder.get(a.channelId) ?? 0) -
          (channelOrder.get(b.channelId) ?? 0),
      )
  }, [grouped, pages, channels, channelOrder])

  const handleSelect = (video: Video) => {
    setSelectedVideoId(video.videoId)
    onPick(video)
  }

  const handleRefresh = () => {
    setPages({})
    void reload(true)
  }

  const handleShowMore = (channelId: string) => {
    setPages((prev) => ({ ...prev, [channelId]: (prev[channelId] ?? 1) + 1 }))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">動画を選択</div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="btn-ghost h-8 px-2 text-xs"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          更新
        </button>
      </div>

      <ChannelSelector
        channels={channels}
        selection={selection}
        onSelect={setSelection}
      />

      {error ? (
        <div className="card flex items-start gap-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse overflow-hidden">
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-500">
          動画が見つかりませんでした
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s.channelId} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {s.channelName}
                </h3>
                <span className="text-xs text-slate-500">
                  {s.visible.length} / {s.total}
                </span>
              </div>
              <VideoGrid
                videos={s.visible}
                selectedVideoId={selectedVideoId}
                onSelect={handleSelect}
              />
              {s.hasMore ? (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn-secondary h-8 px-3 text-xs"
                    onClick={() => handleShowMore(s.channelId)}
                  >
                    もっと見る
                  </button>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
