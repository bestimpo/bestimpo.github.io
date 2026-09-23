import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { ProductGallery } from '@/components/ProductGallery'
import { useCart } from '@/context/CartContext'
import { categoryBySlug } from '@/data/categories'
import { productById, products } from '@/data/products'
import { site } from '@/data/site'
import { useLanguage } from '@/i18n/LanguageContext'
import { localizeProduct } from '@/i18n/product'
import { hasDiscount, salePrice, savingsAmount } from '@/lib/format'
import { NotFound } from '@/pages/NotFound'
import type { TranslationKey } from '@/i18n/en'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = id ? productById.get(id) : undefined
  const { add } = useCart()
  const { t, lang, formatPrice, formatNumber, specLabel } = useLanguage()
  const [quantity, setQuantity] = useState(1)

  // Related-product links keep this component mounted, so the quantity has to
  // follow the product rather than carry over from the previous one.
  useEffect(() => {
    setQuantity(1)
  }, [id])

  if (!product) return <NotFound />

  const shown = localizeProduct(product, lang)
  const price = salePrice(product)
  const soldOut = product.stock <= 0
  const category = categoryBySlug.get(product.category)
  const categoryName = category ? t(`categories.${category.slug}` as TranslationKey) : ''
  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4)

  return (
    <div className="container-page py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-sm text-brand-300">
        <Link to="/shop" className="inline-flex items-center gap-1.5 hover:text-white">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('nav.shop')}
        </Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/shop?category=${category.slug}`} className="hover:text-white">
              {categoryName}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          alt={shown.name}
          resetKey={product.id}
          overlay={
            hasDiscount(product) ? (
              <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-accent-500 px-3 py-1.5 text-sm font-bold text-brand-950">
                {t('product.offBadge', { percent: formatNumber(product.discountPercent ?? 0) })}
              </span>
            ) : undefined
          }
        />

        {/* Buy box */}
        <div>
          <p className="text-xs font-semibold tracking-wider text-brand-300 uppercase">
            {shown.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{shown.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            {product.rating !== undefined && (
              <span className="flex items-center gap-1.5 text-sm">
                <Star className="size-4 fill-accent-500 text-accent-500" aria-hidden="true" />
                <strong className="text-white">{product.rating.toFixed(1)}</strong>
                <span className="text-brand-300">
                  ({t('common.reviews', { count: formatNumber(product.reviewCount ?? 0) })})
                </span>
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                soldOut
                  ? 'bg-red-500/15 text-red-300'
                  : product.stock <= 10
                    ? 'bg-accent-500/15 text-accent-400'
                    : 'bg-neon-500/15 text-neon-400'
              }`}
            >
              {soldOut
                ? t('common.soldOut')
                : product.stock <= 10
                  ? t('common.onlyLeft', { count: formatNumber(product.stock) })
                  : t('common.inStock')}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-white">
              {formatPrice(price)}
            </span>
            {hasDiscount(product) && (
              <>
                <span className="text-lg text-brand-300/70 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-semibold text-neon-400">
                  {t('product.youSave', { amount: formatPrice(savingsAmount(product)) })}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-brand-200/85">{shown.description}</p>

          <ul className="mt-6 space-y-2.5">
            {shown.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5 text-sm text-brand-100">
                <Check className="mt-0.5 size-4 shrink-0 text-neon-400" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>

          {/* Quantity + add */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-white/15 bg-white/5">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                disabled={soldOut || quantity <= 1}
                className="px-3.5 py-3 text-brand-200 hover:text-white disabled:opacity-40"
                aria-label={t('product.decreaseQty')}
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-10 text-center font-semibold text-white">
                {formatNumber(quantity)}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                disabled={soldOut || quantity >= product.stock}
                className="px-3.5 py-3 text-brand-200 hover:text-white disabled:opacity-40"
                aria-label={t('product.increaseQty')}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => add(product.id, quantity)}
              disabled={soldOut}
              className="btn-primary flex-1 sm:flex-none sm:px-8"
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              {soldOut ? t('common.soldOut') : t('product.addToCart')}
            </button>
          </div>

          {/* Assurances */}
          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            <p className="flex items-start gap-2.5 text-xs text-brand-200/80">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              {t('product.freeShippingOver', { amount: formatPrice(site.freeShippingThreshold) })}
            </p>
            <p className="flex items-start gap-2.5 text-xs text-brand-200/80">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              {t('product.warrantyMonths', { value: shown.specs.Warranty ?? '12 months' })}
            </p>
            <p className="flex items-start gap-2.5 text-xs text-brand-200/80">
              <RotateCcw className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              {t('product.returnWindow')}
            </p>
          </div>
        </div>
      </div>

      {/* Specs */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-white sm:text-2xl">{t('product.specifications')}</h2>
        <dl className="card-surface mt-5 divide-y divide-white/5">
          {Object.entries(shown.specs).map(([key, value]) => (
            <div key={key} className="grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-semibold text-brand-200">{specLabel(key)}</dt>
              <dd className="text-sm text-white sm:col-span-2">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            {t('product.moreIn', { category: categoryName })}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
