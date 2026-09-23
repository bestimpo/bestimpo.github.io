export type CategorySlug =
  | 'audio'
  | 'wearables'
  | 'power'
  | 'smart-home'
  | 'accessories'
  | 'computing'

export type Category = {
  slug: CategorySlug
  name: string
  blurb: string
  /** Lucide icon name rendered by <CategoryIcon />. */
  icon: 'headphones' | 'watch' | 'battery-charging' | 'house' | 'cable' | 'laptop'
}

export type Product = {
  /** Stable, URL-safe id. Used in the product URL and in order emails. */
  id: string
  name: string
  brand: string
  category: CategorySlug
  /** Full list price, before any discount. */
  price: number
  /** Percent off the list price, 0-90. Omit or set 0 for no discount. */
  discountPercent?: number
  /** First image is the primary one. Relative paths resolve against public/. */
  images: string[]
  shortDescription: string
  description: string
  highlights: string[]
  specs: Record<string, string>
  /** Units available. 0 renders as sold out and blocks add-to-cart. */
  stock: number
  rating?: number
  reviewCount?: number
  /** Shows in the "Featured" rail on the home page. */
  featured?: boolean
  /** Small corner label, e.g. "New", "Staff pick". */
  badge?: string
}

/**
 * Bengali text for one product. Every field is optional — anything you leave
 * out falls back to the English entry in products.ts, so a half-translated
 * catalog still renders correctly.
 */
export type ProductTranslation = {
  name?: string
  brand?: string
  shortDescription?: string
  description?: string
  highlights?: string[]
  /** Spec values only; the keys translate through the shared specs dictionary. */
  specs?: Record<string, string>
  badge?: string
}

export type CartLine = {
  productId: string
  quantity: number
}

export type CartLineView = CartLine & {
  product: Product
  unitPrice: number
  lineTotal: number
}

export type OrderCustomer = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postcode: string
  notes: string
  paymentMethod: 'cash-on-delivery' | 'bank-transfer' | 'mobile-wallet'
}
