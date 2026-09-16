import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SearchFilter } from '@/components/blog/SearchFilter'
import { PostList } from '@/components/blog/PostList'
import { usePosts, usePostCategories } from '@/hooks'

export default function Insights() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState({ search: '', category: '' })

  const { data: categories } = usePostCategories()
  const { data, isLoading, isError, refetch } = usePosts({
    page,
    per_page: 9,
    search: query.search || undefined,
    category: query.category || undefined,
  })

  const hasActiveFilters = Boolean(query.search || query.category)
  const showLead = page === 1 && !hasActiveFilters

  const applyFilters = (next: { search?: string; category?: string }) => {
    const nextSearch = next.search ?? search
    const nextCategory = next.category ?? category
    setSearch(nextSearch)
    setCategory(nextCategory)
    setPage(1)
    setQuery({ search: nextSearch, category: nextCategory })
  }

  const handleSearch = () => applyFilters({})

  const handleCategoryChange = (value: string) => applyFilters({ category: value })

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setPage(1)
    setQuery({ search: '', category: '' })
  }

  return (
    <>
      <SEO title="Insights" description="Latest insights on tourism development and destination strategy." />
      <section className="bg-cream py-14 md:py-20 lg:py-24">
        <Container className="max-w-6xl">
          <FadeIn>
            <SectionHeading
              eyebrow="Latest Insights"
              title="Thought leadership for"
              accent="destination builders"
              description="Strategy, marketing, and media insights for sustainable tourism growth."
              align="center"
              tone="landing"
              className="mb-8 md:mb-10"
            />
          </FadeIn>

          <FadeIn delay={80}>
            <SearchFilter
              search={search}
              category={category}
              categories={categories ?? []}
              onSearchChange={setSearch}
              onCategoryChange={handleCategoryChange}
              onSubmit={handleSearch}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
              resultCount={data && !isLoading ? data.meta.total : undefined}
              showingCount={data && !isLoading ? data.items.length : undefined}
            />
          </FadeIn>

          <div className="mt-10 md:mt-12">
            <PostList
              posts={data?.items ?? []}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
              layout="magazine"
              showLead={showLead}
            />
          </div>

          {data && data.meta.last_page > 1 && (
            <nav
              aria-label="Insights pagination"
              className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-navy/10 pt-10 sm:flex-row"
            >
              <p className="text-sm text-navy/50">
                Page {data.meta.current_page} of {data.meta.last_page}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </nav>
          )}
        </Container>
      </section>
    </>
  )
}
