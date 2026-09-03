import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ message = 'Unable to load content.', onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn('rounded-3xl border border-orange/20 bg-orange/5 p-8 text-center', className)}>
      <p className="text-navy font-medium">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
