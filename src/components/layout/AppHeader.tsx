import { Link, useLocation } from 'react-router-dom'
import { Send, Settings as SettingsIcon } from 'lucide-react'
import { POST_TYPE_LIST } from '@/features/postTypes/registry'

export function AppHeader() {
  const { pathname } = useLocation()
  const isSettings = pathname.startsWith('/settings')
  const activePostTypeId = pathname.match(/^\/compose\/([^/]+)/)?.[1]

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Send className="h-5 w-5 text-brand" />
          <span className="hidden sm:inline">X Send Helper</span>
        </Link>
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {POST_TYPE_LIST.map((pt) => {
            const Icon = pt.icon
            const active = pt.id === activePostTypeId
            return (
              <Link
                key={pt.id}
                to={`/compose/${pt.id}`}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-white text-brand shadow-sm dark:bg-slate-900'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{pt.label}</span>
              </Link>
            )
          })}
        </div>
        <Link
          to="/settings"
          aria-label="設定"
          className={`btn-ghost h-9 w-9 p-0 ${isSettings ? 'text-brand' : ''}`}
        >
          <SettingsIcon className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}
