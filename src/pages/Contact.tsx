import { useState } from 'react'
import { CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send, TriangleAlert } from 'lucide-react'
import { emailjsConfig, isEmailjsConfigured, site } from '@/data/site'
import { sendContactEmail } from '@/lib/email'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatPrice } from '@/lib/format'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const { t, lang } = useLanguage()

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
      <p className="text-xs font-semibold tracking-wider text-brand-300 uppercase">{t('contact.eyebrow')}</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t('contact.title')}</h1>
      <p className="mt-3 max-w-xl text-brand-200/85">{t('contact.subtitle')}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {status === 'sent' ? (
            <div className="card-surface px-6 py-14 text-center">
              <CheckCircle2 className="mx-auto size-12 text-neon-400" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-white">{t('contact.sentTitle')}</h2>
              <p className="mt-2 text-brand-200/85">{t('contact.sentBody')}</p>
              <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-6">
                {t('contact.sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card-surface space-y-5 p-6">
              {!configured && (
                <div className="flex gap-3 rounded-2xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-accent-400">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>{t('contact.notConfigured', { email: site.email })}</p>
                </div>
              )}

              <fieldset className="space-y-5" disabled={status === 'sending'}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="contact-name">
                      {t('contact.yourName')}
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
                      {t('contact.email')}
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
                    {t('contact.subject')}
                  </label>
                  <input
                    id="contact-subject"
                    required
                    value={fields.subject}
                    onChange={update('subject')}
                    placeholder={t('contact.subjectPlaceholder')}
                    className="field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="contact-message">
                    {t('contact.message')}
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
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    {t('contact.send')}
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-4 lg:col-span-2">
          <div className="card-surface p-6">
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">{t('contact.directLines')}</h2>
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
                  {t('contact.whatsappUs')}
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
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">{t('contact.faqTitle')}</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-white">{t('contact.faq1Q')}</dt>
                <dd className="mt-1 text-brand-200/80">
                  {t('contact.faq1A', {
                    amount: formatPrice(site.freeShippingThreshold, lang),
                  })}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">{t('contact.faq2Q')}</dt>
                <dd className="mt-1 text-brand-200/80">{t('contact.faq2A')}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">{t('contact.faq3Q')}</dt>
                <dd className="mt-1 text-brand-200/80">{t('contact.faq3A')}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  )
}
