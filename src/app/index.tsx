import { Icon, Text } from '@/components';
import { navigate } from '@/constants';
import { useGetTrendingAll } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = 150;
const POSTER_GAP = 8;
const ITEM_HEIGHT = POSTER_HEIGHT + POSTER_GAP;
const COLUMNS = 5;

interface MosaicColumnProps {
  posters: string[];
  direction: 'up' | 'down';
  speed: number;
  columnIndex: number;
}

const COLUMN_CONFIGS: { direction: 'up' | 'down'; speed: number }[] = [
  { direction: 'up', speed: 0.3 },
  { direction: 'down', speed: 0.5 },
  { direction: 'up', speed: 0.4 },
  { direction: 'down', speed: 0.35 },
  { direction: 'up', speed: 0.45 },
];

const MosaicPoster = ({ uri }: { uri: string }) => (
  <View
    style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT, borderRadius: 12, overflow: 'hidden' }}>
    <Image source={{ uri }} style={{ flex: 1 }} contentFit="fill" cachePolicy="memory-disk" />
  </View>
);

const MosaicColumn = (props: MosaicColumnProps) => {
  const { posters, direction, speed, columnIndex } = props;

  const translateY = useSharedValue(direction === 'up' ? 0 : -ITEM_HEIGHT * posters.length);
  const totalDrift = ITEM_HEIGHT * posters.length;

  useEffect(() => {
    const target = direction === 'up' ? -totalDrift : 0;
    translateY.value = withRepeat(
      withTiming(target, {
        duration: 50000 / speed,
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [direction, speed, totalDrift, translateY, posters.length]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const tripled = useMemo(() => [...posters, ...posters, ...posters], [posters]);

  return (
    <Animated.View
      style={[{ gap: POSTER_GAP }, animatedStyle]}
      entering={FadeIn.delay(columnIndex * 150).duration(800)}>
      {tripled.map((uri, i) => (
        <MosaicPoster key={`${columnIndex}-${i}`} uri={uri} />
      ))}
    </Animated.View>
  );
};

const SkeletonColumn = ({ columnIndex }: { columnIndex: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.6, { duration: 1000 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ gap: POSTER_GAP }, animatedStyle]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View
          key={`skel-${columnIndex}-${i}`}
          className="rounded-xl bg-neutral-800"
          style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
        />
      ))}
    </Animated.View>
  );
};

const MainIndex = () => {
  const { bottom } = useSafeAreaInsets();
  const { trendingAll } = useGetTrendingAll();

  const validPosters = useMemo(
    () => (trendingAll ?? []).filter((m: MovieProps) => m.poster),
    [trendingAll]
  );

  const postersByColumn = useMemo(() => {
    if (!validPosters.length) return [];
    const columns: string[][] = Array.from({ length: COLUMNS }, () => []);
    validPosters.forEach((movie: MovieProps, i: number) => {
      columns[i % COLUMNS].push(movie.poster as string);
    });
    return columns;
  }, [validPosters]);

  const featuredMovie = validPosters[0];
  const hasData = validPosters.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1016' }}>
      {featuredMovie && (
        <Animated.View
          entering={FadeIn.duration(800)}
          style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}>
          <Image
            source={{ uri: featuredMovie.poster }}
            style={{ flex: 1 }}
            blurRadius={60}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </Animated.View>
      )}

      <Animated.View
        entering={FadeIn.duration(1200)}
        accessibilityElementsHidden
        style={[
          StyleSheet.absoluteFill,
          {
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: '-15deg' }, { scale: 1.4 }],
          },
        ]}>
        <View style={{ flexDirection: 'row', gap: POSTER_GAP }}>
          {hasData
            ? postersByColumn.map((posters, i) => (
                <MosaicColumn
                  key={`col-${i}`}
                  posters={posters}
                  direction={COLUMN_CONFIGS[i].direction}
                  speed={COLUMN_CONFIGS[i].speed}
                  columnIndex={i}
                />
              ))
            : Array.from({ length: COLUMNS }).map((_, i) => (
                <SkeletonColumn key={`skel-col-${i}`} columnIndex={i} />
              ))}
        </View>
      </Animated.View>

      <LinearGradient
        colors={[
          'transparent',
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.7)',
          'rgba(0,0,0,0.95)',
          '#0F1016',
        ]}
        locations={[0, 0.3, 0.55, 0.7, 1.0]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View
        style={[
          StyleSheet.absoluteFill,
          {
            justifyContent: 'flex-end',
            paddingBottom: bottom + 40,
          },
        ]}>
        <View className="items-center gap-5">
          <View className="items-center gap-2">
            <Animated.View
              entering={FadeIn.delay(700).duration(600)}
              style={{
                width: 40,
                height: 2,
                backgroundColor: '#68BEF1',
                borderRadius: 1,
                marginBottom: 4,
              }}
            />

            <Animated.View entering={FadeInDown.delay(800).springify().damping(30).stiffness(200)}>
              <Text className="!text-5xl font-bold" style={{ letterSpacing: 6 }}>
                FLIXORA
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(900).springify().damping(30).stiffness(200)}>
              <Text
                className="!text-md font-light !text-neutral-400"
                style={{ letterSpacing: 3 }}>
                YOUR CINEMA, REIMAGINED
              </Text>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInUp.delay(950).springify().damping(30).stiffness(200)}>
            <View
              style={{
                borderRadius: 50,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              accessibilityLabel={`${validPosters.length} movies trending today`}>
              <BlurView
                intensity={40}
                tint="dark"
                className="flex-row items-center gap-2.5 px-5 py-2.5">
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#68BEF1',
                  }}
                />
                <Icon name="TrendingUp" size={13} color="#68BEF1" />

                <Text
                  className="text-xs font-semibold !text-light-300"
                  style={{ letterSpacing: 1.5 }}>
                  {validPosters.length} TRENDING NOW
                </Text>

                <View
                  style={{
                    width: 1,
                    height: 12,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    marginHorizontal: 2,
                  }}
                />
                <View className="flex-row" style={{ marginLeft: -2 }}>
                  {validPosters.slice(0, 3).map((movie: MovieProps, i: number) => (
                    <View
                      key={movie.id}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        overflow: 'hidden',
                        borderWidth: 1.5,
                        borderColor: '#0F1016',
                        marginLeft: i > 0 ? -6 : 0,
                        zIndex: 3 - i,
                      }}>
                      <Image
                        source={{ uri: movie.poster }}
                        style={{ flex: 1 }}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                      />
                    </View>
                  ))}
                </View>
              </BlurView>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(1100).springify().damping(30).stiffness(200)}
            className="w-full px-8">
            <ShimmerCTA onPress={() => navigate('home')} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const ShimmerCTA = ({ onPress }: { onPress: () => void }) => {
  const shimmer = useSharedValue(-1);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [-1, 1], [-200, 200]) }],
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Get started — explore trending movies">
      <LinearGradient
        colors={['#68BEF1', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 52,
          borderRadius: 50,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 80,
              height: '100%',
              opacity: 0.25,
            },
            shimmerStyle,
          ]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>

        <View className="flex-row items-center gap-2">
          <Text className="!text-md font-semibold" style={{ letterSpacing: 1 }}>
            GET STARTED
          </Text>

          <Icon name="ArrowRight" size={18} color="white" />
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default MainIndex;
