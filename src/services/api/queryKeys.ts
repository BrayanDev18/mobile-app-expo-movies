import { tmdbLanguage } from './movies.config';

// TMDB responses vary with the language param the request interceptor attaches,
// so the language must be part of every TMDB query's cache identity. Switching
// language then simply resolves to fresh keys — no blanket invalidation needed.
export const tmdbKey = (...parts: readonly unknown[]) => [...parts, tmdbLanguage()];
