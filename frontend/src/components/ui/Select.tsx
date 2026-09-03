import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-navy">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-2xl border border-navy/10 bg-white px-4 py-3 text-navy',
          'transition-colors duration-200 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20',
          error && 'border-orange',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-orange">{error}</p>}
    </div>
  )
}
