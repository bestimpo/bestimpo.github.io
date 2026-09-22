import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Fades and lifts children in the first time they scroll into view.
 *
 * Fails open on purpose: this wraps real page content, so anything that stops
 * the observer from firing — reduced-motion, a missing IntersectionObserver,
 * a prerenderer, a screenshot tool — must still leave the content visible.
 * Hence the immediate rect check and the safety timer.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!node || reduceMotion || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    // Already on screen at mount — reveal without waiting for a scroll event.
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)

    // Last resort: never leave content hidden.
    const failOpen = window.setTimeout(() => setShown(true), 2500)

    return () => {
      observer.disconnect()
      window.clearTimeout(failOpen)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
