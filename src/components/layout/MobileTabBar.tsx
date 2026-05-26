import { Link, useLocation } from 'react-router-dom'
import { LayoutGrid, Send, Settings as SettingsIcon } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

interface TabProps {
  to: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  active: boolean
}

function Tab({ to, icon: Icon, label, active }: TabProps) {
  return (
    <Link
      to={to}
      className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
        active ? 'text-brand' : 'text-slate-500 dark:text-slate-400'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}

export function MobileTabBar() {
  const { pathname } = useLocation()
  const isCompose = pathname === '/' || pathname.startsWith('/compose/')
  const isTypes = pathname === '/types'
  const isSettings = pathname.startsWith('/settings')

  return (
    <nav className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div
        className="mx-auto flex max-w-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Tab to="/compose/youtube" icon={Send} label="投稿" active={isCompose} />
        <Tab to="/types" icon={LayoutGrid} label="投稿タイプ" active={isTypes} />
        <Tab to="/settings" icon={SettingsIcon} label="設定" active={isSettings} />
      </div>
    </nav>
  )
}
