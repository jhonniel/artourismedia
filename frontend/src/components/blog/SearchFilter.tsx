import { cn } from '@/lib/utils'
import type { PostCategory } from '@/types'

interface SearchFilterProps {
  search: string
  category: string
  categories: PostCategory[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSubmit: () => void
  onClear?: () => void
  hasActiveFilters?: boolean
}

export function SearchFilter({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
  onSubmit,
  onClear,
  hasActiveFilters = false,
}: SearchFilterProps) {
  const handleCategorySelect = (slug: string) => {
    onCategoryChange(slug)
  }

  return (
    <div className="rounded-[1.5rem] border border-navy/8 bg-white p-4 shadow-soft sm:p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6"
      >
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <label htmlFor="insights-search" className="sr-only">
            Search insights
          </label>
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/35"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm6.3 2.1-3.8-3.8"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            id="insights-search"
            type="search"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-navy/10 bg-cream/30 py-3 pl-11 pr-4 text-sm text-navy placeholder:text-navy/40 transition-colors focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategorySelect('')}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors',
              category === ''
                ? 'bg-navy text-white shadow-soft'
                : 'bg-cream/60 text-navy/70 hover:bg-cream hover:text-navy',
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.uuid}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors',
                category === cat.slug
                  ? 'bg-navy text-white shadow-soft'
                  : 'bg-cream/60 text-navy/70 hover:bg-cream hover:text-navy',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </form>

      {hasActiveFilters && onClear && (
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-navy/8 pt-4">
          <p className="text-sm text-navy/55">Filters applied</p>
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-teal transition-colors hover:text-teal/80"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
