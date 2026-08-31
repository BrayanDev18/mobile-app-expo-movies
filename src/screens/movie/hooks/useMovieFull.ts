import { MovieApiRoutes } from '@/constants';
import {
  MovieCast,
  MovieDetails,
  MovieImages,
  MovieReviewsResponse,
  MovieVideoResponse,
  MoviesByCategoryResponse,
  RegionWatchProvidersProps,
} from '@/interfaces';
import { moviesApi, tmdbImageLanguages, tmdbKey } from '@/services';
import {
  deviceRegion,
  mapCastMembers,
  mapImages,
  mapMovieDetails,
  mapMovies,
  mapReviews,
  mapVideos,
  pickCertification,
  pickRegion,
  tmdbImage,
} from '@/utils';
import { useQuery } from '@tanstack/react-query';

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

export const useMovieFull = (movieId: number) => {
  const region = deviceRegion();

  const {
    data: movie,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('movieFull', movieId),
    enabled: !!movieId,
    queryFn: async () => {
      const { data } = await moviesApi.get<MovieFullResponse>(MovieApiRoutes.details(movieId), {
        params: {
          append_to_response: APPEND_TO_RESPONSE,
          include_image_language: tmdbImageLanguages(),
        },
      });

      const videos = mapVideos(data.videos?.results);
      const similar = mapMovies(data.similar?.results);
      const recommendations = mapMovies(data.recommendations?.results);
      const images = {
        backdrops: mapImages(data.images?.backdrops),
        logos: mapImages(data.images?.logos),
        posters: mapImages(data.images?.posters),
      };

      return {
        details: mapMovieDetails(data),
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
        collection: data.belongs_to_collection
          ? {
              id: data.belongs_to_collection.id,
              name: data.belongs_to_collection.name,
              backdrop:
                data.belongs_to_collection.backdrop_path ??
                data.belongs_to_collection.poster_path ??
                null,
            }
          : null,
        director: mapDirector(data.credits?.crew),
        certification: pickCertification(data.release_dates?.results, region, (entry) =>
          entry.release_dates?.find((date) => date.certification)?.certification
        ),
        watchProviders: pickRegion(data['watch/providers']?.results, region),
      };
    },
  });

  return { movie, isLoading, isError, refetch };
};
