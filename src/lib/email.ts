import emailjs from '@emailjs/browser'
import { emailjsConfig, isEmailjsConfigured, site } from '@/data/site'
import { formatPrice } from '@/lib/format'
import type { CartLineView, OrderCustomer } from '@/types'

export type OrderTotals = {
  subtotal: number
  savings: number
  shipping: number
  total: number
}

/** Short, human-quotable reference, e.g. BIM-7F3K2. */
export const makeOrderId = (): string =>
  `BIM-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

const paymentLabels: Record<OrderCustomer['paymentMethod'], string> = {
  'cash-on-delivery': 'Cash on delivery',
  'bank-transfer': 'Bank transfer',
  'mobile-wallet': 'Mobile wallet',
}

/** Plain-text order table — readable in any email client, no HTML needed. */
export const buildOrderSummary = (lines: CartLineView[], totals: OrderTotals): string => {
  const rows = lines.map(
    (line) =>
      `${line.quantity} × ${line.product.name} (${line.product.id}) — ${formatPrice(
        line.unitPrice,
      )} each = ${formatPrice(line.lineTotal)}`,
  )
  return [
    ...rows,
    '',
    `Subtotal: ${formatPrice(totals.subtotal)}`,
    totals.savings > 0 ? `Discounts: -${formatPrice(totals.savings)}` : null,
    `Shipping: ${totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}`,
    `TOTAL: ${formatPrice(totals.total)}`,
  ]
    .filter((row): row is string => row !== null)
    .join('\n')
}

export async function sendOrderEmail(
  customer: OrderCustomer,
  lines: CartLineView[],
  totals: OrderTotals,
  orderId: string,
): Promise<void> {
  if (!isEmailjsConfigured(emailjsConfig.orderTemplateId)) {
    throw new Error(
      'EmailJS is not configured yet. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_ORDER_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY.',
    )
  }

  await emailjs.send(
    emailjsConfig.serviceId,
    emailjsConfig.orderTemplateId,
    {
      order_id: orderId,
      order_date: new Date().toLocaleString('en-BD'),
      shop_name: site.name,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: `${customer.address}, ${customer.city} ${customer.postcode}`.trim(),
      payment_method: paymentLabels[customer.paymentMethod],
      notes: customer.notes || '—',
      item_count: lines.reduce((sum, line) => sum + line.quantity, 0),
      order_items: buildOrderSummary(lines, totals),
      subtotal: formatPrice(totals.subtotal),
      savings: formatPrice(totals.savings),
      shipping: totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping),
      total: formatPrice(totals.total),
      reply_to: customer.email,
    },
    { publicKey: emailjsConfig.publicKey },
  )
}

export async function sendContactEmail(fields: {
  name: string
  email: string
  subject: string
  message: string
}): Promise<void> {
  if (!isEmailjsConfigured(emailjsConfig.contactTemplateId)) {
    throw new Error(
      'EmailJS is not configured yet. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_CONTACT_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY.',
    )
  }

  await emailjs.send(
    emailjsConfig.serviceId,
    emailjsConfig.contactTemplateId,
    {
      shop_name: site.name,
      from_name: fields.name,
      from_email: fields.email,
      subject: fields.subject,
      message: fields.message,
      reply_to: fields.email,
    },
    { publicKey: emailjsConfig.publicKey },
  )
}

/** Fallback when EmailJS is down or unconfigured: hand the order to the mail client. */
export const orderMailtoUrl = (
  customer: OrderCustomer,
  lines: CartLineView[],
  totals: OrderTotals,
  orderId: string,
): string => {
  const body = [
    `Order ${orderId}`,
    '',
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}, ${customer.city} ${customer.postcode}`,
    `Payment: ${paymentLabels[customer.paymentMethod]}`,
    `Notes: ${customer.notes || '—'}`,
    '',
    buildOrderSummary(lines, totals),
  ].join('\n')
  return `mailto:${site.email}?subject=${encodeURIComponent(
    `Order ${orderId} — ${site.name}`,
  )}&body=${encodeURIComponent(body)}`
}
