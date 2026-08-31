// Persistence keys are part of the user's stored data, not environment config —
// changing one silently orphans what's saved under it, so they live here, in
// one place, and keep their historical values.
const NS = 'flixora';

export const StorageKeys = {
  language: `${NS}-language-store`,
  mediaScope: `${NS}-media-scope-store`,
  myList: `${NS}-my-list-store`,
  profile: `${NS}-profile-store`,
  recentSearches: `${NS}-recent-searches-store`,
  viewedMedia: `${NS}-viewed-media-store`,
} as const;
