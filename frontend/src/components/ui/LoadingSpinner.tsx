import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)} role="status">
      <div
        className={cn(
          'animate-spin rounded-full border-teal/20 border-t-teal',
          sizes[size],
        )}
        aria-label="Loading"
      />
    </div>
  )
}
