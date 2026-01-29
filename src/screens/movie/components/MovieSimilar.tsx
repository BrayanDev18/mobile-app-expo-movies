import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { formatSpecialDate } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, TouchableHighlight, View } from 'react-native';

export const MovieSimilar = ({
  movieId,
  similarMovies,
}: {
  movieId: number;
  similarMovies: MovieProps[];
}) => {
  const renderItem = useCallback(
    ({ item: movie }: { item: MovieProps }) => <SimiliarMovieItem movie={movie} />,
    []
  );

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between">
        <Text className="!text-lg font-bold">Similar movies</Text>

        {similarMovies.length > 5 ? (
          <TouchableHighlight
            onPress={() =>
              router.push({
                pathname: '/movie/similar',
                params: { id: movieId },
              })
            }
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

const SimiliarMovieItem = ({ movie }: { movie: MovieProps }) => {
  return (
    <Pressable
      onPress={() => router.push(`/movie/${movie.id}`)}
      className="w-[168px] gap-2 rounded-bl-2xl rounded-br-2xl bg-neutral-950/30">
      <Image
        source={{ uri: movie.poster as string }}
        style={{
          width: '100%',
          height: 205,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
        contentFit="cover"
        cachePolicy="memory-disk"
      />

      <View className="gap-1 p-2">
        <Text numberOfLines={1} className="!text-md font-semibold">
          {movie.title}
        </Text>

        <Text className="!text-neutral-400">{formatSpecialDate(movie.releaseDate as string)}</Text>
      </View>
    </Pressable>
  );
};
