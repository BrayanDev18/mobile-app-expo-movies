import { IMAGE_PLACEHOLDER, tmdbResize } from '@/utils';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { height: heightScreen } = Dimensions.get('screen');

const AnimatedImage = Animated.createAnimatedComponent(Image);

export const MovieHeader = ({
  poster,
  scrollY,
}: {
  poster: string;
  scrollY: SharedValue<number>;
}) => {
  const backgroundStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(scrollY.value, [-300, 0], [1.35, 1], Extrapolation.CLAMP) },
    ],
  }));

  const posterStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [-300, 0, 400], [-40, 0, 90], Extrapolation.CLAMP),
      },
      { scale: interpolate(scrollY.value, [0, 400], [1, 0.9], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(scrollY.value, [0, 350], [1, 0.4], Extrapolation.CLAMP),
  }));

  return (
    <View style={{ height: heightScreen * 0.53 }} className="relative items-center justify-center">
      <AnimatedImage
        source={{ uri: tmdbResize(poster, 'w185') ?? undefined }}
        style={[StyleSheet.absoluteFill, backgroundStyle]}
        contentPosition="top center"
        cachePolicy="memory-disk"
        blurRadius={20}
      />

      <View
        style={{
          ...StyleSheet.absoluteFill,
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      />

      <Animated.View
        style={[
          {
            borderRadius: 16,
            overflow: 'hidden',
            width: 230,
            height: 350,
          },
          posterStyle,
        ]}>
        <Image
          source={{ uri: poster }}
          style={{ width: '100%', height: '100%' }}
          cachePolicy="memory-disk"
          contentFit="fill"
          placeholder={IMAGE_PLACEHOLDER}
        />
      </Animated.View>
    </View>
  );
};
