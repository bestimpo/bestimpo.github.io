import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { productById } from '@/data/products'
import { site } from '@/data/site'
import { salePrice } from '@/lib/format'
import { useLocalStorage } from '@/lib/useLocalStorage'
import type { CartLine, CartLineView } from '@/types'

type CartContextValue = {
  lines: CartLineView[]
  itemCount: number
  subtotal: number
  savings: number
  shipping: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  add: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_KEY = 'bestimpo.cart.v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [rawLines, setRawLines, clearStored] = useLocalStorage<CartLine[]>(CART_KEY, [])
  const [isOpen, setIsOpen] = useState(false)

  // Drop lines whose product no longer exists in the catalog, and clamp
  // quantities to current stock so an old cart can't check out a sold-out item.
  const lines = useMemo<CartLineView[]>(() => {
    return rawLines.flatMap((line) => {
      const product = productById.get(line.productId)
      if (!product || product.stock <= 0) return []
      const quantity = Math.min(Math.max(1, line.quantity), product.stock)
      const unitPrice = salePrice(product)
      return [{ ...line, quantity, product, unitPrice, lineTotal: unitPrice * quantity }]
    })
  }, [rawLines])

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100
  const savings =
    Math.round(
      lines.reduce((sum, l) => sum + (l.product.price - l.unitPrice) * l.quantity, 0) * 100,
    ) / 100
  const shipping =
    subtotal === 0 || (site.freeShippingThreshold > 0 && subtotal >= site.freeShippingThreshold)
      ? 0
      : site.shippingFlatRate
  const total = Math.round((subtotal + shipping) * 100) / 100

  const add = useCallback(
    (productId: string, quantity = 1) => {
      const product = productById.get(productId)
      if (!product || product.stock <= 0) return
      setRawLines((current) => {
        const existing = current.find((l) => l.productId === productId)
        if (!existing) return [...current, { productId, quantity: Math.min(quantity, product.stock) }]
        return current.map((l) =>
          l.productId === productId
            ? { ...l, quantity: Math.min(l.quantity + quantity, product.stock) }
            : l,
        )
      })
      setIsOpen(true)
    },
    [setRawLines],
  )

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = productById.get(productId)
      if (!product) return
      if (quantity <= 0) {
        setRawLines((current) => current.filter((l) => l.productId !== productId))
        return
      }
      setRawLines((current) =>
        current.map((l) =>
          l.productId === productId ? { ...l, quantity: Math.min(quantity, product.stock) } : l,
        ),
      )
    },
    [setRawLines],
  )

  const remove = useCallback(
    (productId: string) => setRawLines((current) => current.filter((l) => l.productId !== productId)),
    [setRawLines],
  )

  const value: CartContextValue = {
    lines,
    itemCount,
    subtotal,
    savings,
    shipping,
    total,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    add,
    setQuantity,
    remove,
    clear: clearStored,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
