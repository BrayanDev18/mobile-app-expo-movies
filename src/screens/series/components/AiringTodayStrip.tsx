import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { formatDate } from '@/utils';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface AiringTodayStripProps {
  series: MovieProps[];
  isLoading: boolean;
}

export const AiringTodayStrip = ({ series, isLoading }: AiringTodayStripProps) => {
  if (isLoading) return <AiringTodayStripSkeleton />;
  if (!series?.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(150).springify().damping(30).stiffness(200)}
      className="gap-3">
      <View className="flex-row items-center gap-2 px-3">
        <Icon name="Radio" size={18} color="#22C55E" />
        <Text className="!text-lg font-bold">Airing Today</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}>
        {series.slice(0, 10).map((item) => (
          <AiringCard key={item.id} series={item} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const AiringCard = ({ series }: { series: MovieProps }) => {
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseOpacity]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
  const imageUri = series.backdrop ?? series.poster;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(root)/series/[id]',
          params: { id: series.id },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`${series.title}, airing today`}
      style={{ width: 200, borderRadius: 16, overflow: 'hidden' }}
      className="bg-neutral-950/30">
      <View style={{ width: 200, aspectRatio: 1.5, position: 'relative' }}>
        <Image
          source={{ uri: imageUri }}
          style={{ flex: 1 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        <View style={{ position: 'absolute', top: 8, left: 8 }}>
          <BlurView intensity={70} tint="dark" style={{ borderRadius: 50, overflow: 'hidden' }}>
            <View className="flex-row items-center gap-1.5 px-2.5 py-1">
              <Animated.View
                style={[
                  dotStyle,
                  {
                    width: 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: '#22C55E',
                  },
                ]}
              />
              <Text className="text-xs font-bold !text-green-400">AIRING</Text>
            </View>
          </BlurView>
        </View>

        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          <BlurView intensity={70} tint="dark" style={{ borderRadius: 50, overflow: 'hidden' }}>
            <View className="flex-row items-center gap-1 px-2 py-1">
              <Icon name="Star" size={10} color="#FACC15" />
              <Text className="text-xs font-semibold">{series.rating.toFixed(1)}</Text>
            </View>
          </BlurView>
        </View>
      </View>

      <View className="gap-0.5 p-2.5">
        <Text className="!text-sm font-medium" numberOfLines={1}>
          {series.title}
        </Text>
        {series.releaseDate && (
          <Text className="text-xs !text-neutral-400" numberOfLines={1}>
            {formatDate(series.releaseDate)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const AiringTodayStripSkeleton = () => {
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
    <View className="gap-3 px-3">
      <View className="h-5 w-36 rounded-lg bg-neutral-800" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[pulseStyle, { width: 200, height: 175, marginRight: 12 }]}
            className="rounded-2xl bg-neutral-800"
          />
        ))}
      </ScrollView>
    </View>
  );
};
