import { HomeSection, MediaType, MovieProps } from '@/interfaces';
import { router } from 'expo-router';

// The poster path rides along so the detail screen can show its header while
// the payload loads, instead of a blank spinner.
export const openMediaDetails = (
  media: Pick<MovieProps, 'id' | 'mediaType'> & { poster?: string | null }
) => {
  const params = { id: media.id, ...(media.poster ? { poster: media.poster } : {}) };

  if (media.mediaType === 'tv') {
    router.push({ pathname: '/(root)/tv/[id]', params });
    return;
  }

  router.push({ pathname: '/(root)/movie/[id]', params });
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

export const openEpisode = (params: {
  seriesId: number;
  seasonNumber: number;
  episodeNumber: number;
  seriesTitle?: string;
}) =>
  router.push({
    pathname: '/(root)/tv/episode',
    params: {
      id: params.seriesId,
      season: params.seasonNumber,
      episode: params.episodeNumber,
      ...(params.seriesTitle ? { seriesTitle: params.seriesTitle } : {}),
    },
  });
