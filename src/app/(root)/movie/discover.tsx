import { FlashList, Loader, Screen, Text } from '@/components';
import { useDiscoverMovies } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { MovieCard } from '@/screens/movie/components';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

const DiscoverScreen = () => {
  const { genreId, providerId, yearFrom, yearTo, title } = useLocalSearchParams<{
    genreId?: string;
    providerId?: string;
    yearFrom?: string;
    yearTo?: string;
    title?: string;
  }>();

  const { movies, isLoading } = useDiscoverMovies({
    genreId: genreId ? +genreId : undefined,
    providerId: providerId ? +providerId : undefined,
    yearFrom: yearFrom ? +yearFrom : undefined,
    yearTo: yearTo ? +yearTo : undefined,
  });

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <View className="m-1 flex-1 items-center">
        <MovieCard
          movie={item}
          rating={item.rating}
          width={CARD_WIDTH}
          onPress={() => router.push({ pathname: '/(root)/movie/[id]', params: { id: item.id } })}
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
          data={movies}
          numColumns={2}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-3 pt-14"
          ListHeaderComponent={
            <Text accessibilityRole="header" className="mb-4 !text-2xl font-bold">
              {title}
            </Text>
          }
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

export default DiscoverScreen;
