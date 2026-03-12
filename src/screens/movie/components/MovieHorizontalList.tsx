import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { MovieCard } from './MovieCard';

interface MovieHorizontalListProps {
  title?: string;
  movies: MovieProps[];
  variant?: 'poster' | 'backdrop';
  cardWidth?: number;
  cardHeight?: number;
  showSeeAll?: boolean;
  onItemPress?: (item: MovieProps) => void;
}

export const MovieHorizontalList = (props: MovieHorizontalListProps) => {
  const { title, movies, variant = 'poster', cardWidth, cardHeight, onItemPress } = props;

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <MovieCard
        rating={item.rating}
        movie={item}
        variant={variant}
        width={cardWidth}
        height={cardHeight}
        onPress={() =>
          onItemPress
            ? onItemPress(item)
            : router.push({
                pathname: '/(root)/movie/[id]',
                params: { id: item.id },
              })
        }
      />
    ),
    [variant, cardWidth, cardHeight, onItemPress]
  );

  return (
    <View className="gap-3">
      {title && (
        <View className="flex-row justify-between px-1">
          <Text className="!text-[18px] font-semibold">{title}</Text>
        </View>
      )}

      <FlashList
        horizontal
        data={movies}
        keyExtractor={(item) => `${item.id}`}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
