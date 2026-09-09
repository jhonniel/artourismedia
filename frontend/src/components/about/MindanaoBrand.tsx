import { cn } from '@/lib/utils'

interface MindanaoBrandProps {
  className?: string
  size?: 'default' | 'compact'
  centeredOnMobile?: boolean
}

export function MindanaoBrand({ className, size = 'default', centeredOnMobile = false }: MindanaoBrandProps) {
  const compact = size === 'compact'
  const textAlign = centeredOnMobile ? 'text-center lg:text-right' : 'text-right'
  const taglineAlign = centeredOnMobile ? 'justify-center lg:justify-end' : 'justify-end'

  return (
    <div className={cn('w-fit max-w-full', textAlign, className)}>
      <p
        className={cn(
          'font-display leading-[0.88] text-navy',
          compact ? 'text-[2.35rem] sm:text-[2.75rem]' : 'text-[3rem] sm:text-[3.5rem] xl:text-[4.25rem]',
        )}
      >
        Mindanao
      </p>

      <p
        className={cn(
          'mt-3 flex flex-nowrap items-center gap-x-1 font-bold uppercase text-navy sm:gap-x-1.5',
          taglineAlign,
          compact
            ? 'text-[7px] tracking-[0.08em] sm:text-[8px] sm:tracking-[0.12em]'
            : 'text-[8px] tracking-[0.1em] sm:text-[9px] sm:tracking-[0.14em] lg:text-[10px] lg:tracking-[0.18em] xl:text-[11px] xl:tracking-[0.2em]',
        )}
      >
        <span className="relative inline-block shrink-0 pb-1.5">
          People
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-orange" aria-hidden="true" />
        </span>
        <span className="shrink-0 text-[7px] text-orange sm:text-[8px]" aria-hidden="true">
          ◆
        </span>
        <span className="shrink-0">Places</span>
        <span className="shrink-0 text-[7px] text-orange sm:text-[8px]" aria-hidden="true">
          ◆
        </span>
        <span className="shrink-0">Possibilities</span>
      </p>
    </div>
  )
}
