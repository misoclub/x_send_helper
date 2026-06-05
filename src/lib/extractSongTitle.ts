// 「」または『』で囲まれた部分は楽曲名とみなして抽出する。
const SONG_TITLE_REGEX = /「([^「」]+)」|『([^『』]+)』/g

export function extractSongTitle(title: string): string {
  const matches: string[] = []
  for (const match of title.matchAll(SONG_TITLE_REGEX)) {
    const inner = match[1] ?? match[2]
    if (inner) matches.push(inner.trim())
  }
  return matches.join(' / ')
}
