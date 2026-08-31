import { FlashList, Loader, Screen, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { openMediaDetails } from '@/utils';
import { useCallback } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { MovieCard } from './MovieCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

interface DiscoverGridProps {
  title?: string;
  items: MovieProps[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

// The infinite two-column grid both discover routes render.
export const DiscoverGrid = (props: DiscoverGridProps) => {
  const { title, items, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = props;

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
      <FlashList
        data={items}
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
    </Screen>
  );
};
