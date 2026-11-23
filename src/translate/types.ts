import type { Translations } from './en';

// Objects carrying plural forms are leaves: `t('myList.titlesSaved', { count })`
type PluralForms = { one: string; other: string };

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends PluralForms
      ? K
      : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

/** Every translatable key, dot-separated (e.g. `'home.trendingThisWeek'`). */
export type TxKeyPath = Paths<Translations>;
