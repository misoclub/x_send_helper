import type { Template } from '@/features/templates/schema'

interface Props {
  templates: Template[]
  value: string
  onChange: (id: string) => void
}

export function TemplateSelect({ templates, value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="template-select" className="text-sm font-medium">
        テンプレート
      </label>
      <select
        id="template-select"
        className="input-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.source === 'user' ? '★ ' : ''}
            {t.name}
          </option>
        ))}
      </select>
    </div>
  )
}
