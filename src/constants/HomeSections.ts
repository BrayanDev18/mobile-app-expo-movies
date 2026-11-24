import type { TxKeyPath } from '@/translate';

export const HOME_GENRES: readonly { id: number; titleKey: TxKeyPath }[] = [
  { id: 28, titleKey: 'home.genres.action' },
  { id: 35, titleKey: 'home.genres.comedy' },
  { id: 16, titleKey: 'home.genres.animation' },
];

export const HOME_PROVIDERS: readonly { id: number; titleKey: TxKeyPath }[] = [
  { id: 8, titleKey: 'home.providers.popularOnNetflix' },
  { id: 337, titleKey: 'home.providers.popularOnDisney' },
];
