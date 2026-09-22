import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageX, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { hasDiscount, salePrice } from '@/lib/format'
import type { CategorySlug } from '@/types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating'

const sortLabels: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  discount: 'Biggest discount',
  rating: 'Top rated',
}

export function Shop() {
  const [params, setParams] = useSearchParams()

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
      const haystack = `${product.name} ${product.brand} ${product.shortDescription} ${product.category}`
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
        <p className="text-xs font-semibold tracking-wider text-brand-300 uppercase">Shop</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          {activeCategory ? activeCategory.name : 'All gadgets'}
        </h1>
        <p className="mt-2 text-brand-200/75">
          {activeCategory?.blurb ?? 'Everything we currently stock, newest shelves first.'}
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
          All
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
            {item.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-white/10 py-4">
        <p className="flex items-center gap-2 text-sm text-brand-200">
          <SlidersHorizontal className="size-4 text-brand-400" aria-hidden="true" />
          <span>
            <strong className="text-white">{visible.length}</strong>{' '}
            {visible.length === 1 ? 'product' : 'products'}
          </span>
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
          In stock only
        </label>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-brand-200">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => update('sort', event.target.value)}
            className="field w-auto py-2"
          >
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <option key={key} value={key} className="bg-brand-950">
                {sortLabels[key]}
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
            <h2 className="text-lg font-bold text-white">Nothing matches that</h2>
            <p className="mt-1 text-sm text-brand-200/75">
              Try a wider category, or clear the filters.
            </p>
          </div>
          <button type="button" onClick={() => setParams(new URLSearchParams())} className="btn-ghost">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {visible.some(hasDiscount) && (
        <p className="mt-8 text-xs text-brand-300/60">
          Struck-through prices are the regular list price. Discounts are set per product in the
          catalog.
        </p>
      )}
    </div>
  )
}
