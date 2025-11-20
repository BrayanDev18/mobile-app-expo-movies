import { Text } from '@/components';
import { SimilarMoviesProps } from '@/interfaces';
import { formatSpecialDate } from '@/utils';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const MovieSimilar = ({ similarMovies }: { similarMovies: SimilarMoviesProps[] }) => (
  <Animated.View className="h-full" entering={FadeInDown.delay(200).springify()}>
    <FlashList
      numColumns={3}
      data={similarMovies}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, i) => `${item.id}-${i}`}
      renderItem={({ item: movie }) => (
        <Pressable onPress={() => router.push(`/movie/${movie.id}`)} className="m-1 flex-1 gap-2">
          <BlurView
            intensity={100}
            tint="dark"
            style={{
              flex: 1,
              borderRadius: 12,
              overflow: 'hidden',
            }}>
            <Image
              source={{ uri: movie.poster_path as string }}
              style={{
                width: '100%',
                height: 180,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />

            <View className="gap-1 p-1.5">
              <Text numberOfLines={1} className="!text-md font-medium leading-tight">
                {movie.title}
              </Text>

              <Text className="!text-neutral-400">
                {formatSpecialDate(movie.release_date as any)}
              </Text>
            </View>
          </BlurView>
        </Pressable>
      )}
      removeClippedSubviews
    />
  </Animated.View>
);
