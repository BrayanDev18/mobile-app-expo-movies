import {
  useGetTrendingAll,
  useMovieGenres,
  useMovieProviders,
  useMoviesByCategory,
  useSeriesByCategory,
  useTrendingMovies,
  useTrendingTv,
  useTvGenres,
} from '@/hooks';
import { GenreProps, MovieProps } from '@/interfaces';
import { MovieProviders } from '@/screens/movie/components';
import {
  GenreChips,
  HomePremiumTabs,
  HomeSection,
  SpotlightCard,
  StatsBar,
  TrendingStrip,
  UpcomingCountdown,
} from '@/screens/home/components';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MERGED_GENRE_ICONS } from '@/constants';

const HomeScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Trending ---
  const {
    trendingAll,
    isLoading: loadingTrendingAll,
    refetch: refetchTrendingAll,
  } = useGetTrendingAll();

  const {
    trendingMovies,
    isLoading: loadingTrendingMovies,
    refetch: refetchTrendingMovies,
  } = useTrendingMovies();

  const { trendingTv, isLoading: loadingTrendingTv, refetch: refetchTrendingTv } = useTrendingTv();

  // --- Categories ---
  const {
    movies: popularMovies,
    isLoading: loadingPopularMovies,
    isError: errorPopularMovies,
    refetch: refetchPopularMovies,
  } = useMoviesByCategory('popular');

  const {
    series: popularSeries,
    isLoading: loadingPopularSeries,
    isError: errorPopularSeries,
    refetch: refetchPopularSeries,
  } = useSeriesByCategory('popular');

  const {
    movies: topRatedMovies,
    isLoading: loadingTopRatedMovies,
    isError: errorTopRatedMovies,
    refetch: refetchTopRatedMovies,
  } = useMoviesByCategory('top_rated');

  const {
    series: topRatedSeries,
    isLoading: loadingTopRatedSeries,
    isError: errorTopRatedSeries,
    refetch: refetchTopRatedSeries,
  } = useSeriesByCategory('top_rated');

  const {
    movies: upcomingMovies,
    isLoading: loadingUpcoming,
    refetch: refetchUpcoming,
  } = useMoviesByCategory('upcoming');

  // --- Genres (merged) ---
  const { genres: movieGenres, isLoading: loadingMovieGenres } = useMovieGenres();
  const { genres: tvGenres, isLoading: loadingTvGenres } = useTvGenres();

  const mergedGenres = useMemo(() => {
    const seen = new Set<number>();
    const result: GenreProps[] = [];
    for (const g of [...movieGenres, ...tvGenres]) {
      if (!seen.has(g.id)) {
        seen.add(g.id);
        result.push(g);
      }
    }
    return result;
  }, [movieGenres, tvGenres]);

  // --- Providers ---
  const {
    movieProviders,
    isMovieProvidersLoading,
    refetch: refetchProviders,
  } = useMovieProviders();

  // --- Spotlight: highest-rated from trending all ---
  const spotlightItem = useMemo(() => {
    if (!trendingAll?.length) return null;
    return (
      [...trendingAll].filter((m) => m.backdrop).sort((a, b) => b.rating - a.rating)[0] ??
      trendingAll[0]
    );
  }, [trendingAll]);

  // --- Navigation helpers ---
  const handleMixedItemPress = useCallback((item: MovieProps) => {
    if (item.media_type === 'tv') {
      router.push({ pathname: '/(root)/series/[id]', params: { id: item.id } });
    } else {
      router.push({ pathname: '/(root)/movie/[id]', params: { id: item.id } });
    }
  }, []);

  const handleSeriesPress = useCallback((item: MovieProps) => {
    router.push({ pathname: '/(root)/series/[id]', params: { id: item.id } });
  }, []);

  // --- Pull-to-refresh ---
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchTrendingAll(),
      refetchTrendingMovies(),
      refetchTrendingTv(),
      refetchPopularMovies(),
      refetchPopularSeries(),
      refetchTopRatedMovies(),
      refetchTopRatedSeries(),
      refetchUpcoming(),
      refetchProviders(),
    ]);
    setIsRefreshing(false);
  }, [
    refetchTrendingAll,
    refetchTrendingMovies,
    refetchTrendingTv,
    refetchPopularMovies,
    refetchPopularSeries,
    refetchTopRatedMovies,
    refetchTopRatedSeries,
    refetchUpcoming,
    refetchProviders,
  ]);

  // --- Background images from trending ---
  const bgPosters = useMemo(
    () => trendingAll?.filter((m) => m.poster).slice(0, 6) ?? [],
    [trendingAll]
  );

  return (
    <>
      <View style={StyleSheet.absoluteFill}>
        {bgPosters.map((image, index) => (
          <BackdropImage key={image.id} image={image} index={index} total={bgPosters.length} />
        ))}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: '100%' }]}
      />

      <HomePremiumTabs top={top} activeTab="home" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="rgba(255,255,255,0.6)"
          />
        }>
        {loadingTrendingAll ? (
          <SpotlightSkeleton />
        ) : (
          spotlightItem && (
            <SpotlightCard
              movie={spotlightItem}
              onPress={() => handleMixedItemPress(spotlightItem)}
            />
          )
        )}

        <View style={{ paddingBottom: bottom + 80 }} className="gap-8">
          <StatsBar
            inTheaters={popularMovies?.length ?? 0}
            trending={trendingAll?.length ?? 0}
            upcoming={upcomingMovies?.length ?? 0}
          />

          <TrendingStrip
            movies={trendingAll}
            isLoading={loadingTrendingAll}
            onItemPress={handleMixedItemPress}
          />

          <TrendingStrip
            movies={trendingMovies}
            isLoading={loadingTrendingMovies}
            title="Trending Movies"
            icon="Film"
            iconColor="#3B82F6"
          />

          <TrendingStrip
            movies={trendingTv}
            isLoading={loadingTrendingTv}
            title="Trending Series"
            icon="Tv"
            iconColor="#8B5CF6"
            onItemPress={handleSeriesPress}
          />

          <GenreChips
            genres={mergedGenres}
            isLoading={loadingMovieGenres && loadingTvGenres}
            iconMap={MERGED_GENRE_ICONS}
          />

          <View className="gap-8 px-3">
            <HomeSection
              title="Popular Movies"
              icon="TrendingUp"
              iconColor="#22C55E"
              movies={popularMovies}
              isLoading={loadingPopularMovies}
              isError={errorPopularMovies}
              refetch={refetchPopularMovies}
              enterDelay={300}
            />

            <HomeSection
              title="Popular Series"
              icon="Tv"
              iconColor="#8B5CF6"
              movies={popularSeries}
              isLoading={loadingPopularSeries}
              isError={errorPopularSeries}
              refetch={refetchPopularSeries}
              enterDelay={400}
              onItemPress={handleSeriesPress}
            />

            <HomeSection
              title="Top Rated Movies"
              icon="Star"
              iconColor="#FACC15"
              movies={topRatedMovies}
              isLoading={loadingTopRatedMovies}
              isError={errorTopRatedMovies}
              refetch={refetchTopRatedMovies}
              enterDelay={500}
            />

            <HomeSection
              title="Top Rated Series"
              icon="Award"
              iconColor="#F97316"
              movies={topRatedSeries}
              isLoading={loadingTopRatedSeries}
              isError={errorTopRatedSeries}
              refetch={refetchTopRatedSeries}
              enterDelay={600}
              onItemPress={handleSeriesPress}
            />

            {isMovieProvidersLoading ? (
              <ProvidersSkeleton />
            ) : (
              movieProviders?.length > 0 && (
                <Animated.View
                  entering={FadeInDown.delay(700).springify().damping(30).stiffness(200)}>
                  <MovieProviders movieProviders={movieProviders} />
                </Animated.View>
              )
            )}

            {!loadingUpcoming && upcomingMovies?.length > 0 && (
              <UpcomingCountdown movies={upcomingMovies} />
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

// --- Background image with cycling opacity ---

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface BackdropImageProps {
  image: MovieProps;
  index: number;
  total: number;
}

const BackdropImage = ({ image, index, total }: BackdropImageProps) => {
  const opacity = useSharedValue(index === 0 ? 1 : 0);

  useEffect(() => {
    const duration = 4000;

    // Stagger: each image fades in at its turn
    const delay = index * duration;

    const timeout = setTimeout(() => {
      opacity.value = withRepeat(
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, total, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <AnimatedImage
      source={{ uri: image.poster }}
      blurRadius={50}
      style={[StyleSheet.absoluteFill, animatedStyle]}
    />
  );
};

// --- Skeleton components ---

const usePulse = () => {
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseOpacity]);

  return useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));
};

const SpotlightSkeleton = () => {
  const pulseStyle = usePulse();

  return (
    <View className="px-3">
      <Animated.View style={pulseStyle} className="overflow-hidden rounded-3xl">
        <View className="bg-neutral-800" style={{ width: '100%', aspectRatio: 1.78 }}>
          <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }} className="gap-3">
            <View className="h-6 w-3/4 rounded-lg bg-neutral-700" />
            <View className="h-4 w-full rounded-lg bg-neutral-700" />
            <View className="h-10 w-32 rounded-full bg-neutral-700" />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const ProvidersSkeleton = () => {
  const pulseStyle = usePulse();

  return (
    <View className="gap-3">
      <Animated.View style={pulseStyle} className="h-5 w-36 rounded-lg bg-neutral-800" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[0, 1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={[pulseStyle, { width: 170, height: 54, marginRight: 12 }]}
            className="rounded-2xl bg-neutral-800"
          />
        ))}
      </ScrollView>
    </View>
  );
};
