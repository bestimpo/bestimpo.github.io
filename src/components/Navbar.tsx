import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, Search, ShoppingCart, X } from 'lucide-react'
import { LanguageToggle } from '@/components/LanguageToggle'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { site } from '@/data/site'
import logo from '@/assets/logo.png'
import type { TranslationKey } from '@/i18n/en'

const links: { to: string; key: TranslationKey }[] = [
  { to: '/', key: 'nav.home' },
  { to: '/shop', key: 'nav.shop' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

export function Navbar() {
  const { itemCount, openCart } = useCart()
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop')
    setMobileOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-brand-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-page flex h-20 items-center gap-4 sm:h-24">
        <Link to="/" className="shrink-0" aria-label={`${site.name} ${t('nav.home')}`}>
          <img src={logo} alt={site.name} className="h-11 w-auto sm:h-14" />
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-brand-200 hover:text-white'
                }`
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 md:block">
          <label className="sr-only" htmlFor="site-search">
            {t('nav.searchLabel')}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-300"
              aria-hidden="true"
            />
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="field py-2.5 pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <LanguageToggle className="hidden sm:flex" />

          <button
            type="button"
            onClick={openCart}
            className="btn-ghost relative px-3 py-2.5"
            aria-label={t('nav.openCart', { count: itemCount })}
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-brand-950">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="btn-ghost px-3 py-2.5 lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={t('nav.toggleMenu')}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-brand-950/95 backdrop-blur-xl lg:hidden">
          <div className="container-page space-y-3 py-4">
            <form onSubmit={submitSearch} className="md:hidden">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-brand-300"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  aria-label={t('nav.searchLabel')}
                  className="field py-2.5 pl-9"
                />
              </div>
            </form>
            <nav className="grid gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3.5 py-2.5 text-sm font-semibold ${
                      isActive ? 'bg-white/10 text-white' : 'text-brand-200'
                    }`
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </nav>
            <LanguageToggle className="w-fit sm:hidden" />
          </div>
        </div>
      )}
    </header>
  )
}
