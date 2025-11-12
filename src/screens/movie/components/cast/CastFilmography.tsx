import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { FlatList, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CastFilmography = ({ filmography }: { filmography: any[] }) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Animated.View entering={FadeInDown.delay(200).springify()} className="gap-5">
      <FlatList
        data={filmography}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <FilmImage movie={item} index={index} />}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{ gap: 12, paddingBottom: bottom }}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        removeClippedSubviews
      />
    </Animated.View>
  );
};

const FilmImage = memo(({ movie, index }: { movie: any; index: number }) => {
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(100 * index).springify()}
      className="flex-1 items-center"
      onPress={() => router.push({ pathname: '/(root)/movie/[id]', params: { id: movie.id } })}>
      <Image
        source={{ uri: movie.poster }}
        style={{ width: '95%', height: 240, borderRadius: 10 }}
        cachePolicy="memory-disk"
        contentFit="cover"
      />
    </AnimatedPressable>
  );
});
