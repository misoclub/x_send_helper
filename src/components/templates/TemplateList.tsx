import { useState } from 'react'
import { Copy, Pencil, Plus } from 'lucide-react'
import type { Template } from '@/features/templates/schema'
import { useTemplates } from '@/features/templates/store'
import { POST_TYPE_LIST } from '@/features/postTypes/registry'
import { TemplateEditor } from './TemplateEditor'

export function TemplateList() {
  const { all, upsert, remove, duplicateFromBuiltin } = useTemplates()
  const [editingId, setEditingId] = useState<string | null>(null)

  const startNew = () => {
    const first = POST_TYPE_LIST[0]
    const draft: Template = {
      id: crypto.randomUUID(),
      postTypeId: first.id,
      name: '新しいテンプレート',
      body: '',
      source: 'user',
      updatedAt: Date.now(),
    }
    upsert(draft)
    setEditingId(draft.id)
  }

  const grouped = POST_TYPE_LIST.map((pt) => ({
    postType: pt,
    items: all.filter((t) => t.postTypeId === pt.id),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">テンプレート</h2>
        <button type="button" className="btn-secondary h-9" onClick={startNew}>
          <Plus className="h-4 w-4" />
          新規
        </button>
      </div>

      {grouped.map(({ postType, items }) => (
        <section key={postType.id} className="space-y-2">
          <h3 className="text-sm font-medium text-slate-500">
            {postType.label}
          </h3>
          {items.length === 0 ? (
            <div className="card p-4 text-sm text-slate-500">
              テンプレートはありません
            </div>
          ) : (
            items.map((t) =>
              editingId === t.id && t.source === 'user' ? (
                <TemplateEditor
                  key={t.id}
                  template={t}
                  onSave={(next) => {
                    upsert(next)
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => {
                    remove(t.id)
                    setEditingId(null)
                  }}
                />
              ) : (
                <article key={t.id} className="card space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{t.name}</span>
                        {t.source === 'builtin' ? (
                          <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            標準
                          </span>
                        ) : null}
                      </div>
                      <pre className="mt-1 line-clamp-3 whitespace-pre-wrap text-xs text-slate-500">
                        {t.body || '(空)'}
                      </pre>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {t.source === 'user' ? (
                        <button
                          type="button"
                          aria-label="編集"
                          className="btn-ghost h-8 w-8 p-0"
                          onClick={() => setEditingId(t.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          aria-label="複製して編集"
                          className="btn-ghost h-8 w-8 p-0"
                          onClick={() => {
                            const copy = duplicateFromBuiltin(t.id)
                            if (copy) setEditingId(copy.id)
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ),
            )
          )}
        </section>
      ))}
    </div>
  )
}
