import { useCallback, useEffect, useRef, useState } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  parse?: (raw: unknown) => T,
): [T, SetValue<T>] {
  const defaultRef = useRef(defaultValue)
  const parseRef = useRef(parse)

  const read = useCallback((): T => {
    if (typeof window === 'undefined') return defaultRef.current
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return defaultRef.current
      const parsed: unknown = JSON.parse(raw)
      return parseRef.current ? parseRef.current(parsed) : (parsed as T)
    } catch {
      return defaultRef.current
    }
  }, [key])

  const [value, setValue] = useState<T>(read)

  useEffect(() => {
    setValue(read())
  }, [read])

  const update: SetValue<T> = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          /* quota exceeded or private mode */
        }
        return resolved
      })
    },
    [key],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return
      setValue(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, read])

  return [value, update]
}
