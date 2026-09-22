import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Route changes should start at the top, not wherever the last page was. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
