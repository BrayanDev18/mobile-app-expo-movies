import { HomeSection, MediaType, MovieProps } from '@/interfaces';
import { router } from 'expo-router';

export const openMediaDetails = (media: Pick<MovieProps, 'id' | 'mediaType'>) => {
  if (media.mediaType === 'tv') {
    router.push({ pathname: '/(root)/tv/[id]', params: { id: media.id } });
    return;
  }

  router.push({ pathname: '/(root)/movie/[id]', params: { id: media.id } });
};

export const openPersonDetails = (personId: number) =>
  router.push({ pathname: '/(root)/movie/cast/[id]', params: { id: personId } });

export const openCollection = (collectionId: number) =>
  router.push({ pathname: '/(root)/movie/collection/[id]', params: { id: collectionId } });

export const openDiscover = (
  mediaType: MediaType,
  params: NonNullable<HomeSection['seeAll']> & { title?: string }
) =>
  router.push({
    pathname: mediaType === 'tv' ? '/(root)/tv/discover' : '/(root)/movie/discover',
    params,
  });

export const openCastList = (mediaId: number, mediaType: MediaType = 'movie') =>
  router.push({
    pathname: '/(root)/movie/cast/castList',
    params: { id: mediaId, type: mediaType },
  });

export const openGallery = (mediaId: number, mediaType: MediaType = 'movie') =>
  router.push({
    pathname: '/(root)/movie/gallery',
    params: { id: mediaId, type: mediaType },
  });
