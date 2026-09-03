import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { PostCategory } from '@/types'

interface SearchFilterProps {
  search: string
  category: string
  categories: PostCategory[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSubmit: () => void
}

export function SearchFilter({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
  onSubmit,
}: SearchFilterProps) {
  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((cat) => ({ value: cat.slug, label: cat.name })),
  ]

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <Input
          label="Search"
          type="search"
          placeholder="Search insights…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="sm:w-56">
        <Select
          label="Category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
        />
      </div>
      <Button type="submit" variant="primary" className="w-full sm:mb-0 sm:w-auto">
        Search
      </Button>
    </form>
  )
}
