import { Text } from '@/components';
import { MovieByCategoryProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
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
  const { title, width, height, movies } = props;

  const renderItem = useCallback(
    ({ item }: { item: MovieByCategoryProps }) => (
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
        width={width || 160}
        height={height || 220}
      />
    ),
    [height, width]
  );

  return (
    <View className="gap-3">
      <View className="flex-row justify-between px-1">
        {title ? <Text className="!text-[18px] font-semibold">{title}</Text> : null}
      </View>

      <FlashList
        horizontal
        data={movies}
        keyExtractor={(item) => `${item.id}`}
        scrollEventThrottle={16}
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
