import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { PersonProps, TmdbPerson } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

export const useTrendingPeople = () => {
  const { data: trendingPeople = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['trending-people'],
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get(MovieApiRoutes.trendingPeople('day'));

      if (!results?.length) return [];

      return results.map((p: TmdbPerson) => ({
        id: p.id,
        name: p.name ?? '',
        avatar: p.profile_path ? `${IMAGE_BASE_URL}${p.profile_path}` : null,
        department: p.known_for_department ?? '',
        knownFor: (p.known_for ?? []).slice(0, 3).map((k) => ({
          id: k.id,
          title: k.title ?? k.name ?? '',
          overview: k.overview ?? '',
          poster: k.poster_path ? `${IMAGE_BASE_URL}${k.poster_path}` : '',
          backdrop: k.backdrop_path ? `${IMAGE_BASE_URL}${k.backdrop_path}` : null,
          rating: k.vote_average ?? 0,
          releaseDate: k.release_date ?? k.first_air_date ?? '',
          media_type: k.media_type,
        })),
      }));
    },
  });

  return {
    trendingPeople: trendingPeople as PersonProps[],
    isLoading,
    isError,
    refetch,
  };
};
