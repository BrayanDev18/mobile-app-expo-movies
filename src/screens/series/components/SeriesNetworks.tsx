import { Icon, Text } from '@/components';
import { ProviderProps } from '@/interfaces';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SeriesNetworksProps {
  providers: ProviderProps[];
  isLoading: boolean;
}

export const SeriesNetworks = ({ providers, isLoading }: SeriesNetworksProps) => {
  if (isLoading) return <NetworksSkeleton />;
  if (!providers?.length) return null;

  const visibleProviders = providers.slice(0, 12);

  return (
    <Animated.View
      entering={FadeInDown.delay(500).springify().damping(30).stiffness(200)}
      className="gap-4">
      <View className="flex-row items-center gap-2 px-1">
        <Icon name="Tv" size={18} color="#8B5CF6" />
        <Text className="!text-[18px] font-semibold">Where to Watch</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {visibleProviders.map((provider) => (
          <View
            key={provider._id}
            accessibilityRole="image"
            accessibilityLabel={provider.name}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}
            className="items-center justify-center">
            <Image
              source={{ uri: provider.logo }}
              style={{ width: 40, height: 40, borderRadius: 8 }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const NetworksSkeleton = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="gap-4">
      <Animated.View style={pulseStyle} className="h-5 w-36 rounded-lg bg-neutral-800" />
      <View className="flex-row flex-wrap gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Animated.View
            key={i}
            style={[pulseStyle, { width: 56, height: 56, borderRadius: 28 }]}
            className="bg-neutral-800"
          />
        ))}
      </View>
    </View>
  );
};
