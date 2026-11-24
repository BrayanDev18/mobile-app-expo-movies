import type { TranslateOptions } from 'i18n-js';
import { useCallback } from 'react';
import { useLanguageStore } from '../stores/useLanguageStore';
import { translate } from './translate';
import type { TxKeyPath } from './types';

/**
 * Reactive translation: subscribes to the language store so every component using it
 * re-renders as soon as the user picks another language — no restart needed.
 */
export const useTranslate = () => {
  const language = useLanguageStore((state) => state.language);

  const t = useCallback(
    (key: TxKeyPath, options?: TranslateOptions) =>
      translate(key, { locale: language, ...options }),
    [language]
  );

  return { t, language };
};
