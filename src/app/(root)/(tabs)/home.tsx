import { Loader } from '@/components';
import { useMoviesByCategory } from '@/hooks';
import { MovieHorizontalList, MoviesHeader } from '@/screens/movie/components';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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
  const { bottom } = useSafeAreaInsets();

  const { movies: upcomingMovies, isLoading: loadingUpcomingMovies } =
    useMoviesByCategory('upcoming');

  const { movies: nowPlayingMovies, isLoading: loadingNowPlayingMovies } =
    useMoviesByCategory('now_playing');

  const { movies: popularMovies, isLoading: loadingpPopularMovies } =
    useMoviesByCategory('popular');

  const { movies: topRatedMovies, isLoading: loadingTopRatedMovies } =
    useMoviesByCategory('top_rated');

  if (
    loadingUpcomingMovies ||
    loadingNowPlayingMovies ||
    loadingpPopularMovies ||
    loadingTopRatedMovies
  )
    return <Loader />;

  return (
    <>
      <View style={StyleSheet.absoluteFillObject}>
        {upcomingMovies?.map((image, index) => (
          <BackdropImage key={index} image={image} index={index} scrollX={scrollX} />
        ))}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFillObject, { height: '100%' }]}
      />

      <ScrollView style={{ marginBottom: bottom + 60 }} contentContainerClassName="gap-8">
        <MoviesHeader movies={upcomingMovies} scrollX={scrollX} />

        <View className="gap-8 p-3">
          <MovieHorizontalList title="Playing Today" movies={nowPlayingMovies} />

          <MovieHorizontalList title="Most watched" movies={popularMovies} />

          <MovieHorizontalList title="Best of the Best" movies={topRatedMovies} />
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const BackdropImage = memo(
  ({ image, index, scrollX }: { image: any; index: number; scrollX: SharedValue<number> }) => {
    const styles = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollX.value, [index - 1, index, index + 1], [0, 1, 0]),
      };
    });

    return (
      <AnimatedImage
        source={{ uri: image.poster_path }}
        blurRadius={50}
        style={[StyleSheet.absoluteFillObject, styles]}
        cachePolicy="memory-disk"
      />
    );
  }
);
