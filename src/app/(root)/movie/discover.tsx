import { useDiscoverMoviesInfinite } from '@/hooks';
import { DiscoverGrid } from '@/screens/movie/components';
import { useLocalSearchParams } from 'expo-router';

const DiscoverScreen = () => {
  const { genreId, providerId, yearFrom, yearTo, title } = useLocalSearchParams<{
    genreId?: string;
    providerId?: string;
    yearFrom?: string;
    yearTo?: string;
    title?: string;
  }>();

  const { movies, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDiscoverMoviesInfinite({
      genreId: genreId ? +genreId : undefined,
      providerId: providerId ? +providerId : undefined,
      yearFrom: yearFrom ? +yearFrom : undefined,
      yearTo: yearTo ? +yearTo : undefined,
    });

  return (
    <DiscoverGrid
      title={title}
      items={movies}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default DiscoverScreen;
