const TMDB_IMAGE_HOST = 'https://image.tmdb.org/t/p';

export type TmdbImageSize = 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

// Builds a CDN URL from a TMDB image path ("/abc.jpg"). Absolute URLs pass
// through untouched so data persisted before paths were stored keeps working.
export const tmdbImage = (path?: string | null, size: TmdbImageSize = 'w342'): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  return `${TMDB_IMAGE_HOST}/${size}${path}`;
};

// Re-sizes an already-built TMDB URL. Only for values that are URLs by
// contract (gallery images); everything path-based should use tmdbImage.
export const tmdbResize = (url?: string | null, size: TmdbImageSize = 'w500'): string | null =>
  url ? url.replace(/\/t\/p\/[^/]+\//, `/t/p/${size}/`) : null;

export const IMAGE_PLACEHOLDER = { blurhash: '004U]8' };
