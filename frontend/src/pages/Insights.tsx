import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/ui/SEO'
import { FadeIn } from '@/components/ui/FadeIn'
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

  const handleSearch = () => {
    setPage(1)
    setQuery({ search, category })
  }

  return (
    <>
      <SEO title="Insights" description="Latest insights on tourism development and destination strategy." />
      <Container className="py-16 md:py-24">
        <FadeIn>
          <SectionHeading
            eyebrow="Blog"
            title="Latest"
            accent="Insights"
            description="Thought leadership, trends, and strategies shaping the future of tourism."
            align="center"
          />
        </FadeIn>

        <FadeIn delay={100}>
          <SearchFilter
            search={search}
            category={category}
            categories={categories ?? []}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onSubmit={handleSearch}
          />
        </FadeIn>

        <div className="mt-10">
          <PostList
            posts={data?.items ?? []}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
          />
        </div>

        {data && data.meta.last_page > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-navy/60">
              Page {data.meta.current_page} of {data.meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Container>
    </>
  )
}
