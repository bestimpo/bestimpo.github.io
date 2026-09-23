import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { localizeProduct } from '@/i18n/product'
import { assetUrl, hasDiscount, salePrice } from '@/lib/format'
import type { Product } from '@/types'

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const { t, lang, formatPrice, formatNumber } = useLanguage()
  const shown = localizeProduct(product, lang)
  const soldOut = product.stock <= 0
  const price = salePrice(product)

  return (
    <article className="group card-surface relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-glow">
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-4/3 overflow-hidden bg-brand-900/60"
      >
        <img
          src={assetUrl(product.images[0] ?? '')}
          alt={shown.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-col gap-1.5">
            {hasDiscount(product) && (
              <span className="rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-bold text-brand-950 shadow-lg">
                -{formatNumber(product.discountPercent ?? 0)}%
              </span>
            )}
            {shown.badge && (
              <span className="rounded-full bg-brand-950/80 px-2.5 py-1 text-[11px] font-semibold text-brand-100 backdrop-blur">
                {shown.badge}
              </span>
            )}
          </div>
          {soldOut && (
            <span className="rounded-full bg-brand-950/85 px-2.5 py-1 text-[11px] font-semibold text-brand-200 backdrop-blur">
              {t('common.soldOut')}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold tracking-wider text-brand-300 uppercase">
          {shown.brand}
        </p>
        <h3 className="mt-1 text-base leading-snug font-semibold text-white">
          <Link to={`/product/${product.id}`} className="hover:text-brand-200">
            {shown.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-brand-200/80">{shown.shortDescription}</p>

        {product.rating !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-200">
            <Star className="size-3.5 fill-accent-500 text-accent-500" aria-hidden="true" />
            <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-brand-300/70">({formatNumber(product.reviewCount ?? 0)})</span>
          </div>
        )}

        <div className="mt-4 flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-xl font-bold text-white">{formatPrice(price)}</p>
            {hasDiscount(product) && (
              <p className="text-sm text-brand-300/70 line-through">{formatPrice(product.price)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => add(product.id)}
            disabled={soldOut}
            aria-label={`${soldOut ? t('common.soldOut') : t('product.addToCart')} — ${shown.name}`}
            className="btn-primary px-3.5 py-2.5"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">
              {soldOut ? t('common.soldOut') : t('common.add')}
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}
