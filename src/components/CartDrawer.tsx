import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2, Truck, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { localizeProduct } from '@/i18n/product'
import { site } from '@/data/site'
import { assetUrl } from '@/lib/format'

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, remove, subtotal, savings, shipping, total } =
    useCart()
  const { t, lang, formatPrice, formatNumber } = useLanguage()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  const remainingForFreeShipping = Math.max(0, site.freeShippingThreshold - subtotal)

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-60 bg-brand-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        className={`fixed top-0 right-0 z-70 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-brand-950 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <ShoppingCart className="size-5 text-brand-300" aria-hidden="true" />
            {t('cart.title')}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="btn-ghost px-2.5 py-2"
            aria-label={t('cart.close')}
          >
            <X className="size-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-white/5 p-5">
              <ShoppingCart className="size-8 text-brand-300" aria-hidden="true" />
            </div>
            <p className="text-brand-200">{t('cart.empty')}</p>
            <Link to="/shop" onClick={closeCart} className="btn-primary">
              {t('common.browseGadgets')}
            </Link>
          </div>
        ) : (
          <>
            {site.freeShippingThreshold > 0 && (
              <div className="border-b border-white/10 px-5 py-3">
                <p className="flex items-center gap-2 text-xs text-brand-200">
                  <Truck className="size-4 text-neon-400" aria-hidden="true" />
                  {remainingForFreeShipping > 0 ? (
                    t('cart.addForFreeShipping', { amount: formatPrice(remainingForFreeShipping) })
                  ) : (
                    <span className="font-semibold text-neon-400">
                      {t('cart.freeShippingUnlocked')}
                    </span>
                  )}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-brand-400 to-neon-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / site.freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-5">
              {lines.map((line) => {
                const shown = localizeProduct(line.product, lang)
                return (
                  <li key={line.productId} className="flex gap-3 py-4">
                    <Link
                      to={`/product/${line.productId}`}
                      onClick={closeCart}
                      className="size-20 shrink-0 overflow-hidden rounded-xl bg-brand-900"
                    >
                      <img
                        src={assetUrl(line.product.images[0] ?? '')}
                        alt={shown.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${line.productId}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-semibold text-white hover:text-brand-200"
                      >
                        {shown.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-brand-300">
                        {t('cart.each', { amount: formatPrice(line.unitPrice) })}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.productId, line.quantity - 1)}
                            className="px-2 py-1.5 text-brand-200 hover:text-white"
                            aria-label={t('cart.decrease', { name: shown.name })}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold text-white">
                            {formatNumber(line.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.productId, line.quantity + 1)}
                            disabled={line.quantity >= line.product.stock}
                            className="px-2 py-1.5 text-brand-200 hover:text-white disabled:opacity-40"
                            aria-label={t('cart.increase', { name: shown.name })}
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.productId)}
                          className="ml-auto p-1.5 text-brand-300 hover:text-red-400"
                          aria-label={t('cart.remove', { name: shown.name })}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">{formatPrice(line.lineTotal)}</p>
                  </li>
                )
              })}
            </ul>

            <div className="space-y-3 border-t border-white/10 px-5 py-4">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-brand-200">
                  <dt>{t('cart.subtotal')}</dt>
                  <dd className="font-semibold text-white">{formatPrice(subtotal)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-neon-400">
                    <dt>{t('cart.discounts')}</dt>
                    <dd className="font-semibold">−{formatPrice(savings)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-brand-200">
                  <dt>{t('cart.shipping')}</dt>
                  <dd className="font-semibold text-white">
                    {shipping === 0 ? t('common.free') : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-base">
                  <dt className="font-bold text-white">{t('cart.total')}</dt>
                  <dd className="font-display font-bold text-white">{formatPrice(total)}</dd>
                </div>
              </dl>
              <Link to="/checkout" onClick={closeCart} className="btn-primary w-full">
                {t('cart.checkout')}
              </Link>
              <button type="button" onClick={closeCart} className="btn-ghost w-full">
                {t('common.keepShopping')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
