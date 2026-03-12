import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProps } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useDiscoverTv = (genreId: number | null, sortBy: string = 'popularity.desc') => {
  const { data: series = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['discover-tv', genreId, sortBy],
    enabled: genreId !== null,
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get(MovieApiRoutes.discoverTv, {
        params: {
          with_genres: genreId,
          sort_by: sortBy,
        },
      });

      if (!results?.length) return [];

      return results.map((s: any) => ({
        id: s.id,
        title: s.name ?? '',
        overview: s.overview ?? '',
        poster: s.poster_path ? `${IMAGE_BASE_URL}${s.poster_path}` : '',
        backdrop: s.backdrop_path ? `${IMAGE_BASE_URL}${s.backdrop_path}` : null,
        rating: s.vote_average ?? 0,
        releaseDate: s.first_air_date ?? '',
        media_type: 'tv' as const,
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
