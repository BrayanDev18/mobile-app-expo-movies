import { FlashList, SectionTitle } from '@/components';
import { MovieProps } from '@/interfaces';
import { openMediaDetails } from '@/utils';
import { useCallback } from 'react';
import { View } from 'react-native';
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
      {title && <SectionTitle title={title} onSeeAll={onSeeAll} className="px-1" />}

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
