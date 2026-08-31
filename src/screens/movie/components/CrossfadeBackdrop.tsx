import { MovieProps } from '@/interfaces';
import { tmdbImage } from '@/utils';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface BackdropImageProps {
  image: MovieProps;
  index: number;
  scrollX: SharedValue<number>;
}

const BackdropImage = ({ image, index, scrollX }: BackdropImageProps) => {
  const styles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollX.value, [index - 1, index, index + 1], [0, 1, 0]),
    };
  });

  return (
    <AnimatedImage
      source={{ uri: tmdbImage(image.poster, 'w185') ?? undefined }}
      blurRadius={50}
      style={[StyleSheet.absoluteFill, styles]}
    />
  );
};

// Full-screen blurred poster that crossfades as the hero carousel scrolls.
// Owns the active-index tracking so only the neighbouring backdrops mount.
export const CrossfadeBackdrop = ({
  media,
  scrollX,
}: {
  media: MovieProps[];
  scrollX: SharedValue<number>;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useAnimatedReaction(
    () => Math.round(scrollX.value),
    (value, prev) => {
      if (value !== prev) scheduleOnRN(setActiveIndex, value);
    }
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      {media.map((image, index) =>
        Math.abs(index - activeIndex) <= 1 ? (
          <BackdropImage key={String(image.id)} image={image} index={index} scrollX={scrollX} />
        ) : null
      )}
    </View>
  );
};
