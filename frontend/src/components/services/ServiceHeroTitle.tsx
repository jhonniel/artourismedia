interface ServiceHeroTitleProps {
  title: string
}

export function ServiceHeroTitle({ title }: ServiceHeroTitleProps) {
  const titleClassName =
    'service-detail-hero__title mt-4 text-[1.875rem] font-bold leading-[1.1] tracking-[-0.01em] text-navy sm:text-[2.125rem] lg:text-[2.375rem] xl:text-[2.625rem]'

  const andBreak = title.match(/^(.+\band)\s+(\S.+)$/i)

  if (andBreak) {
    const [, lineOne, lineTwo] = andBreak

    return (
      <h1 className={titleClassName}>
        <span className="block">{lineOne.trim()}</span>
        <span className="block">{lineTwo.trim()}</span>
      </h1>
    )
  }

  return <h1 className={titleClassName}>{title}</h1>
}
