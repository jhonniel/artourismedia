import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll position when navigating between pages. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
