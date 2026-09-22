import { Link } from 'react-router-dom'
import { BadgeCheck, Compass, Handshake, Wrench } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { site } from '@/data/site'

const principles = [
  {
    icon: Wrench,
    title: 'We use it first',
    copy: 'Every item on the shelf spent at least a week in daily use. If it annoyed us, it does not get listed.',
  },
  {
    icon: BadgeCheck,
    title: 'Specs you can hold us to',
    copy: 'Listed wattage, battery hours and ingress ratings are the measured ones, not the marketing ones.',
  },
  {
    icon: Handshake,
    title: 'Warranty we handle',
    copy: 'A fault inside the warranty window is our problem to chase, not yours.',
  },
  {
    icon: Compass,
    title: 'Honest recommendations',
    copy: 'Ask us and we will tell you when the cheaper option is the right one — or when to buy nothing.',
  },
]

export function About() {
  return (
    <div className="container-page py-12 lg:py-16">
      <Reveal>
        <p className="text-xs font-semibold tracking-wider text-brand-300 uppercase">About</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          A small shop for people who read the spec sheet.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-200/85">{site.description}</p>
      </Reveal>

      <Reveal delay={80}>
        <dl className="mt-12 grid gap-6 border-y border-white/10 py-8 sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-wide text-brand-300 uppercase">Products stocked</dt>
            <dd className="font-display mt-1 text-3xl font-bold text-white">{products.length}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-brand-300 uppercase">Categories</dt>
            <dd className="font-display mt-1 text-3xl font-bold text-white">{categories.length}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-brand-300 uppercase">Dispatch</dt>
            <dd className="font-display mt-1 text-3xl font-bold text-white">Same day</dd>
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
              <h2 className="mt-4 text-lg font-bold text-white">{principle.title}</h2>
              <p className="mt-2 leading-relaxed text-brand-200/80">{principle.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 rounded-3xl border border-white/10 bg-linear-to-br from-brand-800 via-brand-900 to-brand-950 px-6 py-10 sm:px-10">
          <h2 className="text-2xl font-bold text-white">How ordering works</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              ['Pick your gear', 'Add to cart and check out. No account needed, no card taken online.'],
              ['We confirm', 'Your order lands in our inbox. We reply with stock, delivery date and payment details.'],
              ['It ships', 'Dispatch is same-day before 16:00. Warranty claims go through us, not the brand.'],
            ].map(([title, copy], index) => (
              <li key={title}>
                <span className="font-display flex size-9 items-center justify-center rounded-full bg-brand-500 font-bold text-brand-950">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm text-brand-200/80">{copy}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Start shopping
            </Link>
            <Link to="/contact" className="btn-ghost">
              Ask a question
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
