export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
  )

  return match?.[1] ?? null
}

export function youtubeThumbnail(id: string, quality: 'default' | 'hqdefault' | 'mqdefault' = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`
}
