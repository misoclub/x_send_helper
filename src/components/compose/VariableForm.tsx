import type { VariableDef, VariableValues } from '@/features/postTypes/types'

interface Props {
  variables: VariableDef[]
  values: VariableValues
  onChange: (next: VariableValues) => void
  lockedKeys?: Set<string>
}

export function VariableForm({ variables, values, onChange, lockedKeys }: Props) {
  const update = (key: string, value: string) => {
    onChange({ ...values, [key]: value })
  }
  return (
    <div className="space-y-4">
      {variables.map((v) => {
        const locked = lockedKeys?.has(v.key) ?? false
        const value = values[v.key] ?? ''
        const id = `var-${v.key}`
        const baseProps = {
          id,
          name: v.key,
          placeholder: v.placeholder,
          required: v.required,
          maxLength: v.maxLength,
          disabled: locked,
          className: 'input-base',
        }
        return (
          <div key={v.key} className="space-y-1.5">
            <label
              htmlFor={id}
              className="flex items-center gap-2 text-sm font-medium"
            >
              {v.label}
              {v.required ? <span className="text-red-500">*</span> : null}
              {locked ? (
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  自動入力
                </span>
              ) : null}
            </label>
            {v.kind === 'textarea' ? (
              <textarea
                {...baseProps}
                rows={3}
                value={value}
                onChange={(e) => update(v.key, e.target.value)}
              />
            ) : (
              <input
                {...baseProps}
                type={v.kind === 'url' ? 'url' : 'text'}
                value={value}
                onChange={(e) => update(v.key, e.target.value)}
              />
            )}
            {v.helpText ? (
              <p className="text-xs text-slate-500">{v.helpText}</p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
