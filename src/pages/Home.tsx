import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, ShieldCheck, Sparkles, Truck, Zap } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { site } from '@/data/site'
import { assetUrl, formatPrice, hasDiscount, salePrice } from '@/lib/format'

const perks = [
  { icon: Truck, title: 'Free shipping', copy: `On every order over ${formatPrice(site.freeShippingThreshold)}` },
  { icon: ShieldCheck, title: 'Warranty covered', copy: 'Up to 24 months, handled by us' },
  { icon: RotateCcw, title: '7-day returns', copy: 'Unopened, no questions asked' },
  { icon: Zap, title: 'Same-day dispatch', copy: 'Order before 16:00 local time' },
]

export function Home() {
  const featured = products.filter((product) => product.featured)
  const deals = products
    .filter((product) => hasDiscount(product) && product.stock > 0)
    .sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
    .slice(0, 4)
  const topDeal = deals[0]

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
              New arrivals every week
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold text-white sm:text-5xl lg:text-6xl">
              Gadgets that
              <span className="bg-linear-to-r from-brand-300 via-brand-400 to-neon-400 bg-clip-text text-transparent">
                {' '}
                earn their place
              </span>{' '}
              on your desk.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-200/85 sm:text-lg">
              {site.tagline} We test what we sell — audio, wearables, power and smart home — so the
              spec sheet matches what shows up in the box.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                Shop all gadgets
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/shop?sort=discount" className="btn-ghost">
                See today&apos;s deals
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-xs tracking-wide text-brand-300 uppercase">Products</dt>
                <dd className="font-display text-2xl font-bold text-white">{products.length}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-brand-300 uppercase">Categories</dt>
                <dd className="font-display text-2xl font-bold text-white">{categories.length}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-brand-300 uppercase">Rating</dt>
                <dd className="font-display text-2xl font-bold text-white">4.6★</dd>
              </div>
            </dl>
          </div>

          {topDeal && (
            <div className="relative">
              <div className="animate-float card-surface relative overflow-hidden p-4 shadow-glow">
                <img
                  src={assetUrl(topDeal.images[0] ?? '')}
                  alt={topDeal.name}
                  className="aspect-4/3 w-full rounded-xl object-cover"
                />
                <div className="mt-4 flex items-end justify-between gap-4 px-1 pb-1">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-accent-500 uppercase">
                      Deal of the week
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-white">{topDeal.name}</h2>
                    <p className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-2xl font-bold text-white">
                        {formatPrice(salePrice(topDeal))}
                      </span>
                      <span className="text-sm text-brand-300/70 line-through">
                        {formatPrice(topDeal.price)}
                      </span>
                    </p>
                  </div>
                  <Link to={`/product/${topDeal.id}`} className="btn-primary shrink-0">
                    View
                  </Link>
                </div>
                <span className="absolute top-6 right-6 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-brand-950">
                  -{topDeal.discountPercent}%
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Perks marquee */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-start gap-3">
              <div className="rounded-xl bg-brand-500/15 p-2.5 text-brand-300">
                <perk.icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{perk.title}</p>
                <p className="text-xs text-brand-200/70">{perk.copy}</p>
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
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Shop by category</h2>
              <p className="mt-2 text-brand-200/75">Six shelves, nothing filler on any of them.</p>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-brand-300 hover:text-white">
              Browse everything →
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
                  <h3 className="font-semibold text-white">{category.name}</h3>
                  <p className="mt-1 text-sm text-brand-200/70">{category.blurb}</p>
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
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Featured right now</h2>
          <p className="mt-2 text-brand-200/75">The four we keep recommending in person.</p>
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
                  <h2 className="text-xl font-bold text-white sm:text-2xl">On sale this week</h2>
                  <p className="mt-1 text-sm text-brand-200/75">
                    Discounts are set per product — no fake countdown timers.
                  </p>
                </div>
                <Link to="/shop?sort=discount" className="btn-ghost">
                  All deals
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
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Not sure which one fits your setup?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-brand-200/80">
                Tell us the device, the budget and what annoys you about your current gear. We answer
                with a straight recommendation — usually within a few hours.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  Ask us
                </Link>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-ghost"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
