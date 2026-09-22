/**
 * Single place for the shop's own details. Edit freely; nothing else
 * hard-codes a phone number, address or social link.
 */
export const site = {
  name: 'Bestimpo',
  tagline: 'Electronics & smart gadgets, hand-picked.',
  description:
    'We test every gadget we list. No filler stock, no inflated prices — just the audio, wearables, power and smart-home gear we would buy ourselves.',
  domain: 'bestimpo.com',
  email: 'orders@bestimpo.com',
  phone: '+1 (555) 014-9922',
  whatsapp: '15550149922',
  address: '12 Circuit Lane, Suite 400',
  hours: 'Sat–Thu, 10:00–19:00',
  currency: {
    code: 'USD',
    symbol: '$',
    /** Intl locale used for number grouping. */
    locale: 'en-US',
  },
  /** Orders at or above this subtotal ship free. Set to 0 to always charge. */
  freeShippingThreshold: 199,
  shippingFlatRate: 9,
  social: {
    facebook: 'https://facebook.com/bestimpo',
    instagram: 'https://instagram.com/bestimpo',
    youtube: 'https://youtube.com/@bestimpo',
    x: 'https://x.com/bestimpo',
  },
} as const

/**
 * EmailJS credentials. Set them in .env.local for local dev and as
 * repository secrets/variables for the GitHub Pages build (see README).
 * These are public by design — EmailJS public keys are safe in client code,
 * but lock the template down to your own domain in the EmailJS dashboard.
 */
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
  orderTemplateId: import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID ?? '',
  contactTemplateId: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID ?? '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
}

export const isEmailjsConfigured = (templateId: string): boolean =>
  Boolean(emailjsConfig.serviceId && emailjsConfig.publicKey && templateId)
