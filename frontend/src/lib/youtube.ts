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

export function youtubeEmbedUrl(
  id: string,
  options: { autoplay?: boolean; mute?: boolean } = {},
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  })

  if (options.autoplay) {
    params.set('autoplay', '1')
  }

  if (options.mute ?? options.autoplay) {
    params.set('mute', '1')
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`
}

export function formatViewCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M views`
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K views`
  }

  return `${count.toLocaleString()} views`
}
