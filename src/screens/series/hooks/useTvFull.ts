import { MovieApiRoutes } from '@/constants';
import {
  MovieCast,
  MovieImages,
  MovieReviewsResponse,
  MovieVideoResponse,
  RegionWatchProvidersProps,
  TvByCategoryResponse,
  TvDetails,
} from '@/interfaces';
import { moviesApi, tmdbImageLanguages, tmdbKey } from '@/services';
import { translate } from '@/translate';
import {
  deviceRegion,
  mapCastMembers,
  mapImages,
  mapReviews,
  mapTvDetails,
  mapTvShows,
  mapVideos,
  pickCertification,
  pickRegion,
  tmdbImage,
} from '@/utils';
import { queryOptions, useQuery } from '@tanstack/react-query';

const APPEND_TO_RESPONSE =
  'videos,credits,images,reviews,similar,recommendations,content_ratings,watch/providers';

interface ContentRatingEntry {
  iso_3166_1: string;
  rating: string;
}

interface TvFullResponse extends TvDetails {
  videos?: MovieVideoResponse;
  credits?: { cast: MovieCast[] };
  images?: { backdrops: MovieImages[]; logos: MovieImages[]; posters: MovieImages[] };
  reviews?: MovieReviewsResponse;
  similar?: TvByCategoryResponse;
  recommendations?: TvByCategoryResponse;
  content_ratings?: { results: ContentRatingEntry[] };
  'watch/providers'?: { results: Record<string, RegionWatchProvidersProps> };
}

// Shared by the hook and by prefetchMediaDetails, so a press-in prefetch lands
// in exactly the cache entry the detail screen reads.
export const tvFullQuery = (seriesId: number) => {
  const region = deviceRegion();

  return queryOptions({
    queryKey: tmdbKey('tvFull', seriesId),
    queryFn: async () => {
      const { data } = await moviesApi.get<TvFullResponse>(MovieApiRoutes.tvDetails(seriesId), {
        params: {
          append_to_response: APPEND_TO_RESPONSE,
          include_image_language: tmdbImageLanguages(),
        },
      });

      const videos = mapVideos(data.videos?.results);
      const similar = mapTvShows(data.similar?.results);
      const recommendations = mapTvShows(data.recommendations?.results);
      const images = {
        backdrops: mapImages(data.images?.backdrops),
        logos: mapImages(data.images?.logos),
        posters: mapImages(data.images?.posters),
      };

      return {
        details: mapTvDetails(data),
        videos,
        trailers: videos.filter((video) => video.type === 'Trailer' || video.type === 'Teaser'),
        cast: mapCastMembers(data.credits?.cast),
        images,
        hasGallery: Boolean(
          images.backdrops.length || images.logos.length || images.posters.length
        ),
        reviews: mapReviews(data.reviews?.results),
        similar,
        recommendations,
        related: recommendations.length ? recommendations : similar,
        creator: data.created_by?.length
          ? {
              id: data.created_by[0].id,
              name: data.created_by[0].name ?? '',
              character: translate('detail.creator'),
              avatar: tmdbImage(data.created_by[0].profile_path, 'w342') ?? '',
            }
          : null,
        certification: pickCertification(
          data.content_ratings?.results,
          region,
          (entry) => entry.rating
        ),
        watchProviders: pickRegion(data['watch/providers']?.results, region),
      };
    },
  });
};

export const useTvFull = (seriesId: number) => {
  const {
    data: series,
    isLoading,
    isError,
    refetch,
  } = useQuery({ ...tvFullQuery(seriesId), enabled: !!seriesId });

  return { series, isLoading, isError, refetch };
};
