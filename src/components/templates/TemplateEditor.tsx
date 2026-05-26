import { useEffect, useState } from 'react'
import type { Template } from '@/features/templates/schema'
import { POST_TYPE_LIST } from '@/features/postTypes/registry'

interface Props {
  template: Template
  onSave: (next: Template) => void
  onCancel: () => void
  onDelete?: () => void
}

export function TemplateEditor({ template, onSave, onCancel, onDelete }: Props) {
  const [name, setName] = useState(template.name)
  const [body, setBody] = useState(template.body)
  const [postTypeId, setPostTypeId] = useState(template.postTypeId)

  useEffect(() => {
    setName(template.name)
    setBody(template.body)
    setPostTypeId(template.postTypeId)
  }, [template])

  const postType = POST_TYPE_LIST.find((p) => p.id === postTypeId)

  const insertVariable = (key: string) => {
    setBody((prev) => `${prev}{{${key}}}`)
  }

  const save = () => {
    onSave({
      ...template,
      name: name.trim() || '無題のテンプレート',
      body,
      postTypeId,
      updatedAt: Date.now(),
    })
  }

  return (
    <div className="card space-y-4 p-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">投稿タイプ</label>
        <select
          className="input-base"
          value={postTypeId}
          onChange={(e) => setPostTypeId(e.target.value as typeof postTypeId)}
        >
          {POST_TYPE_LIST.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">テンプレート名</label>
        <input
          className="input-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">本文</label>
        <textarea
          className="input-base font-mono"
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {postType ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-500">
            使用可能なタグ（クリックで本文の末尾に挿入）
          </div>
          <ul className="space-y-1.5">
            {postType.variables.map((v) => (
              <li key={v.key} className="flex items-start gap-2">
                <button
                  type="button"
                  className="btn-secondary h-7 shrink-0 px-2 font-mono text-xs"
                  onClick={() => insertVariable(v.key)}
                  aria-label={`{{${v.key}}} を挿入`}
                >
                  {`{{${v.key}}}`}
                </button>
                <div className="pt-1 text-xs text-slate-600 dark:text-slate-300">
                  {v.label}
                  {v.autoFilled ? (
                    <span className="ml-1 text-slate-400">
                      （動画選択時に自動入力）
                    </span>
                  ) : (
                    <span className="ml-1 text-slate-400">（手入力）</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400">
            ※ 本文中の <code className="font-mono">{'{{xxx}}'}</code> は投稿生成時に対応する値に置き換わります。未定義のタグは空文字になります。
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-2">
        <button type="button" onClick={save} className="btn-primary">
          保存
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          キャンセル
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost ml-auto text-red-500"
          >
            削除
          </button>
        ) : null}
      </div>
    </div>
  )
}
