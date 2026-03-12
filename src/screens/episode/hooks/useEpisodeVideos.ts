import { MovieApiRoutes } from '@/constants';
import { MovieVideoResponse, MovieVideosProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useEpisodeVideos = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const { data: episodeVideos, isLoading: isEpisodeVideosLoading } = useQuery({
    queryKey: ['episodeVideos', seriesId, seasonNumber, episodeNumber],
    queryFn: async () => {
      const {
        data: { results: videosFromApi },
      } = await moviesApi.get<MovieVideoResponse>(
        MovieApiRoutes.tvEpisodeVideos(seriesId, seasonNumber, episodeNumber)
      );

      return videosFromApi.map(
        (video): MovieVideosProps => ({
          key: video.key,
          name: video.name,
          site: video.site,
          type: video.type,
          size: video.size ?? 0,
          movie_id: 0,
          official: video.official ?? false,
          published_at: video.published_at ?? null,
          last_updated: Math.floor(Date.now() / 1000),
        })
      );
    },
    enabled: seriesId > 0 && seasonNumber >= 0 && episodeNumber > 0,
  });

  return {
    episodeVideos: (episodeVideos ?? []) as MovieVideosProps[],
    isEpisodeVideosLoading,
  };
};
