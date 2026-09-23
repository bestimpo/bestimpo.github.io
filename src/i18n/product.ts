import { productTranslationsBn } from '@/data/products.bn'
import type { Lang } from '@/i18n'
import type { Product } from '@/types'

/**
 * Returns the product with any available Bengali text merged over the English.
 * Missing fields fall back field by field, so a partly translated entry is
 * still usable — no empty strings, no mixed-up specs.
 */
export function localizeProduct(product: Product, lang: Lang): Product {
  if (lang !== 'bn') return product

  const translation = productTranslationsBn[product.id]
  if (!translation) return product

  return {
    ...product,
    name: translation.name ?? product.name,
    brand: translation.brand ?? product.brand,
    shortDescription: translation.shortDescription ?? product.shortDescription,
    description: translation.description ?? product.description,
    highlights: translation.highlights ?? product.highlights,
    badge: translation.badge ?? product.badge,
    specs: translation.specs ? { ...product.specs, ...translation.specs } : product.specs,
  }
}
