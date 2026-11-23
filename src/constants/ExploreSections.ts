import type { TxKeyPath } from '@/translate';

export interface DecadeProps {
  labelKey: TxKeyPath;
  from: number;
  to: number;
}

export const EXPLORE_DECADES: DecadeProps[] = [
  { labelKey: 'explore.decades.d2020s', from: 2020, to: 2029 },
  { labelKey: 'explore.decades.d2010s', from: 2010, to: 2019 },
  { labelKey: 'explore.decades.d2000s', from: 2000, to: 2009 },
  { labelKey: 'explore.decades.d1990s', from: 1990, to: 1999 },
  { labelKey: 'explore.decades.d1980s', from: 1980, to: 1989 },
  { labelKey: 'explore.decades.d1970s', from: 1970, to: 1979 },
];

// TMDB collection ids — curated sagas for the Explore screen
export const EXPLORE_COLLECTIONS = [
  10, // Star Wars
  1241, // Harry Potter
  86311, // The Avengers
  119, // The Lord of the Rings
  645, // James Bond
  9485, // Fast & Furious
  328, // Jurassic Park
  87359, // Mission: Impossible
  263, // The Dark Knight
  10194, // Toy Story
];
