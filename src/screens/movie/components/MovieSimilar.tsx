import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { TouchableHighlight, View } from 'react-native';
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
        onPress={() => router.push(`/movie/${movie.id}`)}
      />
    ),
    []
  );

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">{title}</Text>

        {similarMovies.length > 5 ? (
          <TouchableHighlight
            onPress={() =>
              router.push({
                pathname: '/movie/similar',
                params: { id: movieId },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`See all ${title}`}
            className="h-12 w-12 items-center justify-center rounded-full"
            underlayColor="#404040">
            <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
          </TouchableHighlight>
        ) : null}
      </View>

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
