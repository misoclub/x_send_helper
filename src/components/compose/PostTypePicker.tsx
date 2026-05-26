import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { POST_TYPE_LIST } from '@/features/postTypes/registry'

export function PostTypePicker() {
  return (
    <div className="space-y-3">
      {POST_TYPE_LIST.map((type) => {
        const Icon = type.icon
        return (
          <Link
            key={type.id}
            to={`/compose/${type.id}`}
            className="card flex items-center gap-4 p-4 transition hover:border-brand hover:shadow"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{type.label}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {type.description}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        )
      })}
    </div>
  )
}
