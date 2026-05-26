const HASHTAG_TOKEN_REGEX = /[#＃]\S*/g

export function extractHashtagsFromTitle(title: string): {
  cleanTitle: string
  hashtags: string
} {
  const tokens = title.match(HASHTAG_TOKEN_REGEX) ?? []
  const validHashtags = tokens.filter((t) => t.length > 1)
  const hashtags = validHashtags.join(' ')
  const cleanTitle = title
    .replace(HASHTAG_TOKEN_REGEX, '')
    .replace(/\s+/g, ' ')
    .trim()
  return { cleanTitle, hashtags }
}

export function mergeHashtags(...sources: Array<string | undefined>): string {
  const seen = new Set<string>()
  const result: string[] = []
  for (const src of sources) {
    if (!src) continue
    const tokens = src.match(HASHTAG_TOKEN_REGEX) ?? []
    for (const t of tokens) {
      if (t.length <= 1) continue
      if (seen.has(t)) continue
      seen.add(t)
      result.push(t)
    }
  }
  return result.join(' ')
}
