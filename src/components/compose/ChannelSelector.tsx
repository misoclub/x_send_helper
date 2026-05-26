import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { RegisteredChannel } from '@/features/youtube/types'

export type ChannelSelection = 'all' | string

interface Props {
  channels: RegisteredChannel[]
  selection: ChannelSelection
  onSelect: (next: ChannelSelection) => void
}

export function ChannelSelector({ channels, selection, onSelect }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="flex gap-2 pb-1">
        <ChipButton
          active={selection === 'all'}
          onClick={() => onSelect('all')}
        >
          すべて
        </ChipButton>
        {channels.map((c) => (
          <ChipButton
            key={c.id}
            active={selection === c.id}
            onClick={() => onSelect(c.id)}
          >
            {c.displayName}
          </ChipButton>
        ))}
        <Link
          to="/settings"
          className="shrink-0 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-500 hover:border-brand hover:text-brand dark:border-slate-700"
        >
          <Plus className="inline h-4 w-4" /> 追加
        </Link>
      </div>
    </div>
  )
}

function ChipButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
        active
          ? 'bg-brand text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}
