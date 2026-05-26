import { Link, useLocation } from 'react-router-dom'
import { Send, Settings as SettingsIcon } from 'lucide-react'

export function AppHeader() {
  const location = useLocation()
  const isSettings = location.pathname.startsWith('/settings')
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Send className="h-5 w-5 text-brand" />
          <span>X Send Helper</span>
        </Link>
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
