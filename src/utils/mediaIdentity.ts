import { MovieProps } from '@/interfaces';

export type MediaRef = Pick<MovieProps, 'id' | 'mediaType'>;

export const mediaKey = ({ id, mediaType = 'movie' }: MediaRef) => `${mediaType}-${id}`;

export const sameMedia = (a: MediaRef, b: MediaRef) => mediaKey(a) === mediaKey(b);

export const claimUnique = <T extends MediaRef>(items: T[], claimed: Set<string>) =>
  items.filter((item) => {
    const key = mediaKey(item);

    if (claimed.has(key)) return false;

    claimed.add(key);
    return true;
  });

export const dedupeMedia = <T extends MediaRef>(items: T[]) => claimUnique(items, new Set());

// A lazy home rail: claims its items once loaded; until then (disabled or in
// flight, but not failed) it stays in the list as a pending skeleton so the
// list can render it — which is what activates its fetch.
export const lazyRail = <T extends MediaRef>(
  row: { data?: T[]; isError: boolean },
  claimed: Set<string>
) => ({
  movies: claimUnique(row.data ?? [], claimed),
  isPending: !row.data && !row.isError,
});
