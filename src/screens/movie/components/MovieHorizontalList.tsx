import { Text } from '@/components';
import { MovieByCategoryProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { MovieCard } from './MovieCard';

interface MovieHorizontalListProps {
  title?: string;
  width?: number;
  height?: number;
  movies: MovieByCategoryProps[];
  showSeeAll?: boolean;
  loadNextPage?: () => void;
}

export const MovieHorizontalList = (props: MovieHorizontalListProps) => {
  const { title, width, height, movies, showSeeAll = true, loadNextPage } = props;

  const isLoading = useRef(false);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isLoading.current) return;

    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    const isEnded = contentOffset.x + layoutMeasurement.width + 600 >= contentSize.width;

    if (!isEnded) return;

    isLoading.current = true;

    loadNextPage && loadNextPage();
  };

  useEffect(() => {
    setTimeout(() => {
      isLoading.current = false;
    }, 200);
  }, [movies]);

  return (
    <View className="gap-4">
      <View className="flex-row justify-between px-1">
        {title ? <Text className="!text-xl font-semibold">{title}</Text> : null}
      </View>

      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={movies}
        onScroll={onScroll}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        scrollEventThrottle={16}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            rating={item.vote_average}
            title={item.title}
            year={formatDate(item.release_date)}
            onPress={() => {
              router.push({
                pathname: '/(root)/movie/[id]',
                params: { id: item.id, category: item.category },
              });
            }}
            movieImage={item.poster_path}
            width={width || 150}
            height={height || 220}
          />
        )}
      />
    </View>
  );
};
