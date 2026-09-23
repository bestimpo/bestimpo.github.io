import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { bn } from '@/i18n/bn'
import { en, type Dictionary, type TranslationKey } from '@/i18n/en'
import { localeFor, type Lang } from '@/i18n'
import { formatPrice as formatPriceRaw } from '@/lib/format'
import { useLocalStorage } from '@/lib/useLocalStorage'

const dictionaries: Record<Lang, Dictionary> = { en, bn }

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Look up a dotted key, filling {placeholders} from `vars`. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
  /** Price in the active language's digits, e.g. "৳14,900" or "৳১৪,৯০০". */
  formatPrice: (amount: number) => string
  formatNumber: (value: number) => string
  /** One-decimal values such as a 4.6 star rating. */
  formatDecimal: (value: number) => string
  /** Spec keys are shared across products, so they translate through the dictionary. */
  specLabel: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const LANG_KEY = 'bestimpo.lang.v1'

const interpolate = (template: string, vars?: Record<string, string | number>): string => {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Lang>(LANG_KEY, 'en')

  // Keeps the document in sync for screen readers, hyphenation and the
  // Bengali font rule in index.css.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const [section, entry] = key.split('.') as [keyof Dictionary, string]
      const active = dictionaries[lang][section] as Record<string, string> | undefined
      const fallback = dictionaries.en[section] as Record<string, string> | undefined
      return interpolate(active?.[entry] ?? fallback?.[entry] ?? key, vars)
    },
    [lang],
  )

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(localeFor(lang), { maximumFractionDigits: 0 }),
    [lang],
  )

  const decimalFormatter = useMemo(
    () =>
      new Intl.NumberFormat(localeFor(lang), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    [lang],
  )

  const value: LanguageContextValue = {
    lang,
    setLang,
    t,
    formatPrice: useCallback((amount: number) => formatPriceRaw(amount, lang), [lang]),
    formatNumber: useCallback((value: number) => numberFormatter.format(value), [numberFormatter]),
    formatDecimal: useCallback(
      (value: number) => decimalFormatter.format(value),
      [decimalFormatter],
    ),
    specLabel: useCallback(
      (key: string) => {
        const specs = dictionaries[lang].specs as Record<string, string>
        return specs[key] ?? key
      },
      [lang],
    ),
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return context
}
