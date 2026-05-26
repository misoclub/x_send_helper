import { useCallback, useMemo } from 'react'
import defaultsJson from './defaults.json'
import { templateListSchema, type Template } from './schema'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/storage'

const builtins: Template[] = templateListSchema.parse(defaultsJson)

function parseUserTemplates(raw: unknown): Template[] {
  const result = templateListSchema.safeParse(raw)
  return result.success ? result.data.filter((t) => t.source === 'user') : []
}

export function useTemplates() {
  const [userTemplates, setUserTemplates] = useLocalStorage<Template[]>(
    STORAGE_KEYS.templates,
    [],
    parseUserTemplates,
  )

  const all = useMemo<Template[]>(
    () => [...userTemplates, ...builtins],
    [userTemplates],
  )

  const upsert = useCallback(
    (template: Template) => {
      if (template.source !== 'user') return
      setUserTemplates((prev) => {
        const idx = prev.findIndex((t) => t.id === template.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = template
          return next
        }
        return [template, ...prev]
      })
    },
    [setUserTemplates],
  )

  const remove = useCallback(
    (id: string) => {
      setUserTemplates((prev) => prev.filter((t) => t.id !== id))
    },
    [setUserTemplates],
  )

  const duplicateFromBuiltin = useCallback(
    (builtinId: string): Template | null => {
      const source = builtins.find((t) => t.id === builtinId)
      if (!source) return null
      const copy: Template = {
        ...source,
        id: crypto.randomUUID(),
        name: `${source.name} (コピー)`,
        source: 'user',
        updatedAt: Date.now(),
      }
      upsert(copy)
      return copy
    },
    [upsert],
  )

  return { all, userTemplates, builtins, upsert, remove, duplicateFromBuiltin }
}

export function getBuiltinTemplates(): Template[] {
  return builtins
}
