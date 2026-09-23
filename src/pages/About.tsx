import { Link } from 'react-router-dom'
import { BadgeCheck, Compass, Handshake, Wrench } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { useLanguage } from '@/i18n/LanguageContext'
import type { TranslationKey } from '@/i18n/en'

const principles: { icon: typeof Wrench; title: TranslationKey; copy: TranslationKey }[] = [
  { icon: Wrench, title: 'about.p1Title', copy: 'about.p1Copy' },
  { icon: BadgeCheck, title: 'about.p2Title', copy: 'about.p2Copy' },
  { icon: Handshake, title: 'about.p3Title', copy: 'about.p3Copy' },
  { icon: Compass, title: 'about.p4Title', copy: 'about.p4Copy' },
]

const steps: { title: TranslationKey; copy: TranslationKey }[] = [
  { title: 'about.step1Title', copy: 'about.step1Copy' },
  { title: 'about.step2Title', copy: 'about.step2Copy' },
  { title: 'about.step3Title', copy: 'about.step3Copy' },
]

export function About() {
  const { t, formatNumber } = useLanguage()

  return (
    <div className="container-page py-12 lg:py-16">
      <Reveal>
        <p className="text-xs font-semibold tracking-wider text-brand-300 uppercase">{t('about.eyebrow')}</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          {t('about.title')}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-200/85">{t('home.subtitle')}</p>
      </Reveal>

      <Reveal delay={80}>
        <dl className="mt-12 grid gap-6 border-y border-white/10 py-8 sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-wide text-brand-300 uppercase">{t('about.statProducts')}</dt>
            <dd className="font-display mt-1 text-3xl font-bold text-white">{formatNumber(products.length)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-brand-300 uppercase">{t('about.statCategories')}</dt>
            <dd className="font-display mt-1 text-3xl font-bold text-white">{formatNumber(categories.length)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-brand-300 uppercase">{t('about.statDispatch')}</dt>
            <dd className="font-display mt-1 text-3xl font-bold text-white">{t('about.statDispatchValue')}</dd>
          </div>
        </dl>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {principles.map((principle, index) => (
          <Reveal key={principle.title} delay={index * 70}>
            <div className="card-surface h-full p-6">
              <div className="w-fit rounded-xl bg-brand-500/15 p-3 text-brand-300">
                <principle.icon className="size-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">{t(principle.title)}</h2>
              <p className="mt-2 leading-relaxed text-brand-200/80">{t(principle.copy)}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 rounded-3xl border border-white/10 bg-linear-to-br from-brand-800 via-brand-900 to-brand-950 px-6 py-10 sm:px-10">
          <h2 className="text-2xl font-bold text-white">{t('about.howTitle')}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="font-display flex size-9 items-center justify-center rounded-full bg-brand-500 font-bold text-brand-950">
                  {formatNumber(index + 1)}
                </span>
                <h3 className="mt-3 font-semibold text-white">{t(step.title)}</h3>
                <p className="mt-1.5 text-sm text-brand-200/80">{t(step.copy)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              {t('about.startShopping')}
            </Link>
            <Link to="/contact" className="btn-ghost">
              {t('about.askQuestion')}
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
