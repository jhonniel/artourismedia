import type { ServiceVideo } from '@/types'
import { formatViewCount, youtubeEmbedUrl } from '@/lib/youtube'

interface FeaturedMostWatchedVideosProps {
  videos: ServiceVideo[]
}

export function FeaturedMostWatchedVideos({ videos }: FeaturedMostWatchedVideosProps) {
  const video = videos[0]
  if (!video) return null

  return (
    <aside className="overflow-hidden rounded-[1.75rem] border border-teal/20 bg-gradient-to-br from-teal/5 via-white to-cream shadow-elevated">
      <div className="border-b border-teal/10 px-5 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Most Watched</p>
        <h2 className="mt-1 text-xl font-bold text-navy">Featured Video</h2>
      </div>

      <div className="p-4 sm:p-5">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-navy/5">
          <iframe
            src={youtubeEmbedUrl(video.youtube_id, { autoplay: true })}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        <p className="mt-4 line-clamp-3 font-semibold leading-snug text-navy">{video.title}</p>
        {video.view_count > 0 && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-orange">
            {formatViewCount(video.view_count)}
          </p>
        )}
        <a
          href={video.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-teal transition-colors hover:text-orange"
        >
          Watch on YouTube →
        </a>
      </div>
    </aside>
  )
}
