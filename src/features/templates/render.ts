import type { VariableValues } from '../postTypes/types'

const VAR_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g

export function renderTemplate(body: string, values: VariableValues): string {
  return body.replace(VAR_PATTERN, (_match, key: string) => {
    const value = values[key]
    if (value === undefined) {
      if (typeof console !== 'undefined') {
        console.warn(`[render] undefined variable: {{${key}}}`)
      }
      return ''
    }
    return value
  })
}

export function extractVariableKeys(body: string): string[] {
  const found = new Set<string>()
  for (const match of body.matchAll(VAR_PATTERN)) {
    if (match[1]) found.add(match[1])
  }
  return [...found]
}
