import { Button, Text } from '@/components';
import { useMoviesByCategory } from '@/hooks';
import { MovieByCategoryProps } from '@/interfaces';
import { Marquee } from '@animatereactnative/marquee';
import { Stagger } from '@animatereactnative/stagger';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface CarouselItemProps {
  uri: string;
  index: number;
  images: string[];
  offset: SharedValue<number>;
}

const { width } = Dimensions.get('window');

const IMAGE_WIDTH = width * 0.6;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.61;
const SPACING = 16;
const IMAGE_SIZE = IMAGE_WIDTH + SPACING;

const MainIndex = () => {
  const offset = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { movies } = useMoviesByCategory('now_playing');

  const images = movies?.map((movie: MovieByCategoryProps) => movie.poster_path) as string[];

  useAnimatedReaction(
    () => {
      if (!images.length) return 0;
      const floatIndex = (offset.value + width / 2.5) / IMAGE_SIZE;
      return Math.abs(Math.floor(floatIndex % images.length));
    },
    (value) => {
      scheduleOnRN(setActiveIndex, value);
    }
  );

  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <View style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}>
        <Animated.Image
          key={`image-${activeIndex}`}
          source={{
            uri: images[activeIndex] ?? 'https://m.media-amazon.com/images/I/91qmrdkBViL.jpg',
          }}
          style={{ flex: 1 }}
          blurRadius={50}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
        />
      </View>

      <Marquee spacing={SPACING} speed={0.5} position={offset}>
        <Animated.View
          style={{ gap: SPACING }}
          entering={FadeInUp.duration(800)
            .easing(Easing.elastic(0.9))
            .withInitialValues({
              transform: [{ translateY: -IMAGE_HEIGHT / 2 }],
            })}
          className="flex-row">
          {images.map((uri, index) => (
            <CarouselItem key={index} index={index} uri={uri} offset={offset} images={images} />
          ))}
        </Animated.View>
      </Marquee>

      <Stagger initialEnteringDelay={500} duration={500} stagger={100}>
        <View className="mt-10 gap-3 px-10">
          <View className="items-center">
            <Text className="!text-xl font-light">Welcome to</Text>

            <Text className="!text-6xl font-bold">Flixora</Text>
          </View>

          <Text className="mb-4 text-center !text-xl leading-9 !text-neutral-200">
            Discover trending movies, explore stunning posters, and dive into smooth animations that
            bring cinema to life. 🍿✨
          </Text>

          <Button title="Log In" onPress={() => router.push('/(root)/(tabs)/home')} />
        </View>
      </Stagger>
    </View>
  );
};

export default MainIndex;

const CarouselItem = (props: CarouselItemProps) => {
  const { uri, index, offset, images } = props;

  const imageStyles = useAnimatedStyle(() => {
    const itemPosition = index * IMAGE_SIZE - width - IMAGE_SIZE / 2;
    const totalSize = images.length * IMAGE_SIZE;
    const range =
      ((itemPosition - (offset.value + totalSize * 1000)) % totalSize) + width + IMAGE_SIZE / 2;

    return {
      transform: [
        {
          rotate: `${interpolate(
            range,
            [-IMAGE_SIZE, (width - IMAGE_SIZE) / 2, width],
            [-3, 0, 3]
          )}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }, imageStyles]}>
      <Image source={{ uri }} style={{ flex: 1, borderRadius: 16 }} cachePolicy="memory-disk" />
    </Animated.View>
  );
};
