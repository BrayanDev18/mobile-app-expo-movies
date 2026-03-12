import { Icon, Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { MovieHorizontalList } from '@/screens/movie/components';
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

interface HomeSectionProps {
  title: string;
  icon?: string;
  iconColor?: string;
  movies: MovieProps[];
  isLoading: boolean;
  isError?: boolean;
  refetch?: () => void;
  variant?: 'poster' | 'backdrop';
  cardWidth?: number;
  cardHeight?: number;
  enterDelay?: number;
  onItemPress?: (item: MovieProps) => void;
}

export const HomeSection = ({
  title,
  icon,
  iconColor,
  movies,
  isLoading,
  isError,
  refetch,
  variant = 'poster',
  cardWidth,
  cardHeight,
  enterDelay = 0,
  onItemPress,
}: HomeSectionProps) => {
  if (isLoading) return <SectionSkeleton variant={variant} />;

  if (isError) {
    return (
      <View className="items-center justify-center gap-4 py-12">
        <Icon name="CloudOff" size={48} color="rgba(255,255,255,0.3)" />
        <Text className="!text-neutral-400">Something went wrong</Text>
        {refetch && (
          <Pressable
            onPress={() => refetch()}
            accessibilityRole="button"
            accessibilityLabel="Retry loading movies"
            className="rounded-full px-6 py-2"
            style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}>
            <Text className="font-medium !text-blue-400">Retry</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (!movies?.length) {
    return (
      <View className="items-center justify-center gap-3 py-12">
        <Icon name="Film" size={48} color="rgba(255,255,255,0.3)" />
        <Text className="!text-neutral-400">No movies found</Text>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay).springify().damping(30).stiffness(200)}
      className="gap-3">
      <View className="flex-row items-center gap-2 px-1">
        {icon && <Icon name={icon as any} size={18} color={iconColor ?? 'rgba(255,255,255,0.6)'} />}
        <Text className="!text-[18px] font-semibold">{title}</Text>
      </View>
      <MovieHorizontalList
        movies={movies}
        variant={variant}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        onItemPress={onItemPress}
      />
    </Animated.View>
  );
};

const SectionSkeleton = ({ variant = 'poster' }: { variant?: 'poster' | 'backdrop' }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const itemWidth = variant === 'backdrop' ? 310 : 170;
  const itemHeight = variant === 'backdrop' ? 174 : 220;
  const count = variant === 'backdrop' ? 2 : 3;

  return (
    <View className="gap-3">
      <Animated.View style={pulseStyle} className="h-5 w-40 rounded-lg bg-neutral-800" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Array.from({ length: count }).map((_, i) => (
          <Animated.View
            key={i}
            style={[pulseStyle, { width: itemWidth, height: itemHeight, marginRight: 16 }]}
            className="rounded-2xl bg-neutral-800"
          />
        ))}
      </ScrollView>
    </View>
  );
};
