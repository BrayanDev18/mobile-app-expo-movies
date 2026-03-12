import { Icon, Text } from '@/components';
import { GenreProps } from '@/interfaces';
import { BlurView } from 'expo-blur';
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

const GENRE_ICONS: Record<number, string> = {
  28: 'Swords',
  12: 'Compass',
  16: 'Palette',
  35: 'Laugh',
  80: 'Fingerprint',
  99: 'FileText',
  18: 'Clapperboard',
  10751: 'Heart',
  14: 'Wand2',
  36: 'Landmark',
  27: 'Ghost',
  10402: 'Music',
  9648: 'Search',
  10749: 'HeartHandshake',
  878: 'Rocket',
  53: 'AlertTriangle',
  10752: 'Shield',
  37: 'Mountain',
};

interface GenreChipsProps {
  genres: GenreProps[];
  isLoading: boolean;
  iconMap?: Record<number, string>;
}

export const GenreChips = ({ genres, isLoading, iconMap }: GenreChipsProps) => {
  const icons = iconMap ?? GENRE_ICONS;
  if (isLoading) return <GenreChipsSkeleton />;
  if (!genres?.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify().damping(30).stiffness(200)}
      className="gap-3">
      <View className="px-3">
        <Text className="!text-lg font-bold">Genres</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}>
        {genres.map((genre) => (
          <Pressable
            key={genre.id}
            accessibilityRole="button"
            accessibilityLabel={`Browse ${genre.name} movies`}
            style={{ borderRadius: 50, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <BlurView intensity={40} tint="dark">
              <View className="flex-row items-center gap-2 px-4 py-2.5">
                <Icon
                  name={(icons[genre.id] ?? 'Film') as any}
                  size={14}
                  color="rgba(59, 130, 246, 0.8)"
                />
                <Text className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {genre.name}
                </Text>
              </View>
            </BlurView>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const GenreChipsSkeleton = () => {
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
      <View className="h-5 w-24 rounded-lg bg-neutral-800" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[90, 110, 80, 100, 120, 95].map((w, i) => (
          <Animated.View
            key={i}
            style={[pulseStyle, { width: w, height: 38, marginRight: 10 }]}
            className="rounded-full bg-neutral-800"
          />
        ))}
      </ScrollView>
    </View>
  );
};
