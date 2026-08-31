import { SectionTitle } from '@/components';
import { MovieProps } from '@/interfaces';
import { openMediaDetails } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { MovieCard } from './MovieCard';

interface MovieSimilarProps {
  movieId: number;
  similarMovies: MovieProps[];
  title?: string;
}

export const MovieSimilar = ({
  movieId,
  similarMovies,
  title = 'You might also like',
}: MovieSimilarProps) => {
  const renderItem = useCallback(
    ({ item: movie }: { item: MovieProps }) => (
      <MovieCard
        movie={movie}
        rating={movie.rating}
        width={145}
        height={200}
        onPress={() => openMediaDetails(movie)}
      />
    ),
    []
  );

  return (
    <View className="gap-3">
      <SectionTitle
        title={title}
        onSeeAll={
          similarMovies.length > 5
            ? () => router.push({ pathname: '/(root)/movie/similar', params: { id: movieId } })
            : undefined
        }
      />

      <FlashList
        horizontal
        data={similarMovies.slice(0, 5)}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
