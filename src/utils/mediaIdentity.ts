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
