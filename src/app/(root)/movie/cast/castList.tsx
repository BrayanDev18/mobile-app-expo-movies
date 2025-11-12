import { Loader, RowBack, Text } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { memo } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CastList = () => {
  const { id } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();

  return null;

  const {
    castMovieQuery: { data: castMovieQuery, isLoading },
  } = useGetMovie(+id);

  if (isLoading || !castMovieQuery) {
    return <Loader />;
  }

  return (
    <View className="flex-1 bg-neutral-900 px-4">
      <RowBack />

      <View className="items-center justify-center">
        <View style={{ paddingTop: top }} className="mb-5 flex-row gap-5">
          <View className="items-center justify-center rounded-full border-[1px] border-white px-5 dark:bg-dark-300">
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

      <FlatList
        data={castMovieQuery}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <CastItem cast={item} index={index} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: bottom }}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        removeClippedSubviews
      />
    </View>
  );
};

export default CastList;

const CastItem = memo(({ cast, index }: { cast: ShortCastProps; index: number }) => {
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(100 * index).springify()}
      onPress={() => router.push(`/movie/cast/${cast.id}`)}
      className="flex-row items-center justify-between rounded-xl bg-neutral-800 p-2">
      <View className="flex-row items-center gap-x-3">
        <Image source={{ uri: cast.avatar }} style={{ width: 70, height: 70, borderRadius: 6 }} />

        <View className="gap-1">
          <Text className="!text-lg font-medium">{cast.name}</Text>
          <Text className="!text-md font-normal !text-neutral-400">{cast.character}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward-outline" color="#757575" size={22} />
    </AnimatedPressable>
  );
});
