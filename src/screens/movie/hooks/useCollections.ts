import { MovieApiRoutes } from '@/constants';
import { CollectionDetailsResponse, CollectionProps } from '@/interfaces';
import { moviesApi, tmdbKey } from '@/services';
import { mapMovies, tmdbImage } from '@/utils';
import { useQueries, useQuery } from '@tanstack/react-query';

const mapCollection = (data: CollectionDetailsResponse): CollectionProps => ({
  id: data.id,
  name: data.name.replace(/\s+Collection$/i, ''),
  overview: data.overview,
  poster: tmdbImage(data.poster_path),
  backdrop: tmdbImage(data.backdrop_path, 'w780'),
  parts: mapMovies(data.parts)
    .filter((part) => part.poster)
    .sort((a, b) => (a.releaseDate || '9999').localeCompare(b.releaseDate || '9999')),
});

const collectionQuery = (id: number) => ({
  queryKey: tmdbKey('collection', id),
  queryFn: async () => {
    const { data } = await moviesApi.get<CollectionDetailsResponse>(MovieApiRoutes.collection(id));

    return mapCollection(data);
  },
});

export const useCollections = (ids: number[]) => {
  const queries = useQueries({ queries: ids.map(collectionQuery) });

  const collections = queries
    .map((query) => query.data)
    .filter((collection): collection is CollectionProps => !!collection);

  return { collections, isLoading: queries.some((query) => query.isLoading) };
};

export const useCollection = (id?: number) => {
  const {
    data: collection,
    isLoading,
    isError,
    refetch,
  } = useQuery({ ...collectionQuery(id ?? 0), enabled: !!id });

  return { collection, isLoading, isError, refetch };
};
