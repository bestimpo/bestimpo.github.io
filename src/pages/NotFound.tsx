import { Link } from 'react-router-dom'
import { PackageX } from 'lucide-react'

export function NotFound() {
  return (
    <div className="container-page py-20 lg:py-28">
      <div className="card-surface mx-auto max-w-lg px-6 py-14 text-center">
        <PackageX className="mx-auto size-12 text-brand-300" aria-hidden="true" />
        <h1 className="font-display mt-5 text-4xl font-extrabold text-white">404</h1>
        <p className="mt-2 text-brand-200/85">
          That page — or that product — is not on our shelves.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            Browse the shop
          </Link>
          <Link to="/" className="btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}
