import type { TranslateOptions } from 'i18n-js';
import { i18n } from './i18n';
import type { TxKeyPath } from './types';

/**
 * Translates a key with the current `i18n.locale` (kept in sync with the language store).
 * Inside components prefer `useTranslate()`, which re-renders on language change.
 *
 * @example
 * translate('myList.titlesSaved', { count: 3 }) // → "3 titles saved"
 * translate('home.becauseYouWatched', { title: 'Dune' })
 */
export function translate(key: TxKeyPath, options: TranslateOptions = {}) {
  const text = i18n.t(key, options);

  return text.includes('[missing') ? key : text;
}

const INTL_LOCALES: Record<string, string> = {
  en: 'en-GB',
  es: 'es-ES',
};

/** BCP-47 tag for `Intl` formatters that matches the selected app language. */
export const intlLocale = (language: string = i18n.locale) =>
  INTL_LOCALES[language.slice(0, 2)] ?? language;
