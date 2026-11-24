import { MovieApiRoutes } from '@/constants';
import { TvEpisodeDetailsProps, TvEpisodeDetailsResponse } from '@/interfaces';
import { moviesApi, tmdbImageLanguages, tmdbKey } from '@/services';
import { mapTvEpisodeDetails } from '@/utils';
import { useQuery } from '@tanstack/react-query';

const APPEND_TO_RESPONSE = 'credits,images,videos';

// The response interceptor tags rejected errors with TMDB's HTTP status.
const isNotFoundError = (error: unknown) => (error as { status?: number } | null)?.status === 404;

export const useTvEpisode = (seriesId: number, seasonNumber: number, episodeNumber: number) => {
  const {
    data: episode,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: tmdbKey('tvEpisode', seriesId, seasonNumber, episodeNumber),
    enabled: !!seriesId && seasonNumber >= 0 && episodeNumber > 0,
    // A missing episode won't appear on retry — surface the empty state at once.
    retry: (failureCount, err) => !isNotFoundError(err) && failureCount < 3,
    queryFn: async (): Promise<TvEpisodeDetailsProps> => {
      const { data } = await moviesApi.get<TvEpisodeDetailsResponse>(
        MovieApiRoutes.tvEpisode(seriesId, seasonNumber, episodeNumber),
        {
          params: {
            append_to_response: APPEND_TO_RESPONSE,
            include_image_language: tmdbImageLanguages(),
          },
        }
      );

      return mapTvEpisodeDetails(data);
    },
  });

  return { episode, isLoading, isError, isNotFound: isNotFoundError(error), refetch };
};
