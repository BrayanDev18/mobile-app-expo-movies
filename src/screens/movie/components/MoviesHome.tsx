import { useHomeSections, useMoviesByCategory, usePullToRefresh, useTrendingPeople } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { HomeSection } from '@/screens/movie/hooks';
import { tmdbResize } from '@/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { HomeSkeleton } from './HomeSkeleton';
import { MovieHorizontalList } from './MovieHorizontalList';
import { MoviesHeader } from './MoviesHeader';
import { PeopleHorizontalList } from './PeopleHorizontalList';
import { RankedCarousel } from './RankedCarousel';

interface BackdropImageProps {
  image: MovieProps;
  index: number;
  scrollX: SharedValue<number>;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

const openDiscover = (section: HomeSection) =>
  router.push({
    pathname: '/(root)/movie/discover',
    params: { ...section.seeAll, title: section.title },
  });

export const MoviesHome = ({ header }: { header: ReactNode }) => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { bottom } = useSafeAreaInsets();

  useAnimatedReaction(
    () => Math.round(scrollX.value),
    (value, prev) => {
      if (value !== prev) scheduleOnRN(setActiveIndex, value);
    }
  );

  const { heroMovies, sections, isHeroLoading } = useHomeSections();
  const { people: trendingPeople } = useTrendingPeople();
  const { movies: topRated } = useMoviesByCategory('top_rated');
  const { refreshing, onRefresh } = usePullToRefresh();

  if (isHeroLoading) return <HomeSkeleton header={header} />;

  return (
    <>
      <View style={StyleSheet.absoluteFill}>
        {heroMovies.map((image, index) =>
          Math.abs(index - activeIndex) <= 1 ? (
            <BackdropImage key={String(image.id)} image={image} index={index} scrollX={scrollX} />
          ) : null
        )}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: '100%' }]}
      />

      {header}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="rgba(255,255,255,0.6)"
          />
        }>
        <MoviesHeader movies={heroMovies} scrollX={scrollX} />

        <View style={{ paddingBottom: bottom + 80 }} className="gap-8 p-3">
          {sections.map((section) =>
            section.ranked ? (
              <RankedCarousel
                key={section.key}
                title={section.title}
                movies={section.movies.slice(0, 10)}
              />
            ) : (
              <MovieHorizontalList
                key={section.key}
                title={section.title}
                movies={section.movies}
                variant={section.variant}
                cardWidth={section.cardWidth}
                onSeeAll={section.seeAll ? () => openDiscover(section) : undefined}
              />
            )
          )}

          {trendingPeople.length > 0 && (
            <PeopleHorizontalList title="Trending People" people={trendingPeople} />
          )}

          <RankedCarousel title="All-Time Greats" movies={topRated.slice(0, 10)} />
        </View>
      </ScrollView>
    </>
  );
};

const BackdropImage = (props: BackdropImageProps) => {
  const { image, index, scrollX } = props;

  const styles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollX.value, [index - 1, index, index + 1], [0, 1, 0]),
    };
  });

  return (
    <AnimatedImage
      source={{ uri: tmdbResize(image.poster, 'w185') ?? undefined }}
      blurRadius={50}
      style={[StyleSheet.absoluteFill, styles]}
    />
  );
};
