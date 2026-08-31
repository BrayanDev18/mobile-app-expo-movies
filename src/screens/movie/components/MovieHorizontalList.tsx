import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { openMediaDetails } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { MovieCard } from './MovieCard';

interface MovieHorizontalListProps {
  title?: string;
  movies: MovieProps[];
  variant?: 'poster' | 'backdrop';
  cardWidth?: number;
  cardHeight?: number;
  onSeeAll?: () => void;
}

export const MovieHorizontalList = (props: MovieHorizontalListProps) => {
  const { title, movies, variant = 'poster', cardWidth, cardHeight, onSeeAll } = props;

  const renderItem = useCallback(
    ({ item }: { item: MovieProps }) => (
      <MovieCard
        rating={item.rating}
        movie={item}
        variant={variant}
        width={cardWidth}
        height={cardHeight}
        onPress={() => openMediaDetails(item)}
      />
    ),
    [variant, cardWidth, cardHeight]
  );

  return (
    <View className="gap-3">
      {title && (
        <View className="flex-row items-center justify-between px-1">
          <Text className="!text-[18px] font-semibold">{title}</Text>

          {onSeeAll && (
            <TouchableHighlight
              onPress={onSeeAll}
              underlayColor="#404040"
              accessibilityRole="button"
              accessibilityLabel={`See all ${title}`}
              className="h-11 w-11 items-center justify-center rounded-full">
              <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
            </TouchableHighlight>
          )}
        </View>
      )}

      <FlashList
        horizontal
        data={movies}
        keyExtractor={(item) => `${item.id}`}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
