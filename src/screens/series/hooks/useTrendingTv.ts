import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProps, TvSeriesByCategoryProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useTrendingTv = () => {
  const { data: trendingTv = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['trending-tv'],
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get(MovieApiRoutes.trendingTv('day'));

      if (!results || results.length === 0) {
        return [];
      }

      return results.map((s: TvSeriesByCategoryProps) => ({
        id: s.id,
        title: s.name ?? s.original_name,
        overview: s.overview,
        poster: s.poster_path ? `${IMAGE_BASE_URL}${s.poster_path}` : null,
        backdrop: s.backdrop_path ? `${IMAGE_BASE_URL}${s.backdrop_path}` : null,
        rating: s.vote_average,
        releaseDate: s.first_air_date,
      }));
    },
  });

  return {
    trendingTv: trendingTv as MovieProps[],
    isLoading,
    isError,
    refetch,
  };
};
