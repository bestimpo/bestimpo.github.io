import { site } from '@/data/site'
import type { Product } from '@/types'

const whole = new Intl.NumberFormat(site.currency.locale, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const withCents = new Intl.NumberFormat(site.currency.locale, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * "$1,299" for round amounts, "$29.40" once a discount leaves cents —
 * never "$29.4". Symbol comes from site.currency, so one edit changes the shop.
 */
export const formatPrice = (amount: number): string => {
  const rounded = Math.round(amount * 100) / 100
  const format = Number.isInteger(rounded) ? whole : withCents
  return `${site.currency.symbol}${format.format(rounded)}`
}

/** Price the customer actually pays, after any discountPercent. */
export const salePrice = (product: Product): number => {
  const percent = product.discountPercent ?? 0
  if (percent <= 0) return product.price
  return Math.round(product.price * (1 - percent / 100) * 100) / 100
}

export const hasDiscount = (product: Product): boolean =>
  (product.discountPercent ?? 0) > 0

export const savingsAmount = (product: Product): number =>
  Math.round((product.price - salePrice(product)) * 100) / 100

/**
 * Resolves an image path against the deployed base URL, so the same catalog
 * works at bestimpo.com/ and at user.github.io/bestimpo/. Absolute URLs and
 * data URIs pass through untouched.
 */
export const assetUrl = (path: string): string => {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
