import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
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

interface TrendingStripProps {
  movies: MovieProps[];
  isLoading: boolean;
  title?: string;
  icon?: string;
  iconColor?: string;
  onItemPress?: (item: MovieProps) => void;
}

export const TrendingStrip = ({
  movies,
  isLoading,
  title = 'Trending Today',
  icon = 'Flame',
  iconColor = '#F97316',
  onItemPress,
}: TrendingStripProps) => {
  if (isLoading) return <TrendingStripSkeleton />;
  if (!movies?.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(150).springify().damping(30).stiffness(200)}
      className="gap-3">
      <View className="flex-row items-center gap-2 px-3">
        <Icon name={icon as any} size={18} color={iconColor} />
        <Text className="!text-lg font-bold">{title}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}>
        {movies.slice(0, 10).map((movie, index) => (
          <TrendingCard key={movie.id} movie={movie} rank={index + 1} onItemPress={onItemPress} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const TrendingCard = ({
  movie,
  rank,
  onItemPress,
}: {
  movie: MovieProps;
  rank: number;
  onItemPress?: (item: MovieProps) => void;
}) => (
  <Pressable
    onPress={() =>
      onItemPress
        ? onItemPress(movie)
        : router.push({ pathname: '/(root)/movie/[id]', params: { id: movie.id } })
    }
    accessibilityRole="button"
    accessibilityLabel={`#${rank} trending: ${movie.title}`}>
    <View
      style={{ width: 140, borderRadius: 16, overflow: 'hidden' }}
      className="bg-neutral-950/30">
      <View style={{ width: 140, height: 190, position: 'relative' }}>
        <Image
          source={{ uri: movie.poster }}
          style={{ flex: 1 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        <View style={{ position: 'absolute', bottom: 8, left: 8 }}>
          <BlurView
            intensity={70}
            tint="dark"
            style={{ borderRadius: 50, overflow: 'hidden' }}>
            <View className="items-center justify-center px-2.5 py-1">
              <Text className="text-xs font-bold !text-orange-400">#{rank}</Text>
            </View>
          </BlurView>
        </View>

        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          <BlurView
            intensity={70}
            tint="dark"
            style={{ borderRadius: 50, overflow: 'hidden' }}>
            <View className="flex-row items-center gap-1 px-2 py-1">
              <Icon name="Star" size={10} color="#FACC15" />
              <Text className="text-xs font-semibold">{movie.rating.toFixed(1)}</Text>
            </View>
          </BlurView>
        </View>
      </View>

      <View className="gap-0.5 p-2.5">
        <Text className="!text-sm font-medium" numberOfLines={1}>
          {movie.title}
        </Text>
        <Text className="text-xs !text-neutral-400" numberOfLines={1}>
          {movie.releaseDate}
        </Text>
      </View>
    </View>
  </Pressable>
);

const TrendingStripSkeleton = () => {
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
        {[0, 1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={[pulseStyle, { width: 140, height: 240, marginRight: 12 }]}
            className="rounded-2xl bg-neutral-800"
          />
        ))}
      </ScrollView>
    </View>
  );
};
