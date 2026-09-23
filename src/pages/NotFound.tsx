import { Link } from 'react-router-dom'
import { PackageX } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageContext'

export function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="container-page py-20 lg:py-28">
      <div className="card-surface mx-auto max-w-lg px-6 py-14 text-center">
        <PackageX className="mx-auto size-12 text-brand-300" aria-hidden="true" />
        <h1 className="font-display mt-5 text-4xl font-extrabold text-white">
          {t('notFound.title')}
        </h1>
        <p className="mt-2 text-brand-200/85">{t('notFound.body')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            {t('common.browseShop')}
          </Link>
          <Link to="/" className="btn-ghost">
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
