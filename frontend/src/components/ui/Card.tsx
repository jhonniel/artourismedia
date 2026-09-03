import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className, hover = false, padding = 'md', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white shadow-card border border-navy/5 overflow-hidden',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-teal/20',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
