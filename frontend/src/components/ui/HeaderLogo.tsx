interface HeaderLogoProps {
  compact?: boolean
}

export function HeaderLogo({ compact = false }: HeaderLogoProps) {
  return (
    <div className={compact ? 'flex items-center gap-2.5' : 'flex items-center gap-3 md:gap-4 lg:gap-5'}>
      <div
        className={
          compact
            ? 'font-logo text-[1.65rem] leading-none tracking-tight'
            : 'font-logo text-[1.75rem] leading-none tracking-tight sm:text-[2.1rem] md:text-[2.35rem] lg:text-[2.55rem] xl:text-[2.85rem]'
        }
        aria-label="Art!"
      >
        <span className="text-orange">A</span>
        <span className="text-orange">r</span>
        <span className="text-teal">t</span>
        <span className="text-navy">!</span>
      </div>

      {!compact && (
        <>
          <span className="hidden h-10 w-px shrink-0 bg-navy/20 sm:block lg:h-12" aria-hidden="true" />

          <div className="hidden leading-none sm:block">
            <p className="text-xs font-extrabold tracking-[0.06em] text-navy md:text-[14px] lg:text-[15px] xl:text-base">
              BONCATO
            </p>
            <p className="mt-1 text-[10px] font-medium tracking-[0.14em] text-navy/70 md:text-[10px] lg:text-[11px] xl:text-xs">
              TOURISM CONSULTANCY
            </p>
          </div>
        </>
      )}
    </div>
  )
}
