import { Loader, Screen, Text } from '@/components';
import { useMovieCast } from '@/hooks';
import { MovieCastProps } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CastList = () => {
  const { id } = useLocalSearchParams();
  const { bottom } = useSafeAreaInsets();

  const { movieCast, isMovieCastLoading } = useMovieCast(+id);

  if (!movieCast.length || isMovieCastLoading) {
    return <Loader />;
  }

  return (
    <Screen safeAreaEdges={['top', 'bottom']} canGoBack preset="fixed" className="px-4">
      <View className="items-center justify-center">
        <View className="mb-5 flex-row gap-5">
          <View className="items-center justify-center rounded-full border-[1px] bg-dark-300 px-5">
            <Text className="">Actors</Text>
          </View>

          <View className="items-center justify-center rounded-full px-5 dark:bg-dark-300">
            <Text className="">Producers</Text>
          </View>

          <View className="rounded-full px-5 py-2.5 dark:bg-dark-300">
            <Text className="">Directors</Text>
          </View>
        </View>
      </View>

      <View style={{ paddingBottom: bottom + 60 }} className="h-full">
        <FlashList
          data={movieCast}
          scrollEventThrottle={16}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, i) => `${item.movie_id}-${i}`}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item, index }) => <CastItem cast={item} index={index} />}
        />
      </View>
    </Screen>
  );
};

export default CastList;

const CastItem = memo(({ cast, index }: { cast: MovieCastProps; index: number }) => {
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(100 * index).springify()}
      onPress={() => router.push(`/movie/cast/${cast.id}`)}
      className="flex-row items-center justify-between rounded-xl bg-neutral-800 p-2.5">
      <View className="flex-row items-center gap-x-3">
        <Image
          source={{ uri: cast.profile_path as string }}
          style={{ width: 62, height: 62, borderRadius: 8 }}
          cachePolicy="memory-disk"
        />

        <View className="gap-1.5">
          <Text className="!text-lg font-medium">{cast.name}</Text>

          <Text className="!text-[14.5px] font-normal !text-neutral-400">{cast.character}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward-outline" color="#757575" size={22} />
    </AnimatedPressable>
  );
});
