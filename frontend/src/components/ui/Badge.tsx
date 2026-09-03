import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'teal' | 'orange' | 'purple' | 'navy' | 'cream'
}

const variants = {
  teal: 'bg-teal/10 text-teal',
  orange: 'bg-orange/10 text-orange',
  purple: 'bg-purple/10 text-purple',
  navy: 'bg-navy/10 text-navy',
  cream: 'bg-cream text-navy border border-navy/10',
}

export function Badge({ children, variant = 'teal', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
