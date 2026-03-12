import { IMAGE_BASE_URL, MovieApiRoutes } from '@/constants';
import { MovieProps, PersonProps, TmdbKnownFor, TmdbPerson } from '@/interfaces';
import { moviesApi } from '@/services';
import { useQuery } from '@tanstack/react-query';

type SearchType = 'multi' | 'movie' | 'tv' | 'person';

const mapKnownFor = (items: TmdbKnownFor[]): MovieProps[] =>
  (items ?? []).slice(0, 3).map((k) => ({
    id: k.id,
    title: k.title ?? k.name ?? '',
    overview: k.overview ?? '',
    poster: k.poster_path ? `${IMAGE_BASE_URL}${k.poster_path}` : '',
    backdrop: k.backdrop_path ? `${IMAGE_BASE_URL}${k.backdrop_path}` : null,
    rating: k.vote_average ?? 0,
    releaseDate: k.release_date ?? k.first_air_date ?? '',
    media_type: k.media_type,
  }));

const getEndpoint = (type: SearchType, query: string) => {
  switch (type) {
    case 'multi':
      return MovieApiRoutes.searchMulti(query);
    case 'movie':
      return MovieApiRoutes.searchMovies(query);
    case 'tv':
      return MovieApiRoutes.searchTv(query);
    case 'person':
      return MovieApiRoutes.searchPerson(query);
  }
};

export const useSearch = (query: string, type: SearchType) => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['search', type, query],
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const {
        data: { results },
      } = await moviesApi.get(getEndpoint(type, query));

      if (type === 'person') {
        return {
          people: (results ?? []).map((p: TmdbPerson) => ({
            id: p.id,
            name: p.name ?? '',
            avatar: p.profile_path ? `${IMAGE_BASE_URL}${p.profile_path}` : null,
            department: p.known_for_department ?? '',
            knownFor: mapKnownFor(p.known_for),
          })),
          movies: [] as MovieProps[],
        };
      }

      const movies: MovieProps[] = (results ?? [])
        .filter((r: any) => r.media_type !== 'person')
        .map((r: any) => ({
          id: r.id,
          title: r.title ?? r.name ?? '',
          overview: r.overview ?? '',
          poster: r.poster_path ? `${IMAGE_BASE_URL}${r.poster_path}` : '',
          backdrop: r.backdrop_path ? `${IMAGE_BASE_URL}${r.backdrop_path}` : null,
          rating: r.vote_average ?? 0,
          releaseDate: r.release_date ?? r.first_air_date ?? '',
          media_type: r.media_type ?? (type === 'tv' ? 'tv' : 'movie'),
        }));

      return { movies, people: [] as PersonProps[] };
    },
  });

  return {
    searchMovies: data?.movies ?? [],
    searchPeople: data?.people ?? [],
    isLoading,
    isError,
    refetch,
  };
};
