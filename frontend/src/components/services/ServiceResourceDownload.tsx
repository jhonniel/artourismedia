import { LazyImage } from '@/components/ui/LazyImage'
import type { ServiceResourceDownload as ServiceResourceDownloadType } from '@/types'

interface ServiceResourceDownloadProps {
  resource: ServiceResourceDownloadType
}

export function ServiceResourceDownload({ resource }: ServiceResourceDownloadProps) {
  const coverAlt = `${resource.title}${resource.subtitle ? ` — ${resource.subtitle}` : ''} cover`

  return (
    <section className="rounded-[1.25rem] border border-navy/10 bg-cream/40 p-6 shadow-soft sm:p-7 md:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {resource.thumbnail_url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto shrink-0 transition hover:opacity-95 sm:mx-0"
          >
            <LazyImage
              src={resource.thumbnail_url}
              alt={coverAlt}
              wrapperClassName="aspect-[3/4] w-[10.5rem] overflow-hidden rounded-xl shadow-card ring-1 ring-navy/10 sm:w-[11.5rem]"
              className="size-full object-cover"
            />
          </a>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">{resource.title}</h2>
            {resource.subtitle && (
              <p className="mt-1 text-sm font-medium text-navy/60">{resource.subtitle}</p>
            )}
            {resource.description && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy/70 sm:text-base">
                {resource.description}
              </p>
            )}
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center self-center rounded-full bg-orange px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-orange/90 sm:self-auto"
          >
            Read
          </a>
        </div>
      </div>
    </section>
  )
}
