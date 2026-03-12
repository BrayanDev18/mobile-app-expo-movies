import { useGetTrendingAll, useMovieGenres, useMovieProviders, useMoviesByCategory } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { MovieProviders, MoviesHeader } from '@/screens/movie/components';
import {
  GenreChips,
  HomePremiumTabs,
  HomeSection,
  MustWatchList,
  SpotlightCard,
  StatsBar,
  TrendingStrip,
  UpcomingCountdown,
} from '@/screens/home/components';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MovieHome = () => {
  const scrollX = useSharedValue(0);
  const { top, bottom } = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    movies: nowPlayingMovies,
    isLoading: loadingNowPlaying,
    isError: errorNowPlaying,
    refetch: refetchNowPlaying,
  } = useMoviesByCategory('now_playing');

  const {
    movies: upcomingMovies,
    isLoading: loadingUpcoming,
    isError: errorUpcoming,
    refetch: refetchUpcoming,
  } = useMoviesByCategory('upcoming');

  const {
    movies: popularMovies,
    isLoading: loadingPopular,
    isError: errorPopular,
    refetch: refetchPopular,
  } = useMoviesByCategory('popular');

  const {
    movies: topRatedMovies,
    isLoading: loadingTopRated,
    isError: errorTopRated,
    refetch: refetchTopRated,
  } = useMoviesByCategory('top_rated');

  const {
    movieProviders,
    isMovieProvidersLoading,
    refetch: refetchProviders,
  } = useMovieProviders();

  const { genres, isLoading: loadingGenres } = useMovieGenres();

  const { trendingAll, isLoading: loadingTrending } = useGetTrendingAll();

  // Spotlight: highest-rated movie with a backdrop
  const spotlightMovie = useMemo(() => {
    if (!topRatedMovies?.length) return null;
    return (
      [...topRatedMovies].filter((m) => m.backdrop).sort((a, b) => b.rating - a.rating)[0] ??
      topRatedMovies[0]
    );
  }, [topRatedMovies]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchNowPlaying(),
      refetchUpcoming(),
      refetchPopular(),
      refetchTopRated(),
      refetchProviders(),
    ]);
    setIsRefreshing(false);
  }, [refetchNowPlaying, refetchUpcoming, refetchPopular, refetchTopRated, refetchProviders]);

  return (
    <>
      <View style={StyleSheet.absoluteFill}>
        {nowPlayingMovies?.map((image, index) => (
          <BackdropImage key={image.id} image={image} index={index} scrollX={scrollX} />
        ))}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: '100%' }]}
      />

      <HomePremiumTabs top={top} activeTab="movies" />

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
        {loadingNowPlaying ? (
          <CarouselSkeleton />
        ) : (
          <MoviesHeader movies={nowPlayingMovies} scrollX={scrollX} />
        )}

        <View style={{ paddingBottom: bottom + 80 }} className="gap-8">
          {loadingTopRated ? (
            <SpotlightSkeleton />
          ) : (
            spotlightMovie && <SpotlightCard movie={spotlightMovie} />
          )}

          <StatsBar
            inTheaters={nowPlayingMovies?.length ?? 0}
            trending={trendingAll?.length ?? 0}
            upcoming={upcomingMovies?.length ?? 0}
          />

          <TrendingStrip movies={trendingAll} isLoading={loadingTrending} />

          <GenreChips genres={genres} isLoading={loadingGenres} />

          <View className="gap-8 px-3">
            <HomeSection
              title="Now in Theaters"
              icon="Clapperboard"
              iconColor="#3B82F6"
              movies={nowPlayingMovies}
              isLoading={loadingNowPlaying}
              isError={errorNowPlaying}
              refetch={refetchNowPlaying}
              enterDelay={300}
            />

            <HomeSection
              title="Popular Right Now"
              icon="TrendingUp"
              iconColor="#22C55E"
              movies={popularMovies}
              isLoading={loadingPopular}
              isError={errorPopular}
              refetch={refetchPopular}
              enterDelay={400}
            />

            <HomeSection
              title="Top Rated Movies"
              icon="Star"
              iconColor="#FACC15"
              movies={topRatedMovies}
              isLoading={loadingTopRated}
              isError={errorTopRated}
              refetch={refetchTopRated}
              enterDelay={500}
            />

            <HomeSection
              title="Coming Soon"
              icon="Calendar"
              iconColor="#A855F7"
              movies={upcomingMovies}
              isLoading={loadingUpcoming}
              isError={errorUpcoming}
              refetch={refetchUpcoming}
              variant="backdrop"
              cardWidth={310}
              enterDelay={600}
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

            {!loadingTopRated && topRatedMovies?.length > 0 && (
              <MustWatchList movies={topRatedMovies} />
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

export default MovieHome;

interface BackdropImageProps {
  image: MovieProps;
  index: number;
  scrollX: SharedValue<number>;
}

const BackdropImage = ({ image, index, scrollX }: BackdropImageProps) => {
  const styles = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [index - 1, index, index + 1], [0, 1, 0]),
  }));

  return (
    <AnimatedImage
      source={{ uri: image.poster }}
      blurRadius={50}
      style={[StyleSheet.absoluteFill, styles]}
    />
  );
};

// --- Skeleton components ---

const usePulse = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};

const CarouselSkeleton = () => {
  const pulseStyle = usePulse();

  return (
    <View className="items-center py-8">
      <Animated.View
        style={[pulseStyle, { width: '60%', aspectRatio: 0.67 }]}
        className="rounded-3xl bg-neutral-800"
      />
    </View>
  );
};

const SpotlightSkeleton = () => {
  const pulseStyle = usePulse();

  return (
    <View className="px-3">
      <Animated.View style={pulseStyle} className="overflow-hidden rounded-3xl">
        <View className="bg-neutral-800" style={{ width: '100%', aspectRatio: 1.78 }}>
          <View
            style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}
            className="gap-3">
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
