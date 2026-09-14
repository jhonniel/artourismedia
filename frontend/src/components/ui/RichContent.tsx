import { useMemo } from 'react'
import { rewriteContentAssetUrls } from '@/lib/assets'
import { cn } from '@/lib/utils'

interface RichContentProps {
  html: string
  className?: string
}

/** CMS HTML with production-safe `/images/` URLs rewritten to CDN when configured. */
export function RichContent({ html, className }: RichContentProps) {
  const content = useMemo(() => rewriteContentAssetUrls(html), [html])

  return <div className={cn(className)} dangerouslySetInnerHTML={{ __html: content }} />
}
