import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  size?: 'default' | 'narrow' | 'wide'
}

const sizes = {
  default: 'max-w-[90rem]',
  narrow: 'max-w-4xl',
  wide: 'max-w-[100rem]',
}

export function Container({ children, className, size = 'default', ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10', sizes[size], className)} {...props}>
      {children}
    </div>
  )
}
