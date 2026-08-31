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
import { useQuery } from '@tanstack/react-query';

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

export const useTvFull = (seriesId: number) => {
  const region = deviceRegion();

  const {
    data: series,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('tvFull', seriesId),
    enabled: !!seriesId,
    queryFn: async () => {
      const { data } = await moviesApi.get<TvFullResponse>(MovieApiRoutes.tvDetails(seriesId), {
        params: {
          append_to_response: APPEND_TO_RESPONSE,
          include_image_language: tmdbImageLanguages(),
        },
      });

      return {
        details: mapTvDetails(data),
        videos: mapVideos(data.videos?.results),
        cast: mapCastMembers(data.credits?.cast),
        images: {
          backdrops: mapImages(data.images?.backdrops),
          logos: mapImages(data.images?.logos),
          posters: mapImages(data.images?.posters),
        },
        reviews: mapReviews(data.reviews?.results),
        similar: mapTvShows(data.similar?.results),
        recommendations: mapTvShows(data.recommendations?.results),
        creator: data.created_by?.length
          ? {
              id: data.created_by[0].id,
              name: data.created_by[0].name ?? '',
              character: 'Creator',
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

  return { series, isLoading, isError, refetch };
};
