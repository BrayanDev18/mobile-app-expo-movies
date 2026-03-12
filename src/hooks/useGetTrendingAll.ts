import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

interface TrendingAllItem {
  id: number;
  media_type: 'movie' | 'tv';
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export const useGetTrendingAll = () => {
  const {
    data: trendingAll = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['trending-all'],
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get(MovieApiRoutes.trendingAll('day'));

      if (!results || results.length === 0) return [];

      return results.map((item: TrendingAllItem) => ({
        id: item.id,
        title: item.title ?? item.name ?? item.original_title ?? item.original_name ?? '',
        overview: item.overview,
        poster: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
        backdrop: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : null,
        rating: item.vote_average,
        releaseDate: item.release_date ?? item.first_air_date ?? '',
        media_type: item.media_type,
      }));
    },
  });

  return {
    trendingAll: trendingAll as MovieProps[],
    isLoading,
    isError,
    refetch,
  };
};
