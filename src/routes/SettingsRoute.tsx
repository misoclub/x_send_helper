import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Trash2,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react'
import { STORAGE_KEYS } from '@/lib/storage'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { useRegisteredChannels } from '@/features/youtube/channelsStore'
import { resolveChannel, YouTubeApiError } from '@/features/youtube/client'
import { writeUploadsPlaylistId } from '@/features/youtube/cache'
import { TemplateList } from '@/components/templates/TemplateList'
import { getQuotaUsed } from '@/features/youtube/quota'

export function SettingsRoute() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">設定</h1>
        <p className="text-sm text-slate-500">
          APIキー・チャンネル・テンプレートの管理を行います。すべての設定はこの端末のlocalStorageに保存されます。
        </p>
      </div>
      <ApiKeySection />
      <ChannelsSection />
      <TemplatesSection />
      <AboutSection />
    </div>
  )
}

function ApiKeySection() {
  const [apiKey, setApiKey] = useLocalStorage<string>(
    STORAGE_KEYS.youtubeApiKey,
    '',
  )
  const [show, setShow] = useState(false)
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">YouTube APIキー</h2>
        <Link
          to="/help/youtube-api-key"
          className="inline-flex items-center gap-1 text-xs text-brand underline"
        >
          <HelpCircle className="h-4 w-4" />
          発行手順
        </Link>
      </div>
      <p className="text-xs text-slate-500">
        Google Cloud Console で YouTube Data API v3 を有効化し、HTTPリファラ制限付きのAPIキーを発行して入力してください。
        手順がわからない場合は
        <Link to="/help/youtube-api-key" className="text-brand underline">
          こちらのヘルプ
        </Link>
        を参照。
      </p>
      <div className="flex gap-2">
        <input
          type={show ? 'text' : 'password'}
          autoComplete="off"
          className="input-base flex-1"
          value={apiKey}
          placeholder="AIza..."
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          type="button"
          className="btn-secondary"
          aria-label={show ? '隠す' : '表示する'}
          onClick={() => setShow((s) => !s)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <p className="text-xs text-slate-400">
        本日の概算クォータ使用量: {getQuotaUsed()} unit (10,000 unit/日)
      </p>
    </section>
  )
}

function ChannelsSection() {
  const [apiKey] = useLocalStorage<string>(STORAGE_KEYS.youtubeApiKey, '')
  const { channels, add, remove, move, rename } = useRegisteredChannels()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    setError(null)
    if (!apiKey) {
      setError('先にAPIキーを設定してください')
      return
    }
    const raw = input.trim()
    if (!raw) return
    setBusy(true)
    try {
      const isChannelId = /^UC[A-Za-z0-9_-]{20,}$/.test(raw)
      const isUrl = /^https?:\/\//.test(raw)
      let handleInput: string | undefined
      let channelIdInput: string | undefined
      if (isChannelId) {
        channelIdInput = raw
      } else if (isUrl) {
        const url = new URL(raw)
        const segments = url.pathname.split('/').filter(Boolean)
        const handleSeg = segments.find((s) => s.startsWith('@'))
        const channelSeg = segments[segments.indexOf('channel') + 1]
        if (handleSeg) handleInput = handleSeg
        else if (channelSeg) channelIdInput = channelSeg
        else throw new Error('URLからチャンネルを判別できませんでした')
      } else {
        handleInput = raw.startsWith('@') ? raw : `@${raw}`
      }
      const resolved = await resolveChannel(
        { handle: handleInput, channelId: channelIdInput },
        apiKey,
      )
      writeUploadsPlaylistId(resolved.channelId, resolved.uploadsPlaylistId)
      add({
        id: resolved.channelId,
        handle: handleInput,
        displayName: resolved.displayName,
        addedAt: Date.now(),
      })
      setInput('')
    } catch (e) {
      if (e instanceof YouTubeApiError) {
        setError(`チャンネル取得失敗: ${e.message}`)
      } else if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('不明なエラー')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">登録チャンネル</h2>
      <div className="flex gap-2">
        <input
          className="input-base flex-1"
          value={input}
          placeholder="@handle または UCxxxx... または チャンネルURL"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleAdd()
          }}
        />
        <button
          type="button"
          className="btn-primary"
          onClick={() => void handleAdd()}
          disabled={busy || !input.trim()}
        >
          追加
        </button>
      </div>
      {error ? (
        <div className="card flex items-start gap-2 border-red-300 bg-red-50 p-3 text-sm text-red-900 dark:border-red-800 dark:bg-red-900/30 dark:text-red-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}
      {channels.length === 0 ? (
        <div className="card p-4 text-sm text-slate-500">
          まだチャンネルが登録されていません
        </div>
      ) : (
        <ul className="space-y-2">
          {channels.map((c, i) => (
            <li key={c.id} className="card flex items-center gap-2 p-3">
              <div className="min-w-0 flex-1">
                <input
                  className="w-full bg-transparent text-sm font-medium focus:outline-none"
                  value={c.displayName}
                  onChange={(e) => rename(c.id, e.target.value)}
                />
                <div className="truncate text-xs text-slate-500">
                  {c.handle ?? c.id}
                </div>
              </div>
              <button
                type="button"
                aria-label="上へ"
                className="btn-ghost h-8 w-8 p-0"
                disabled={i === 0}
                onClick={() => move(c.id, -1)}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="下へ"
                className="btn-ghost h-8 w-8 p-0"
                disabled={i === channels.length - 1}
                onClick={() => move(c.id, 1)}
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="削除"
                className="btn-ghost h-8 w-8 p-0 text-red-500"
                onClick={() => remove(c.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function TemplatesSection() {
  return <TemplateList />
}

function AboutSection() {
  return (
    <section className="space-y-2 text-xs text-slate-500">
      <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
        このツールについて
      </h2>
      <p>
        APIキーや登録情報はすべて、利用しているブラウザのlocalStorage内にのみ保存されます。共有PCでは使用しないでください。
      </p>
      <p>
        YouTube APIキーには Google Cloud Console で HTTPリファラ制限 (本サイトのURL) を設定することを推奨します。
      </p>
    </section>
  )
}
