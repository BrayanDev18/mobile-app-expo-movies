import { MediaType } from '@/interfaces';
import type { TxKeyPath } from '@/translate';

export const MEDIA_SCOPES: { key: MediaType; labelKey: TxKeyPath }[] = [
  { key: 'movie', labelKey: 'common.movies' },
  { key: 'tv', labelKey: 'common.series' },
];
