import { MediaType, MovieVideoResponse } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieVideos = (movieId: number, mediaType: MediaType = 'movie') => {
  const {
    data: movieVideos = [],
    isLoading: isMovieVideosLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movieVideos', mediaType, movieId],
    enabled: Number.isFinite(movieId),
    queryFn: async () => {
      const {
        data: { results: videosFromApi },
      } = await moviesApi.get<MovieVideoResponse>(`/${mediaType}/${movieId}/videos`);

      return videosFromApi
        .map((video) => ({
          key: video.key,
          name: video.name,
          site: video.site,
          type: video.type,
          size: video.size ?? 0,
          movie_id: movieId,
          official: video.official ?? false,
          published_at: video.published_at ?? null,
          last_updated: 0,
        }))
        .reverse();
    },
  });

  return { movieVideos, isMovieVideosLoading, isError, refetch };
};
