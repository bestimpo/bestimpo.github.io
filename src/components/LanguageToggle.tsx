import { languages } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageContext'

/** Two-state EN / বাংলা switch. The choice persists in localStorage. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t('nav.languageLabel')}
      className={`flex items-center rounded-xl border border-white/15 bg-white/5 p-0.5 ${className}`}
    >
      {languages.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLang(option.code)}
          aria-pressed={lang === option.code}
          title={option.label}
          className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
            lang === option.code
              ? 'bg-brand-500 text-brand-950'
              : 'text-brand-200 hover:text-white'
          }`}
        >
          {option.short}
        </button>
      ))}
    </div>
  )
}
