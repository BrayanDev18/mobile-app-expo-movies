import { FlashList, Loader, Screen, Text } from '@/components';
import { useDiscoverTvInfinite } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { MovieCard } from '@/screens/movie/components';
import { openMediaDetails } from '@/utils';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

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

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <View className="m-1 flex-1 items-center">
        <MovieCard
          movie={item}
          rating={item.rating}
          width={CARD_WIDTH}
          onPress={() => openMediaDetails(item)}
        />
      </View>
    ),
    []
  );

  if (isLoading) return <Loader />;

  return (
    <Screen preset="fixed" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="h-full">
        <FlashList
          data={series}
          numColumns={2}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-3 pt-14"
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.6}
          ListHeaderComponent={
            <Text accessibilityRole="header" className="mb-4 !text-2xl font-bold">
              {title}
            </Text>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator className="py-6" color="rgba(255,255,255,0.6)" />
            ) : null
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default DiscoverTvScreen;
