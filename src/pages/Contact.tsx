import { useState } from 'react'
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send, TriangleAlert } from 'lucide-react'
import { emailjsConfig, isEmailjsConfigured, site } from '@/data/site'
import { sendContactEmail } from '@/lib/email'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const configured = isEmailjsConfigured(emailjsConfig.contactTemplateId)

  const update =
    (key: keyof typeof fields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await sendContactEmail(fields)
      setStatus('sent')
      setFields({ name: '', email: '', subject: '', message: '' })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not send the message.')
      setStatus('error')
    }
  }

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="text-xs font-semibold tracking-wider text-brand-300 uppercase">Contact</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Talk to a human</h1>
      <p className="mt-3 max-w-xl text-brand-200/85">
        Product questions, stock checks, warranty claims or a bulk order — same inbox, usually
        answered within a few hours during opening times.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {status === 'sent' ? (
            <div className="card-surface px-6 py-14 text-center">
              <CheckCircle2 className="mx-auto size-12 text-neon-400" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-white">Message sent</h2>
              <p className="mt-2 text-brand-200/85">
                We have it. Expect a reply at the email you gave us.
              </p>
              <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-6">
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card-surface space-y-5 p-6">
              {!configured && (
                <div className="flex gap-3 rounded-2xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-accent-400">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>
                    EmailJS keys are not set yet, so this form cannot send. Email{' '}
                    <a href={`mailto:${site.email}`} className="underline">
                      {site.email}
                    </a>{' '}
                    in the meantime.
                  </p>
                </div>
              )}

              <fieldset className="space-y-5" disabled={status === 'sending'}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="contact-name">
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      required
                      autoComplete="name"
                      value={fields.name}
                      onChange={update('name')}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={fields.email}
                      onChange={update('email')}
                      className="field"
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    required
                    value={fields.subject}
                    onChange={update('subject')}
                    placeholder="Stock check: VoltCore 140 W"
                    className="field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={fields.message}
                    onChange={update('message')}
                    className="field resize-y"
                  />
                </div>
              </fieldset>

              {status === 'error' && (
                <p className="flex gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}

              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
                {status === 'sending' ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Send message
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-4 lg:col-span-2">
          <div className="card-surface p-6">
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">Direct lines</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="text-brand-100 hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <a
                  href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}
                  className="text-brand-100 hover:text-white"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-brand-100 hover:text-white"
                >
                  WhatsApp us
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span className="text-brand-100">{site.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <span className="text-brand-100">{site.hours}</span>
              </li>
            </ul>
          </div>

          <div className="card-surface p-6">
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">Before you ask</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-white">Do you ship outside the city?</dt>
                <dd className="mt-1 text-brand-200/80">
                  Yes — nationwide courier, 2–4 days, free over{' '}
                  {site.currency.symbol}
                  {site.freeShippingThreshold}.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Can I pay on delivery?</dt>
                <dd className="mt-1 text-brand-200/80">
                  Yes. Cash on delivery, bank transfer or mobile wallet — pick at checkout.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Is the warranty local?</dt>
                <dd className="mt-1 text-brand-200/80">
                  Handled by us directly. Bring the item and the order reference.
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
