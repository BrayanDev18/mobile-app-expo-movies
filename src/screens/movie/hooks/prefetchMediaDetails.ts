import { MovieProps } from '@/interfaces';
import { queryClient } from '@/services';
import { tmdbImage } from '@/utils';
import { Image } from 'expo-image';
import { tvFullQuery } from '../../series/hooks/useTvFull';
import { movieFullQuery } from './useMovieFull';

type PrefetchableMedia = Pick<MovieProps, 'id' | 'mediaType' | 'poster'>;

// Called on press-in: the ~100ms before release plus the push transition are
// enough to have the detail payload and header images in cache on arrival.
// Both calls are no-ops when the data is already fresh/cached.
export const prefetchMediaDetails = (media: PrefetchableMedia) => {
  if (!media.id) return;

  void (media.mediaType === 'tv'
    ? queryClient.prefetchQuery(tvFullQuery(media.id))
    : queryClient.prefetchQuery(movieFullQuery(media.id)));

  // The sizes MovieHeader renders: blurred backdrop and the poster itself.
  const images = [tmdbImage(media.poster, 'w185'), tmdbImage(media.poster, 'w500')].filter(
    (uri): uri is string => !!uri
  );

  if (images.length) void Image.prefetch(images, 'memory-disk');
};
