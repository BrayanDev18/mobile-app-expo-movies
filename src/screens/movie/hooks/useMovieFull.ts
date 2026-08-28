import { MovieApiRoutes } from '@/constants';
import {
  MovieCast,
  MovieDetails,
  MovieImages,
  MovieImagesProps,
  MovieReviewsResponse,
  MovieVideoResponse,
  MoviesByCategoryResponse,
  RegionWatchProvidersProps,
} from '@/interfaces';
import { moviesApi } from '@/services';
import { mapMovies, mapMovieToDb, tmdbImage } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import * as Localization from 'expo-localization';

const APPEND_TO_RESPONSE =
  'videos,credits,images,reviews,similar,recommendations,release_dates,watch/providers';

interface ReleaseDatesEntry {
  iso_3166_1: string;
  release_dates: { certification: string }[];
}

interface CrewMemberProps {
  id: number;
  name: string | null;
  job: string | null;
  profile_path: string | null;
}

interface MovieFullResponse extends MovieDetails {
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  videos?: MovieVideoResponse;
  credits?: { cast: MovieCast[]; crew?: CrewMemberProps[] };
  images?: { backdrops: MovieImages[]; logos: MovieImages[]; posters: MovieImages[] };
  reviews?: MovieReviewsResponse;
  similar?: MoviesByCategoryResponse;
  recommendations?: MoviesByCategoryResponse;
  release_dates?: { results: ReleaseDatesEntry[] };
  'watch/providers'?: { results: Record<string, RegionWatchProvidersProps> };
}

const mapImages = (images: MovieImages[] = []): MovieImagesProps[] =>
  images.map((image) => ({
    url: tmdbImage(image.file_path),
    aspectRatio: image.aspect_ratio,
  }));

const mapDirector = (crew?: CrewMemberProps[]) => {
  const director = crew?.find((member) => member.job === 'Director');

  if (!director) return null;

  return {
    id: director.id,
    name: director.name ?? '',
    character: 'Director',
    avatar: tmdbImage(director.profile_path, 'w342') ?? '',
  };
};

const certificationFor = (
  releaseDates: MovieFullResponse['release_dates'],
  region: string
): string | null => {
  const results = releaseDates?.results ?? [];
  const entry =
    results.find((item) => item.iso_3166_1 === region) ??
    results.find((item) => item.iso_3166_1 === 'US');

  return entry?.release_dates?.find((date) => date.certification)?.certification || null;
};

export const useMovieFull = (movieId: number) => {
  const locale = Localization.getLocales()[0];
  const region = locale?.regionCode ?? 'US';
  const language = locale?.languageCode ?? 'en';

  const {
    data: movie,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movieFull', movieId],
    enabled: !!movieId,
    queryFn: async () => {
      const { data } = await moviesApi.get<MovieFullResponse>(MovieApiRoutes.details(movieId), {
        params: {
          append_to_response: APPEND_TO_RESPONSE,
          include_image_language: `${language},null`,
        },
      });

      return {
        details: mapMovieToDb(data),
        videos: (data.videos?.results ?? []).map((video) => ({
          key: video.key,
          name: video.name,
          site: video.site,
          type: video.type,
          size: video.size ?? 0,
          movie_id: movieId,
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
          movie_id: movieId,
          author: review.author,
          author_details: review.author_details,
          content: review.content,
          created_at: review.created_at,
          url: review.url,
        })),
        similar: mapMovies(data.similar?.results),
        recommendations: mapMovies(data.recommendations?.results),
        collection: data.belongs_to_collection
          ? {
              id: data.belongs_to_collection.id,
              name: data.belongs_to_collection.name,
              backdrop: tmdbImage(
                data.belongs_to_collection.backdrop_path ?? data.belongs_to_collection.poster_path,
                'w780'
              ),
            }
          : null,
        director: mapDirector(data.credits?.crew),
        certification: certificationFor(data.release_dates, region),
        watchProviders:
          data['watch/providers']?.results?.[region] ??
          data['watch/providers']?.results?.US ??
          null,
      };
    },
  });

  return { movie, isLoading, isError, refetch };
};
