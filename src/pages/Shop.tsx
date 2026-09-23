import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageX, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { useLanguage } from '@/i18n/LanguageContext'
import { localizeProduct } from '@/i18n/product'
import { hasDiscount, salePrice } from '@/lib/format'
import type { TranslationKey } from '@/i18n/en'
import type { CategorySlug } from '@/types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating'

const sortKeys: { value: SortKey; label: TranslationKey }[] = [
  { value: 'featured', label: 'shop.sortFeatured' },
  { value: 'price-asc', label: 'shop.sortPriceAsc' },
  { value: 'price-desc', label: 'shop.sortPriceDesc' },
  { value: 'discount', label: 'shop.sortDiscount' },
  { value: 'rating', label: 'shop.sortRating' },
]

export function Shop() {
  const [params, setParams] = useSearchParams()
  const { t, lang, formatNumber } = useLanguage()

  const query = params.get('q')?.trim().toLowerCase() ?? ''
  const category = (params.get('category') ?? 'all') as CategorySlug | 'all'
  const sort = (params.get('sort') ?? 'featured') as SortKey
  const inStockOnly = params.get('stock') === 'in'

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value === '' || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const filtered = products.filter((product) => {
      if (category !== 'all' && product.category !== category) return false
      if (inStockOnly && product.stock <= 0) return false
      if (!query) return true
      // Search both languages, so a Bengali term finds an English-only entry too.
      const translated = localizeProduct(product, 'bn')
      const haystack = [
        product.name,
        product.brand,
        product.shortDescription,
        product.category,
        translated.name,
        translated.shortDescription,
      ].join(' ')
      return haystack.toLowerCase().includes(query)
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => salePrice(a) - salePrice(b))
        break
      case 'price-desc':
        sorted.sort((a, b) => salePrice(b) - salePrice(a))
        break
      case 'discount':
        sorted.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
        break
      case 'rating':
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      default:
        sorted.sort(
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.stock - a.stock,
        )
    }
    return sorted
  }, [category, inStockOnly, query, sort])

  const activeCategory = categories.find((c) => c.slug === category)

  return (
    <div className="container-page py-10 lg:py-14">
      <header>
        <p className="text-xs font-semibold tracking-wider text-brand-300 uppercase">
          {t('shop.eyebrow')}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          {activeCategory
            ? t(`categories.${activeCategory.slug}` as TranslationKey)
            : t('shop.allTitle')}
        </h1>
        <p className="mt-2 text-brand-200/75">
          {activeCategory
            ? t(`categoryBlurbs.${activeCategory.slug}` as TranslationKey)
            : t('shop.allSub')}
        </p>
      </header>

      {/* Category pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update('category', null)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            category === 'all'
              ? 'bg-brand-500 text-brand-950'
              : 'border border-white/10 bg-white/5 text-brand-200 hover:text-white'
          }`}
        >
          {t('shop.all')}
        </button>
        {categories.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => update('category', item.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              category === item.slug
                ? 'bg-brand-500 text-brand-950'
                : 'border border-white/10 bg-white/5 text-brand-200 hover:text-white'
            }`}
          >
            {t(`categories.${item.slug}` as TranslationKey)}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-white/10 py-4">
        <p className="flex items-center gap-2 text-sm text-brand-200">
          <SlidersHorizontal className="size-4 text-brand-400" aria-hidden="true" />
          {t(visible.length === 1 ? 'shop.productCountOne' : 'shop.productCount', {
            count: formatNumber(visible.length),
          })}
        </p>

        {query && (
          <button
            type="button"
            onClick={() => update('q', null)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-brand-200 hover:text-white"
          >
            “{query}” ✕
          </button>
        )}

        <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-200">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => update('stock', event.target.checked ? 'in' : null)}
            className="size-4 rounded border-white/20 bg-brand-950 accent-brand-500"
          />
          {t('shop.inStockOnly')}
        </label>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-brand-200">
            {t('shop.sort')}
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => update('sort', event.target.value)}
            className="field w-auto py-2"
          >
            {sortKeys.map((option) => (
              <option key={option.value} value={option.value} className="bg-brand-950">
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="card-surface mt-10 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <PackageX className="size-10 text-brand-300" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-bold text-white">{t('shop.emptyTitle')}</h2>
            <p className="mt-1 text-sm text-brand-200/75">{t('shop.emptySub')}</p>
          </div>
          <button
            type="button"
            onClick={() => setParams(new URLSearchParams())}
            className="btn-ghost"
          >
            {t('shop.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={`${product.id}-${lang}`} product={product} />
          ))}
        </div>
      )}

      {visible.some(hasDiscount) && (
        <p className="mt-8 text-xs text-brand-300/60">{t('shop.discountNote')}</p>
      )}
    </div>
  )
}
