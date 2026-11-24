import type { TxKeyPath } from '@/translate';

export const SERIES_GENRES: readonly { id: number; titleKey: TxKeyPath }[] = [
  { id: 18, titleKey: 'home.genres.drama' },
  { id: 35, titleKey: 'home.genres.comedy' },
  { id: 80, titleKey: 'home.genres.crime' },
  { id: 10765, titleKey: 'home.genres.sciFiFantasy' },
];

export const SERIES_NETWORKS: readonly { id: number; titleKey: TxKeyPath }[] = [
  { id: 213, titleKey: 'home.networks.netflixOriginals' },
  { id: 49, titleKey: 'home.networks.hbo' },
  { id: 2552, titleKey: 'home.networks.appleTv' },
];
