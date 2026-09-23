import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'
import { assetUrl } from '@/lib/format'

type Props = {
  images: string[]
  alt: string
  /** Resets the gallery when the visitor moves to a different product. */
  resetKey: string
  /** Rendered over the top-left of the main image, e.g. the discount badge. */
  overlay?: React.ReactNode
}

export function ProductGallery({ images, alt, resetKey, overlay }: Props) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const total = images.length
  const hasMultiple = total > 1

  // Navigating from a related product keeps this component mounted, so the
  // index has to follow the product or it could point past the new array.
  useEffect(() => {
    setIndex(0)
    setZoomed(false)
  }, [resetKey])

  const go = useCallback(
    (delta: number) => setIndex((current) => (current + delta + total) % total),
    [total],
  )

  // Arrow keys drive the gallery, Escape leaves the zoom view.
  useEffect(() => {
    if (!hasMultiple && !zoomed) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && hasMultiple) go(1)
      else if (event.key === 'ArrowLeft' && hasMultiple) go(-1)
      else if (event.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, hasMultiple, zoomed])

  useEffect(() => {
    if (!zoomed) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [zoomed])

  const current = images[index] ?? images[0] ?? ''

  return (
    <div>
      <div className="card-surface group relative overflow-hidden">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          title={t('gallery.zoomHint')}
          aria-label={t('gallery.openZoom')}
          className="block w-full cursor-zoom-in"
        >
          <img
            src={assetUrl(current)}
            alt={alt}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </button>

        {overlay}

        <span className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-brand-950/75 p-2 text-brand-100 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Expand className="size-4" aria-hidden="true" />
        </span>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t('gallery.previous')}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-white/15 bg-brand-950/70 p-2.5 text-white backdrop-blur transition-all hover:bg-brand-950 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t('gallery.next')}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-white/15 bg-brand-950/70 p-2.5 text-white backdrop-blur transition-all hover:bg-brand-950 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-950/75 px-3 py-1 text-xs font-semibold text-brand-100 backdrop-blur">
              {t('gallery.counter', { current: index + 1, total })}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((image, thumbIndex) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(thumbIndex)}
              aria-label={t('gallery.viewImage', { index: thumbIndex + 1 })}
              aria-current={thumbIndex === index}
              className={`size-20 overflow-hidden rounded-xl border transition-all ${
                thumbIndex === index
                  ? 'border-brand-400 ring-2 ring-brand-400/30'
                  : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={assetUrl(image)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Full-size view */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-brand-950/95 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label={t('gallery.closeZoom')}
            className="absolute top-4 right-4 rounded-full border border-white/15 bg-white/10 p-2.5 text-white hover:bg-white/20"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <img
            src={assetUrl(current)}
            alt={alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85dvh] w-auto max-w-full rounded-2xl object-contain"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  go(-1)
                }}
                aria-label={t('gallery.previous')}
                className="absolute left-4 rounded-full border border-white/15 bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  go(1)
                }}
                aria-label={t('gallery.next')}
                className="absolute right-4 rounded-full border border-white/15 bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white">
                {t('gallery.counter', { current: index + 1, total })}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
