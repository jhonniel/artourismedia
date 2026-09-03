import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'orange'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  asChild?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-teal text-white hover:bg-teal/90 shadow-soft',
  secondary: 'bg-navy text-white hover:bg-navy/90 shadow-soft',
  outline: 'border-2 border-navy/15 text-navy hover:border-teal hover:text-teal bg-white/60',
  ghost: 'text-navy hover:bg-navy/5',
  orange: 'bg-orange text-white hover:bg-orange/90 shadow-soft',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-full',
  md: 'px-6 py-3 text-sm rounded-full',
  lg: 'px-8 py-4 text-base rounded-full',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
