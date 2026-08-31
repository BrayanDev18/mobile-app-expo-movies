import { MovieProps } from '@/interfaces';
import { router } from 'expo-router';

export const openMediaDetails = (media: Pick<MovieProps, 'id' | 'mediaType'>) => {
  if (media.mediaType === 'tv') {
    router.push({ pathname: '/(root)/tv/[id]', params: { id: media.id } });
    return;
  }

  router.push({ pathname: '/(root)/movie/[id]', params: { id: media.id } });
};
