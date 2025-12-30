import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieByCategoryProps, MovieProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useGetTrendingAll = () => {
  const { data: trendingAll = [], isLoading } = useQuery({
    queryKey: ['trending-all'],
    queryFn: async () => {
      const {
        data: { results: trendingAll },
      } = await moviesApi.get(MovieApiRoutes.trendingAll('day'));

      if (!trendingAll || trendingAll.length === 0) {
        return [];
      }

      const newTrendingAllArray = trendingAll.map((movie: MovieByCategoryProps) => ({
        id: movie.id,
        title: movie.title ?? movie.original_title,
        overview: movie.overview,
        poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
        rating: movie.vote_average,
        releaseDate: movie.release_date,
      }));

      return newTrendingAllArray;
    },
  });

  return {
    trendingAll: trendingAll as MovieProps[],
    isLoading,
  };
};
