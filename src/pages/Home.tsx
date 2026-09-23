import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { site } from '@/data/site'
import { useLanguage } from '@/i18n/LanguageContext'
import { localizeProduct } from '@/i18n/product'
import { assetUrl, hasDiscount, salePrice } from '@/lib/format'
import type { TranslationKey } from '@/i18n/en'

const perks: { icon: typeof Truck; title: TranslationKey; copy: TranslationKey }[] = [
  { icon: Truck, title: 'home.perkShippingTitle', copy: 'home.perkShippingCopy' },
  { icon: ShieldCheck, title: 'home.perkWarrantyTitle', copy: 'home.perkWarrantyCopy' },
  { icon: RotateCcw, title: 'home.perkReturnsTitle', copy: 'home.perkReturnsCopy' },
  { icon: Zap, title: 'home.perkDispatchTitle', copy: 'home.perkDispatchCopy' },
]

export function Home() {
  const { t, lang, formatPrice, formatNumber, formatDecimal } = useLanguage()

  const featured = products.filter((product) => product.featured)
  const deals = products
    .filter((product) => hasDiscount(product) && product.stock > 0)
    .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
    .slice(0, 4)
  const topDeal = deals[0]
  const topDealShown = topDeal ? localizeProduct(topDeal, lang) : undefined

  return (
    <>
      {/* Hero */}
      <section className="glow-grid relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-32 size-[520px] rounded-full bg-brand-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-52 -left-32 size-[460px] rounded-full bg-neon-500/15 blur-3xl"
        />

        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3.5 py-1.5 text-xs font-semibold text-brand-200">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {t('home.badge')}
            </span>
            <h1 className="mt-5 text-4xl leading-[1.15] font-extrabold text-white sm:text-5xl lg:text-6xl">
              {t('home.titleLead')}{' '}
              <span className="bg-linear-to-r from-brand-300 via-brand-400 to-neon-400 bg-clip-text text-transparent">
                {t('home.titleAccent')}
              </span>{' '}
              {t('home.titleTail')}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-200/85 sm:text-lg">
              {t('home.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                {t('home.ctaShop')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/shop?sort=discount" className="btn-ghost">
                {t('home.ctaDeals')}
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-xs tracking-wide text-brand-300 uppercase">
                  {t('home.statProducts')}
                </dt>
                <dd className="font-display text-2xl font-bold text-white">
                  {formatNumber(products.length)}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-brand-300 uppercase">
                  {t('home.statCategories')}
                </dt>
                <dd className="font-display text-2xl font-bold text-white">
                  {formatNumber(categories.length)}
                </dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-brand-300 uppercase">
                  {t('home.statRating')}
                </dt>
                <dd className="font-display text-2xl font-bold text-white">{formatDecimal(4.6)}★</dd>
              </div>
            </dl>
          </div>

          {topDeal && topDealShown && (
            <div className="relative">
              <div className="animate-float card-surface relative overflow-hidden p-4 shadow-glow">
                <img
                  src={assetUrl(topDeal.images[0] ?? '')}
                  alt={topDealShown.name}
                  className="aspect-4/3 w-full rounded-xl object-cover"
                />
                <div className="mt-4 flex items-end justify-between gap-4 px-1 pb-1">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-accent-500 uppercase">
                      {t('home.dealOfTheWeek')}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-white">{topDealShown.name}</h2>
                    <p className="mt-1 flex flex-wrap items-baseline gap-2">
                      <span className="font-display text-2xl font-bold text-white">
                        {formatPrice(salePrice(topDeal))}
                      </span>
                      <span className="text-sm text-brand-300/70 line-through">
                        {formatPrice(topDeal.price)}
                      </span>
                    </p>
                  </div>
                  <Link to={`/product/${topDeal.id}`} className="btn-primary shrink-0">
                    {t('common.view')}
                  </Link>
                </div>
                <span className="absolute top-6 right-6 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-brand-950">
                  -{formatNumber(topDeal.discountPercent ?? 0)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Perks */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-start gap-3">
              <div className="rounded-xl bg-brand-500/15 p-2.5 text-brand-300">
                <perk.icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t(perk.title)}</p>
                <p className="text-xs text-brand-200/70">
                  {t(perk.copy, { amount: formatPrice(site.freeShippingThreshold) })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t('home.categoriesTitle')}
              </h2>
              <p className="mt-2 text-brand-200/75">{t('home.categoriesSub')}</p>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-brand-300 hover:text-white">
              {t('home.browseEverything')} →
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 60}>
              <Link
                to={`/shop?category=${category.slug}`}
                className="group card-surface flex h-full items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-glow"
              >
                <div className="rounded-xl bg-linear-to-br from-brand-500/25 to-neon-500/20 p-3 text-brand-200 transition-colors group-hover:text-white">
                  <CategoryIcon icon={category.icon} className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {t(`categories.${category.slug}` as TranslationKey)}
                  </h3>
                  <p className="mt-1 text-sm text-brand-200/70">
                    {t(`categoryBlurbs.${category.slug}` as TranslationKey)}
                  </p>
                </div>
                <ArrowRight
                  className="ml-auto size-4 shrink-0 text-brand-400 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page pb-16 lg:pb-20">
        <Reveal>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('home.featuredTitle')}</h2>
          <p className="mt-2 text-brand-200/75">{t('home.featuredSub')}</p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Deals */}
      {deals.length > 0 && (
        <section className="container-page pb-16 lg:pb-20">
          <Reveal>
            <div className="card-surface overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-linear-to-r from-accent-500/15 to-transparent px-6 py-5">
                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {t('home.dealsTitle')}
                  </h2>
                  <p className="mt-1 text-sm text-brand-200/75">{t('home.dealsSub')}</p>
                </div>
                <Link to="/shop?sort=discount" className="btn-ghost">
                  {t('home.allDeals')}
                </Link>
              </div>
              <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
                {deals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <section className="container-page pb-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-brand-800 via-brand-900 to-brand-950 px-6 py-12 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t('home.ctaTitle')}</h2>
              <p className="mx-auto mt-3 max-w-xl text-brand-200/80">{t('home.ctaSub')}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  {t('home.ctaAsk')}
                </Link>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-ghost"
                >
                  {t('home.ctaWhatsapp')}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
