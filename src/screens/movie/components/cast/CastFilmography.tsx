import { CastCreditProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const CastFilmography = ({ filmography }: { filmography: CastCreditProps[] }) => {
  return (
    <Animated.View className="h-full" entering={FadeInDown.delay(200).springify()}>
      <FlashList
        numColumns={3}
        data={filmography}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        renderItem={({ item, index }) => <FilmImage movie={item} />}
        removeClippedSubviews
      />
    </Animated.View>
  );
};

const FilmImage = memo(({ movie }: { movie: CastCreditProps }) => {
  return (
    <Pressable
      className="m-1 flex-1 items-center"
      onPress={() => router.push({ pathname: '/(root)/movie/[id]', params: { id: movie.id } })}>
      <Image
        source={{ uri: movie.poster_path }}
        style={{ width: '100%', height: 190, borderRadius: 10 }}
        cachePolicy="memory-disk"
        contentFit="fill"
      />
    </Pressable>
  );
});
