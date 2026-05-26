const URL_REGEX = /https?:\/\/[^\s]+/g
const TCO_WEIGHT = 23

export const TWEET_MAX_LENGTH = 280

export function countTweetLength(text: string): number {
  const urls = text.match(URL_REGEX) ?? []
  let stripped = text
  for (const url of urls) {
    stripped = stripped.replace(url, '')
  }
  const graphemes = [...stripped].length
  return graphemes + urls.length * TCO_WEIGHT
}
