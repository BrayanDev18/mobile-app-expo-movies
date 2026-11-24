import { intlLocale, translate } from '@/translate';

// Every formatter reads the selected app language through `intlLocale()`; components
// re-render on language change via `useTranslate()` (or fresh TMDB data).

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat(intlLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(date))
    .replace(',', '');
};

export const formatSpecialDate = (date: string) => {
  const formatDate = new Date(date);

  return formatDate.toLocaleDateString(intlLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return translate('units.hoursMinutes', { hours: h, minutes: m });
};

export const formatMinutes = (minutes: number) => translate('units.minutes', { minutes });

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat(intlLocale(), {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatMoney = (amount?: number): string | null => {
  if (!amount) return null;

  const locale = intlLocale();
  const compact = (value: number, digits: number) =>
    value.toLocaleString(locale, { maximumFractionDigits: digits });

  if (amount >= 1e9) return `$${translate('units.billion', { value: compact(amount / 1e9, 1) })}`;
  if (amount >= 1e6) return `$${translate('units.million', { value: compact(amount / 1e6, 0) })}`;

  return `$${amount.toLocaleString(locale)}`;
};

type DisplayNamesCtor = new (
  locales: string[],
  options: { type: 'language' }
) => { of: (code: string) => string | undefined };

/** Localized language name for an ISO 639-1 code, falling back to TMDB's English name. */
export const formatLanguageName = (code?: string | null, fallback?: string | null) => {
  if (!code) return fallback ?? null;

  try {
    const DisplayNames = (Intl as unknown as { DisplayNames?: DisplayNamesCtor }).DisplayNames;
    const name = DisplayNames
      ? new DisplayNames([intlLocale()], { type: 'language' }).of(code)
      : null;

    if (name && name !== code) return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    // Engines without Intl.DisplayNames fall through to TMDB's name
  }

  return fallback ?? code.toUpperCase();
};
