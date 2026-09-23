export type Lang = 'en' | 'bn'

export const languages: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'bn', label: 'বাংলা', short: 'বাং' },
]

/** Digits and grouping differ: bn-BD renders ১২,৩৪,৫৬৭, en-BD renders 1,234,567. */
export const localeFor = (lang: Lang): string => (lang === 'bn' ? 'bn-BD' : 'en-BD')
