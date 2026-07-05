import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { DEPARTMENT_AR, TRANSLATIONS } from '@/i18n/translations'

const STORAGE_KEY = 'ojen-locale-v1'
export type Locale = 'en' | 'ar'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<Locale>((localStorage.getItem(STORAGE_KEY) as Locale) ?? 'en')
  const dir = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))

  watchEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale.value)
    document.documentElement.dir = dir.value
    document.documentElement.lang = locale.value
  })

  function toggleLocale() {
    locale.value = locale.value === 'en' ? 'ar' : 'en'
  }

  function t(key: string, params?: Record<string, string | number>): string {
    const dict = TRANSLATIONS[locale.value]
    let text = dict[key] ?? TRANSLATIONS.en[key] ?? key
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        text = text.replace(new RegExp(`{{\\s*${name}\\s*}}`, 'g'), String(value))
      }
    }
    return text
  }

  function department(name: string): string {
    if (locale.value === 'en') return name
    return DEPARTMENT_AR[name] ?? name
  }

  return { locale, dir, toggleLocale, t, department }
})
