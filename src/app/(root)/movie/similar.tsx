import { Loader, Screen, Text } from '@/components';
import { useSimilarMovies } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { formatSpecialDate, IMAGE_PLACEHOLDER, openMediaDetails, tmdbImage } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, View } from 'react-native';

const SimilarMovies = () => {
  const { id } = useLocalSearchParams();

  const { similarMovies, isSimilarMoviesLoading } = useSimilarMovies(+id);

  const renderItem = useCallback(
    ({ item: movie }: { item: MovieProps }) => <SimiliarMovieItem movie={movie} />,
    []
  );

  if (isSimilarMoviesLoading) return <Loader />;

  return (
    <Screen preset="auto" safeAreaEdges={['top', 'bottom']} canGoBack>
      <View className="flex-1 justify-center gap-1 px-2 pt-14">
        <FlashList
          numColumns={2}
          data={similarMovies}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          renderItem={renderItem}
        />
      </View>
    </Screen>
  );
};

const SimiliarMovieItem = ({ movie }: { movie: MovieProps }) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${movie.title}`}
      onPress={() => openMediaDetails(movie)}
      className="m-2 flex-1 rounded-bl-2xl rounded-br-2xl bg-neutral-950/30">
      <Image
        source={{ uri: tmdbImage(movie.poster, 'w342') ?? undefined }}
        style={{
          width: '100%',
          height: 240,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        }}
        contentFit="cover"
        cachePolicy="memory-disk"
        placeholder={IMAGE_PLACEHOLDER}
      />

      <View className="gap-1 p-3">
        <Text numberOfLines={1} className="!text-md font-semibold">
          {movie.title}
        </Text>

        <Text className="!text-neutral-400">{formatSpecialDate(movie.releaseDate as string)}</Text>
      </View>
    </Pressable>
  );
};

export default SimilarMovies;
