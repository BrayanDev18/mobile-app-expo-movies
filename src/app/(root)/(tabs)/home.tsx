import { Loader, Tab } from '@/components';
import { useMovieProviders, useMoviesByCategory } from '@/hooks';
import { MovieProps } from '@/interfaces';
import { MovieHorizontalList, MovieProviders, MoviesHeader } from '@/screens/movie/components';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const HomeScreen = () => {
  const scrollX = useSharedValue(0);
  const { top, bottom } = useSafeAreaInsets();

  const { movies: upcomingMovies, isLoading: loadingUpcomingMovies } =
    useMoviesByCategory('upcoming');

  const { movies: nowPlayingMovies, isLoading: loadingNowPlayingMovies } =
    useMoviesByCategory('now_playing');

  const { movies: popularMovies, isLoading: loadingpPopularMovies } =
    useMoviesByCategory('popular');

  const { movies: topRatedMovies, isLoading: loadingTopRatedMovies } =
    useMoviesByCategory('top_rated');

  const { movieProviders, isMovieProvidersLoading } = useMovieProviders();

  if (
    loadingUpcomingMovies ||
    loadingNowPlayingMovies ||
    loadingpPopularMovies ||
    loadingTopRatedMovies ||
    isMovieProvidersLoading
  )
    return <Loader />;

  return (
    <>
      <View style={StyleSheet.absoluteFillObject}>
        {nowPlayingMovies?.map((image, index) => (
          <BackdropImage key={index} image={image} index={index} scrollX={scrollX} />
        ))}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFillObject, { height: '100%' }]}
      />

      <View style={{ paddingTop: top + 15 }} className="w-full flex-row gap-2 px-4 pb-6">
        <BlurView
          intensity={80}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
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
          experimentalBlurMethod="dimezisBlurView"
          className="overflow-hidden rounded-full">
          <Tab
            title="Series"
            isActive={false}
            onPress={() => router.push('/(root)/series/home')}
            adaptableWidth
          />
        </BlurView>

        <BlurView
          intensity={80}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          className="overflow-hidden rounded-full">
          <Tab
            title="Tv shows"
            isActive={false}
            onPress={() => router.push('/(root)/tv/home')}
            adaptableWidth
          />
        </BlurView>
      </View>

      <ScrollView contentContainerClassName="gap-8">
        <MoviesHeader movies={nowPlayingMovies} scrollX={scrollX} />

        <View style={{ paddingBottom: bottom + 80 }} className="gap-8 p-3">
          <MovieProviders movieProviders={movieProviders} />

          <MovieHorizontalList title="Now in Theaters" movies={nowPlayingMovies} />

          <MovieHorizontalList title="Popular Right Now" movies={popularMovies} />

          <MovieHorizontalList title="Top Rated Movies" movies={topRatedMovies} />

          <MovieHorizontalList
            title="Coming Soon"
            movies={upcomingMovies}
            variant="backdrop"
            cardWidth={310}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const BackdropImage = memo(
  ({
    image,
    index,
    scrollX,
  }: {
    image: MovieProps;
    index: number;
    scrollX: SharedValue<number>;
  }) => {
    const styles = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollX.value, [index - 1, index, index + 1], [0, 1, 0]),
      };
    });

    return (
      <AnimatedImage
        source={{ uri: image.poster }}
        blurRadius={50}
        style={[StyleSheet.absoluteFillObject, styles]}
        cachePolicy="memory-disk"
      />
    );
  }
);
