import type { ServiceVideo } from '@/types'
import { formatViewCount } from '@/lib/youtube'

interface ServiceVideoGalleryProps {
  videos: ServiceVideo[]
  title?: string
}

export function ServiceVideoGallery({
  videos,
  title = 'Videos',
}: ServiceVideoGalleryProps) {
  if (videos.length === 0) return null

  return (
    <section className="mt-12 border-t border-navy/10 pt-10">
      <h2 className="text-2xl font-bold text-navy md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-navy/65 md:text-base">
        Watch highlights from Mindanao CONNECT.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <a
            key={video.uuid}
            href={video.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-[1.25rem] border border-navy/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="relative aspect-video overflow-hidden bg-navy/5">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-navy/10 transition-colors group-hover:bg-navy/20" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-navy shadow-soft transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-navy">{video.title}</h3>
              {video.view_count > 0 && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-orange">
                  {formatViewCount(video.view_count)}
                </p>
              )}
              {video.description && (
                <p className="mt-1 line-clamp-2 text-sm text-navy/65">{video.description}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
