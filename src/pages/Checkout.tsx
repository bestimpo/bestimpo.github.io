import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, CreditCard, Loader2, ShoppingCart, TriangleAlert } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { emailjsConfig, isEmailjsConfigured, site } from '@/data/site'
import { assetUrl, formatPrice } from '@/lib/format'
import { makeOrderId, orderMailtoUrl, sendOrderEmail } from '@/lib/email'
import type { CartLineView, OrderCustomer } from '@/types'

const emptyCustomer: OrderCustomer = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postcode: '',
  notes: '',
  paymentMethod: 'cash-on-delivery',
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Checkout() {
  const { lines, subtotal, savings, shipping, total, clear } = useCart()
  const [customer, setCustomer] = useState<OrderCustomer>(emptyCustomer)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')
  // Kept so the confirmation screen can still render after the cart is cleared.
  const [placedLines, setPlacedLines] = useState<CartLineView[]>([])

  const totals = { subtotal, savings, shipping, total }
  const configured = isEmailjsConfigured(emailjsConfig.orderTemplateId)

  const field =
    (key: keyof OrderCustomer) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setCustomer((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (lines.length === 0) return

    const reference = makeOrderId()
    setStatus('sending')
    setError('')

    try {
      await sendOrderEmail(customer, lines, totals, reference)
      setOrderId(reference)
      setPlacedLines(lines)
      setStatus('sent')
      clear()
    } catch (cause) {
      setOrderId(reference)
      setError(cause instanceof Error ? cause.message : 'Could not send the order.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="container-page py-16 lg:py-24">
        <div className="card-surface mx-auto max-w-xl px-6 py-12 text-center">
          <CheckCircle2 className="mx-auto size-14 text-neon-400" aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">Order received</h1>
          <p className="mt-3 text-brand-200/85">
            Reference <strong className="text-white">{orderId}</strong>. We emailed the details to{' '}
            {site.email} and will confirm stock and delivery with you at{' '}
            <strong className="text-white">{customer.email}</strong>.
          </p>
          <p className="mt-4 text-sm text-brand-300">
            {placedLines.reduce((sum, line) => sum + line.quantity, 0)} item(s) ·{' '}
            {formatPrice(totals.total)}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-primary">
              Keep shopping
            </Link>
            <Link to="/" className="btn-ghost">
              Back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-16 lg:py-24">
        <div className="card-surface mx-auto max-w-lg px-6 py-14 text-center">
          <ShoppingCart className="mx-auto size-12 text-brand-300" aria-hidden="true" />
          <h1 className="mt-5 text-2xl font-bold text-white">Your cart is empty</h1>
          <p className="mt-2 text-brand-200/80">Add a gadget and the checkout will open up.</p>
          <Link to="/shop" className="btn-primary mt-7">
            Browse gadgets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-brand-200/75">
        No card is charged here. We email your order, then confirm payment and delivery directly.
      </p>

      {!configured && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-accent-500/30 bg-accent-500/10 px-5 py-4 text-sm text-accent-400">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            EmailJS keys are not set, so orders cannot be sent yet. Add the three
            <code className="mx-1 rounded bg-brand-950/60 px-1.5 py-0.5 text-xs">VITE_EMAILJS_*</code>
            variables (see README). Submitting will offer a mail-client fallback.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <form onSubmit={submit} className="card-surface space-y-6 p-6 lg:col-span-3">
          <fieldset className="space-y-4" disabled={status === 'sending'}>
            <legend className="text-sm font-bold tracking-wider text-white uppercase">
              Your details
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  required
                  autoComplete="name"
                  value={customer.name}
                  onChange={field('name')}
                  className="field"
                />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={customer.email}
                  onChange={field('email')}
                  className="field"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={customer.phone}
                onChange={field('phone')}
                className="field"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4" disabled={status === 'sending'}>
            <legend className="text-sm font-bold tracking-wider text-white uppercase">
              Delivery
            </legend>
            <div>
              <label className="label" htmlFor="address">
                Street address
              </label>
              <input
                id="address"
                required
                autoComplete="street-address"
                value={customer.address}
                onChange={field('address')}
                className="field"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  required
                  autoComplete="address-level2"
                  value={customer.city}
                  onChange={field('city')}
                  className="field"
                />
              </div>
              <div>
                <label className="label" htmlFor="postcode">
                  Postcode
                </label>
                <input
                  id="postcode"
                  autoComplete="postal-code"
                  value={customer.postcode}
                  onChange={field('postcode')}
                  className="field"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="notes">
                Order notes <span className="normal-case">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={customer.notes}
                onChange={field('notes')}
                placeholder="Delivery window, landmark, colour preference…"
                className="field resize-y"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-3" disabled={status === 'sending'}>
            <legend className="text-sm font-bold tracking-wider text-white uppercase">
              Payment
            </legend>
            <div>
              <label className="label" htmlFor="payment">
                How you want to pay
              </label>
              <select
                id="payment"
                value={customer.paymentMethod}
                onChange={field('paymentMethod')}
                className="field"
              >
                <option value="cash-on-delivery" className="bg-brand-950">
                  Cash on delivery
                </option>
                <option value="bank-transfer" className="bg-brand-950">
                  Bank transfer
                </option>
                <option value="mobile-wallet" className="bg-brand-950">
                  Mobile wallet
                </option>
              </select>
            </div>
          </fieldset>

          {status === 'error' && (
            <div className="space-y-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              <p className="flex gap-2">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
              <a
                href={orderMailtoUrl(customer, lines, totals, orderId)}
                className="btn-ghost w-full text-red-100"
              >
                Send this order by email instead
              </a>
            </div>
          )}

          <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
            {status === 'sending' ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending order…
              </>
            ) : (
              <>
                <CreditCard className="size-4" aria-hidden="true" />
                Place order · {formatPrice(total)}
              </>
            )}
          </button>
          <p className="text-center text-xs text-brand-300/60">
            By placing the order you agree to be contacted about it at the details above.
          </p>
        </form>

        {/* Summary */}
        <aside className="lg:col-span-2">
          <div className="card-surface sticky top-24 p-6">
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">Order summary</h2>
            <ul className="mt-4 space-y-4">
              {lines.map((line) => (
                <li key={line.productId} className="flex gap-3">
                  <img
                    src={assetUrl(line.product.images[0] ?? '')}
                    alt=""
                    className="size-14 shrink-0 rounded-lg bg-brand-900 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-white">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-brand-300">
                      {line.quantity} × {formatPrice(line.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-white">{formatPrice(line.lineTotal)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-brand-200">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-white">{formatPrice(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-neon-400">
                  <dt>Discounts</dt>
                  <dd className="font-semibold">−{formatPrice(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between text-brand-200">
                <dt>Shipping</dt>
                <dd className="font-semibold text-white">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base">
                <dt className="font-bold text-white">Total</dt>
                <dd className="font-display font-bold text-white">{formatPrice(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
