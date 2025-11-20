import { Text } from '@/components';
import { MovieByCategoryProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MoviesHeaderProps {
  movies: MovieByCategoryProps[];
  scrollX: SharedValue<number>;
}

interface ImageItemProps {
  image: MovieByCategoryProps;
  index: number;
  scrollX: SharedValue<number>;
}

const { width } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);

const IMAGE_WIDTH = width * 0.6;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.5;
const SPACING = 20;

export const MoviesHeader = (props: MoviesHeaderProps) => {
  const { movies, scrollX } = props;

  const { top } = useSafeAreaInsets();

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (IMAGE_WIDTH + SPACING);
  });

  return (
    <Animated.FlatList
      keyExtractor={(item) => item.id.toString()}
      horizontal
      snapToInterval={IMAGE_WIDTH + SPACING}
      decelerationRate="fast"
      style={{ flexGrow: 0, paddingTop: top + 24 }}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: SPACING,
        paddingHorizontal: (width - IMAGE_WIDTH) / 2.1,
      }}
      data={movies}
      renderItem={({ item, index }) => (
        <ImageItem key={index} image={item} index={index} scrollX={scrollX} />
      )}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
};

const ImageItem = memo((props: ImageItemProps) => {
  const { image, index, scrollX } = props;

  const imageStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];

    const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85], Extrapolation.CLAMP);
    const rotate = interpolate(scrollX.value, inputRange, [8, 0, -8], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [20, 0, 20], Extrapolation.CLAMP);

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }, { translateY }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0.6, 0, 0.6],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/(root)/movie/[id]', params: { id: image.id } })}
      style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}>
      <Animated.View className="flex-1" style={[imageStyle]}>
        <AnimatedImage
          source={{ uri: image.poster_path }}
          style={{ width: '100%', height: '100%', borderRadius: 22 }}
          contentFit="fill"
          cachePolicy="memory-disk"
        />

        <Animated.View style={[styles.overlay, overlayStyle]} />

        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient} />

        <View style={styles.infoContainer}>
          <BlurView
            intensity={80}
            tint="systemChromeMaterialDark"
            experimentalBlurMethod="dimezisBlurView"
            style={styles.blurContainer}>
            <Text className="text-center !text-[16px] font-bold" numberOfLines={2}>
              {image.title}
            </Text>

            <View className="flex-row items-center justify-center gap-2">
              <View className="h-1.5 w-1.5 rounded-full bg-red-500" />

              <Text className="!text-md !text-neutral-400">
                {formatDate(image.release_date as string)}
              </Text>
            </View>
          </BlurView>
        </View>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 22,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: 22,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 10,
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
