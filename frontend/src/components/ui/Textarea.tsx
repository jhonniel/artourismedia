import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-navy">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full min-h-[140px] resize-y rounded-2xl border border-navy/10 bg-white px-4 py-3 text-navy',
            'placeholder:text-navy/40 transition-colors duration-200',
            'focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20',
            error && 'border-orange focus:border-orange focus:ring-orange/20',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-orange">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
