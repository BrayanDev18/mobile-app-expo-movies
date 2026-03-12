import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProps, TvSeriesByCategoryProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useSeriesByCategory = (category: string) => {
  const { data: series = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tv-series', category],
    queryFn: async () => {
      const {
        data: { results: apiSeries },
      } = await moviesApi.get(MovieApiRoutes.tvByCategory(category));

      if (!apiSeries || apiSeries.length === 0) {
        return [];
      }

      return apiSeries.map((s: TvSeriesByCategoryProps) => ({
        id: s.id,
        title: s.name ?? s.original_name,
        overview: s.overview,
        poster: s.poster_path ? `${IMAGE_BASE_URL}${s.poster_path}` : null,
        backdrop: s.backdrop_path ? `${IMAGE_BASE_URL}${s.backdrop_path}` : null,
        rating: s.vote_average,
        releaseDate: s.first_air_date,
        category,
      }));
    },
  });

  return {
    series: series as MovieProps[],
    isLoading,
    isError,
    refetch,
  };
};
