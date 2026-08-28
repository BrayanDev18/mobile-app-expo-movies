const TMDB_IMAGE_HOST = 'https://image.tmdb.org/t/p';

export type TmdbImageSize = 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

export const tmdbImage = (path?: string | null, size: TmdbImageSize = 'w500'): string | null =>
  path ? `${TMDB_IMAGE_HOST}/${size}${path}` : null;

export const tmdbResize = (url?: string | null, size: TmdbImageSize = 'w500'): string | null =>
  url ? url.replace(/\/t\/p\/[^/]+\//, `/t/p/${size}/`) : null;

export const IMAGE_PLACEHOLDER = { blurhash: '004U]8' };
