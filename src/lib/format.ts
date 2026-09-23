import { site } from '@/data/site'
import { localeFor, type Lang } from '@/i18n'
import type { Product } from '@/types'

const formatters = new Map<string, Intl.NumberFormat>()

const formatterFor = (locale: string, decimals: number): Intl.NumberFormat => {
  const key = `${locale}:${decimals}`
  let formatter = formatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    formatters.set(key, formatter)
  }
  return formatter
}

/**
 * "৳14,900" in English, "৳১৪,৯০০" in Bengali — bn-BD switches both the digits
 * and the grouping (lakh style). Cents only appear when an amount actually has
 * them, so a discount never renders as "৳29.4".
 *
 * Components should prefer `useLanguage().formatPrice`, which passes the active
 * language for you. The `lang` argument exists for non-React callers such as
 * the order email.
 */
export const formatPrice = (amount: number, lang: Lang = 'en'): string => {
  const rounded = Math.round(amount * 100) / 100
  const decimals = Number.isInteger(rounded) ? 0 : 2
  return `${site.currency.symbol}${formatterFor(localeFor(lang), decimals).format(rounded)}`
}

/** Price the customer actually pays, after any discountPercent. */
export const salePrice = (product: Product): number => {
  const percent = product.discountPercent ?? 0
  if (percent <= 0) return product.price
  return Math.round(product.price * (1 - percent / 100) * 100) / 100
}

export const hasDiscount = (product: Product): boolean => (product.discountPercent ?? 0) > 0

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
