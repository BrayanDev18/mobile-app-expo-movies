import { BlurView, Loader, Tab } from '@/components';
import { useHomeSections, useMoviesByCategory, useTrendingPeople } from '@/hooks';
import { MovieProps } from '@/interfaces';
import {
  MovieHorizontalList,
  MoviesHeader,
  PeopleHorizontalList,
  RankedCarousel,
} from '@/screens/movie/components';
import { HomeSection } from '@/screens/movie/hooks';
import { tmdbResize } from '@/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

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

const HomeScreen = () => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { top, bottom } = useSafeAreaInsets();

  useAnimatedReaction(
    () => Math.round(scrollX.value),
    (value, prev) => {
      if (value !== prev) scheduleOnRN(setActiveIndex, value);
    }
  );

  const { heroMovies, sections, isHeroLoading } = useHomeSections();
  const { people: trendingPeople } = useTrendingPeople();
  const { movies: topRated } = useMoviesByCategory('top_rated');

  if (isHeroLoading) return <Loader />;

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

      <HomeTabs top={top} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-8">
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

export default HomeScreen;

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

const HomeTabs = ({ top }: { top: number }) => (
  <View style={{ paddingTop: top + 15 }} className="w-full flex-row gap-2 px-4 pb-6">
    <BlurView
      intensity={80}
      tint="dark"
      className="overflow-hidden rounded-full">
      <Tab
        title="Movies"
        isActive={false}
        onPress={() => router.push('/(root)/(tabs)/home')}
        adaptableWidth
      />
    </BlurView>

    <BlurView
      intensity={80}
      tint="dark"
      className="overflow-hidden rounded-full">
      <Tab
        title="Series"
        isActive={false}
        onPress={() => router.push('/(root)/series/home')}
        adaptableWidth
      />
    </BlurView>
  </View>
);
