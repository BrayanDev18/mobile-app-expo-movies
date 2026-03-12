import { MovieVideoResponse, MovieVideosProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useSeriesVideos = (seriesId: number) => {
  const { data: seriesVideos, isLoading: isSeriesVideosLoading } = useQuery({
    queryKey: ['seriesVideos', seriesId],
    queryFn: async () => {
      const {
        data: { results: videosFromApi },
      } = await moviesApi.get<MovieVideoResponse>(`/tv/${seriesId}/videos`);

      return videosFromApi.map((video) => ({
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        size: video.size ?? 0,
        official: video.official ?? false,
        published_at: video.published_at ?? null,
        last_updated: Math.floor(Date.now() / 1000),
      }));
    },
  });

  return {
    seriesVideos: seriesVideos as MovieVideosProps[],
    isSeriesVideosLoading,
  };
};
