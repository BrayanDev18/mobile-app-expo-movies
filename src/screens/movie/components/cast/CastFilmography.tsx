import { CastCreditProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export const CastFilmography = ({ filmography }: { filmography: CastCreditProps[] }) => {
  const renderItem = useCallback(({ item: movie }: { item: CastCreditProps }) => {
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
  }, []);

  return (
    <Animated.View className="h-full" entering={FadeInDown.springify()}>
      <FlashList
        numColumns={3}
        data={filmography}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        removeClippedSubviews
      />
    </Animated.View>
  );
};
