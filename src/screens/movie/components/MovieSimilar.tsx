import { Text } from '@/components';
import { SimilarMoviesProps } from '@/interfaces';
import { formatSpecialDate } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

export const MovieSimilar = ({ similarMovies }: { similarMovies: SimilarMoviesProps[] }) => (
  <FlashList
    horizontal
    showsHorizontalScrollIndicator={false}
    data={similarMovies.slice(0, 10)}
    scrollEventThrottle={16}
    keyExtractor={(item, i) => `${item.id}-${i}`}
    ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
    renderItem={({ item: movie }) => (
      <Pressable
        onPress={() => router.push(`/movie/${movie.id}`)}
        style={{ width: 144 }}
        className="gap-2">
        <Image
          source={{ uri: movie.poster_path as string }}
          style={{ width: '100%', height: 216, borderRadius: 13 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        <View className="gap-1 px-1">
          <Text numberOfLines={1} className="!text-md font-medium leading-tight">
            {movie.title}
          </Text>

          <Text className="!text-neutral-400">{formatSpecialDate(movie.release_date as any)}</Text>
        </View>
      </Pressable>
    )}
  />
);
