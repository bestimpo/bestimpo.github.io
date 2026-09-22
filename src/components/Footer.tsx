import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { site } from '@/data/site'
import { categories } from '@/data/categories'
import logo from '@/assets/logo.png'

// lucide dropped brand glyphs, so the socials are inline paths.
const socials = [
  {
    href: site.social.facebook,
    label: 'Facebook',
    path: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z',
  },
  {
    href: site.social.instagram,
    label: 'Instagram',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.84-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z',
  },
  {
    href: site.social.youtube,
    label: 'YouTube',
    path: 'M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42A2.51 2.51 0 0 0 2.42 7.2C2 8.75 2 12 2 12s0 3.25.42 4.81a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM9.94 15.02V8.98L15.2 12l-5.26 3.02Z',
  },
  {
    href: site.social.x,
    label: 'X',
    path: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.64l-5.2-6.81-5.96 6.81H1.71l7.49-8.56L1.05 2.25h6.81l4.89 6.46 5.49-6.46Zm-1.16 17.52h1.83L6.99 4.13H5.02l12.06 15.64Z',
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-brand-950">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={logo} alt={site.name} className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">
            {site.description}
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-brand-200 transition-colors hover:border-brand-400/60 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="text-brand-200/80 transition-colors hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="text-brand-200/80 hover:text-white">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-brand-200/80 hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-brand-200/80 hover:text-white">
                All products
              </Link>
            </li>
            <li>
              <a href={`https://wa.me/${site.whatsapp}`} className="text-brand-200/80 hover:text-white">
                WhatsApp order
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Reach us</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-200/80">
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              <span>{site.address}</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-brand-300/60">{site.hours}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-brand-300/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>{site.domain}</p>
        </div>
      </div>
    </footer>
  )
}
