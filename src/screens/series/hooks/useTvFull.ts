import { MovieApiRoutes } from '@/constants';
import {
  MovieCast,
  MovieImages,
  MovieImagesProps,
  MovieReviewsResponse,
  MovieVideoResponse,
  RegionWatchProvidersProps,
  TvByCategoryResponse,
  TvDetails,
} from '@/interfaces';
import { moviesApi, tmdbImageLanguages } from '@/services';
import { mapTvShows, mapTvToDb, tmdbImage } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import * as Localization from 'expo-localization';

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

const mapImages = (images: MovieImages[] = []): MovieImagesProps[] =>
  images.map((image) => ({
    url: tmdbImage(image.file_path),
    aspectRatio: image.aspect_ratio,
  }));

const certificationFor = (
  contentRatings: TvFullResponse['content_ratings'],
  region: string
): string | null => {
  const results = contentRatings?.results ?? [];
  const entry =
    results.find((item) => item.iso_3166_1 === region) ??
    results.find((item) => item.iso_3166_1 === 'US');

  return entry?.rating || null;
};

export const useTvFull = (seriesId: number) => {
  const region = Localization.getLocales()[0]?.regionCode ?? 'US';

  const {
    data: series,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['tvFull', seriesId],
    enabled: !!seriesId,
    queryFn: async () => {
      const { data } = await moviesApi.get<TvFullResponse>(MovieApiRoutes.tvDetails(seriesId), {
        params: {
          append_to_response: APPEND_TO_RESPONSE,
          include_image_language: tmdbImageLanguages(),
        },
      });

      return {
        details: mapTvToDb(data),
        videos: (data.videos?.results ?? []).map((video) => ({
          key: video.key,
          name: video.name,
          site: video.site,
          type: video.type,
          size: video.size ?? 0,
          movie_id: seriesId,
          official: video.official ?? false,
          published_at: video.published_at ?? null,
          last_updated: Math.floor(Date.now() / 1000),
        })),
        cast: (data.credits?.cast ?? []).map((member) => ({
          id: member.id,
          name: member.name ?? '',
          character: member.character ?? '',
          avatar: tmdbImage(member.profile_path, 'w342') ?? '',
        })),
        images: {
          backdrops: mapImages(data.images?.backdrops),
          logos: mapImages(data.images?.logos),
          posters: mapImages(data.images?.posters),
        },
        reviews: (data.reviews?.results ?? []).map((review) => ({
          id: review.id,
          movie_id: seriesId,
          author: review.author,
          author_details: review.author_details,
          content: review.content,
          created_at: review.created_at,
          url: review.url,
        })),
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
        certification: certificationFor(data.content_ratings, region),
        watchProviders:
          data['watch/providers']?.results?.[region] ??
          data['watch/providers']?.results?.US ??
          null,
      };
    },
  });

  return { series, isLoading, isError, refetch };
};
