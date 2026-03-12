import { useSeriesByCategory, useTvGenres, useTvProviders } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { GenreChips, HomePremiumTabs, HomeSection } from '@/screens/home/components';
import {
  AiringTodayStrip,
  SeriesHero,
  SeriesNetworks,
  TopSeriesRanked,
} from '@/screens/series/components';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components';

const TV_GENRE_ICONS: Record<number, string> = {
  10759: 'Swords',
  16: 'Palette',
  35: 'Laugh',
  80: 'Fingerprint',
  99: 'FileText',
  18: 'Clapperboard',
  10751: 'Heart',
  10762: 'Baby',
  9648: 'Search',
  10763: 'Newspaper',
  10764: 'Camera',
  10765: 'Rocket',
  10766: 'Tv',
  10767: 'MessageCircle',
  10768: 'Shield',
  37: 'Mountain',
};

const SeriesHome = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    series: popularSeries,
    isLoading: loadingPopular,
    isError: errorPopular,
    refetch: refetchPopular,
  } = useSeriesByCategory('popular');

  const {
    series: topRatedSeries,
    isLoading: loadingTopRated,
    refetch: refetchTopRated,
  } = useSeriesByCategory('top_rated');

  const {
    series: airingToday,
    isLoading: loadingAiring,
    refetch: refetchAiring,
  } = useSeriesByCategory('airing_today');

  const {
    series: onTheAir,
    isLoading: loadingOnAir,
    isError: errorOnAir,
    refetch: refetchOnAir,
  } = useSeriesByCategory('on_the_air');

  const { genres, isLoading: loadingGenres } = useTvGenres();
  const { tvProviders, isLoading: loadingProviders } = useTvProviders();

  // Hero: highest-rated series with a backdrop
  const heroSeries = useMemo(() => {
    if (!topRatedSeries?.length) return null;

    return (
      [...topRatedSeries].filter((s) => s.backdrop).sort((a, b) => b.rating - a.rating)[0] ??
      topRatedSeries[0]
    );
  }, [topRatedSeries]);

  const handleSeriesPress = useCallback((item: MovieProps) => {
    router.push({
      pathname: '/(root)/series/[id]',
      params: { id: item.id },
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchPopular(), refetchTopRated(), refetchAiring(), refetchOnAir()]);
    setIsRefreshing(false);
  }, [refetchPopular, refetchTopRated, refetchAiring, refetchOnAir]);

  return (
    <Screen safeAreaEdges={["bottom"]}>

      <HomePremiumTabs top={top} activeTab="series" />

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
        {loadingTopRated ? <HeroSkeleton /> : heroSeries && <SeriesHero series={heroSeries} />}

        <View style={{ paddingBottom: bottom + 80 }} className="gap-8">
          <AiringTodayStrip series={airingToday} isLoading={loadingAiring} />

          <GenreChips genres={genres} isLoading={loadingGenres} iconMap={TV_GENRE_ICONS} />

          <View className="gap-8 px-3">
            <HomeSection
              title="Popular Series"
              icon="TrendingUp"
              iconColor="#22C55E"
              movies={popularSeries}
              isLoading={loadingPopular}
              isError={errorPopular}
              refetch={refetchPopular}
              enterDelay={300}
              onItemPress={handleSeriesPress}
            />

            <HomeSection
              title="On The Air"
              icon="Radio"
              iconColor="#8B5CF6"
              movies={onTheAir}
              isLoading={loadingOnAir}
              isError={errorOnAir}
              refetch={refetchOnAir}
              variant="backdrop"
              cardWidth={310}
              enterDelay={400}
              onItemPress={handleSeriesPress}
            />

            <SeriesNetworks providers={tvProviders} isLoading={loadingProviders} />

            {!loadingTopRated && topRatedSeries?.length > 0 && (
              <TopSeriesRanked series={topRatedSeries} />
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default SeriesHome;

// --- Skeleton ---

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

const HeroSkeleton = () => {
  const pulseStyle = usePulse();

  return (
    <Animated.View
      style={[pulseStyle, { width: '100%', aspectRatio: 1.2 }]}
      className="bg-neutral-800"
    />
  );
};
