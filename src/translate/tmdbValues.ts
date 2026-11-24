import { translate } from './translate';
import type { TxKeyPath } from './types';

// TMDB always returns these enum-like values in English, whatever the language param.
const TMDB_VALUE_KEYS: Record<string, TxKeyPath> = {
  // Movie / series status
  Rumored: 'tmdb.status.rumored',
  Planned: 'tmdb.status.planned',
  'In Production': 'tmdb.status.inProduction',
  'Post Production': 'tmdb.status.postProduction',
  Released: 'tmdb.status.released',
  Canceled: 'tmdb.status.canceled',
  Cancelled: 'tmdb.status.canceled',
  'Returning Series': 'tmdb.status.returningSeries',
  Ended: 'tmdb.status.ended',
  Pilot: 'tmdb.status.pilot',
  // Series type
  Scripted: 'tmdb.seriesType.scripted',
  Reality: 'tmdb.seriesType.reality',
  Documentary: 'tmdb.seriesType.documentary',
  News: 'tmdb.seriesType.news',
  'Talk Show': 'tmdb.seriesType.talkShow',
  Miniseries: 'tmdb.seriesType.miniseries',
  Video: 'tmdb.seriesType.video',
  // Person department
  Acting: 'tmdb.department.acting',
  Directing: 'tmdb.department.directing',
  Writing: 'tmdb.department.writing',
  Production: 'tmdb.department.production',
  Sound: 'tmdb.department.sound',
  Art: 'tmdb.department.art',
  Camera: 'tmdb.department.camera',
  Editing: 'tmdb.department.editing',
  'Costume & Make-Up': 'tmdb.department.costumeMakeUp',
  Crew: 'tmdb.department.crew',
  'Visual Effects': 'tmdb.department.visualEffects',
  Lighting: 'tmdb.department.lighting',
  Creator: 'tmdb.department.creator',
};

/** Translates a known TMDB English value; unknown values pass through unchanged. */
export const translateTmdbValue = (
  value: string | null | undefined,
  t: (key: TxKeyPath) => string = translate
) => {
  if (!value) return value ?? null;

  const key = TMDB_VALUE_KEYS[value];

  return key ? t(key) : value;
};
