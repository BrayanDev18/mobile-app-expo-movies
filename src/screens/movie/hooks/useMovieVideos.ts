import { MovieVideoResponse, MovieVideosProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useMovieVideos = (movieId: number) => {
  const { data: movieVideos, isLoading: isMovieVideosLoading } = useQuery({
    queryKey: ['movieVideos', movieId],
    queryFn: async () => {
      const {
        data: { results: videosFromApi },
      } = await moviesApi.get<MovieVideoResponse>(`/movie/${movieId}/videos`);

      const newMovieVideos = videosFromApi.map((video) => ({
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        size: video.size ?? 0,
        official: video.official ?? false,
        published_at: video.published_at ?? null,
        last_updated: Math.floor(Date.now() / 1000),
      }));

      return newMovieVideos;
    },
  });

  return {
    movieVideos: movieVideos as MovieVideosProps[],
    isMovieVideosLoading,
  };
};
