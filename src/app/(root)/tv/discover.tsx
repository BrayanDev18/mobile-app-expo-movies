import { useDiscoverTvInfinite } from '@/hooks';
import { DiscoverGrid } from '@/screens/movie/components';
import { useLocalSearchParams } from 'expo-router';

const DiscoverTvScreen = () => {
  const { genreId, networkId, providerId, originalLanguage, yearFrom, yearTo, showType, minVotes, title } =
    useLocalSearchParams<{
      genreId?: string;
      networkId?: string;
      providerId?: string;
      originalLanguage?: string;
      yearFrom?: string;
      yearTo?: string;
      showType?: string;
      minVotes?: string;
      title?: string;
    }>();

  const { series, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDiscoverTvInfinite({
      genreId: genreId ? +genreId : undefined,
      networkId: networkId ? +networkId : undefined,
      providerId: providerId ? +providerId : undefined,
      originalLanguage,
      yearFrom: yearFrom ? +yearFrom : undefined,
      yearTo: yearTo ? +yearTo : undefined,
      showType: showType ? +showType : undefined,
      minVotes: minVotes ? +minVotes : undefined,
    });

  return (
    <DiscoverGrid
      title={title}
      items={series}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
};

export default DiscoverTvScreen;
