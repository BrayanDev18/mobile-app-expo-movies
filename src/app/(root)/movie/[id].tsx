import { Loader, Screen, Text } from '@/components';
import {
  useMovieCast,
  useMovieDetails,
  useMovieImages,
  useMovieReview,
  useMovieVideos,
  useSimilarMovies,
} from '@/hooks';
import {
  MovieCastProps,
  MovieDetailsProps,
  MovieImagesProps,
  MovieReviewProps,
  MovieVideosProps,
  SimilarMoviesProps,
} from '@/interfaces';
import {
  MovieAbout,
  MovieComments,
  MovieHeader,
  MovieInfo,
  MovieSimilar,
  MovieTrailers,
} from '@/screens/movie/components';
import { useLocalSearchParams } from 'expo-router';
import { memo, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface TabsProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  delay: number;
}

interface RenderTabContentProps {
  activeTab: string;
  similarMovies: SimilarMoviesProps[];
  movieDetails: MovieDetailsProps;
  movieCast: MovieCastProps[];
  gallery: MovieImagesProps[];
  comments: MovieReviewProps[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MovieDescriptionScreen = () => {
  const { id } = useLocalSearchParams();

  const { movieDetails, isMovieDetailsLoading } = useMovieDetails(+id);
  const { movieVideos, isMovieVideosLoading } = useMovieVideos(+id);
  const { similarMovies, isSimilarMoviesLoading } = useSimilarMovies(+id);
  const { movieCast, isMovieCastLoading } = useMovieCast(+id);
  const { movieImages, isMovieImagesLoading } = useMovieImages(+id);
  const { movieReviews, isMovieReviewsLoading } = useMovieReview(+id);

  const [activeTab, setActiveTab] = useState('More Like This');

  const filteredVideos = movieVideos?.filter(
    (video: MovieVideosProps) => video.type === 'Trailer' || video.type === 'Teaser'
  );

  const tabContent = useMemo(
    () =>
      renderTabContent({
        activeTab,
        similarMovies: similarMovies as SimilarMoviesProps[],
        movieDetails: movieDetails as MovieDetailsProps,
        movieCast: movieCast as MovieCastProps[],
        gallery: movieImages as MovieImagesProps[],
        comments: movieReviews as MovieReviewProps[],
      }),
    [activeTab, similarMovies]
  );

  if (
    isMovieDetailsLoading ||
    isMovieVideosLoading ||
    isSimilarMoviesLoading ||
    isMovieCastLoading ||
    isMovieImagesLoading ||
    isMovieReviewsLoading
  )
    return <Loader />;

  return (
    <Screen canGoBack preset="scroll" safeAreaEdges={['bottom']}>
      <MovieHeader movie={movieDetails} />

      <View className="-mt-12 rounded-t-3xl bg-neutral-900 backdrop-blur-xl">
        <View className="items-center py-3">
          <View className="h-1.5 w-12 rounded-full bg-white/30" />
        </View>

        <View className="gap-6 px-4">
          <MovieInfo movie={movieDetails} />

          <MovieTrailers videos={filteredVideos as MovieVideosProps[]} />

          <View className="flex-1 gap-6">
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              className="flex-row border-b-2 border-neutral-700">
              <Tab
                title="More Like This"
                isActive={activeTab === 'More Like This'}
                onPress={() => setActiveTab('More Like This')}
                delay={200}
              />

              <Tab
                title="About"
                isActive={activeTab === 'About'}
                onPress={() => setActiveTab('About')}
                delay={300}
              />

              <Tab
                title="Comments"
                isActive={activeTab === 'Comments'}
                onPress={() => setActiveTab('Comments')}
                delay={400}
              />
            </Animated.View>

            <ScrollView showsVerticalScrollIndicator={false}>{tabContent}</ScrollView>
          </View>
        </View>
      </View>
    </Screen>
  );
};

export default MovieDescriptionScreen;

const Tab = memo((props: TabsProps) => {
  const { title, isActive, onPress, delay } = props;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    scheduleOnRN(onPress);
  };

  return (
    <AnimatedPressable
      entering={SlideInLeft.delay(delay).springify()}
      style={animatedStyle}
      onPress={handlePress}
      className="flex-1 items-center justify-center py-3">
      <Text
        className={`font-medium ${isActive ? 'font-semibold !text-blue-500' : '!text-neutral-400'}`}>
        {title}
      </Text>

      {isActive && (
        <Animated.View
          entering={FadeIn.springify()}
          className="absolute -bottom-[2px] h-0.5 w-full rounded-full bg-blue-500"
        />
      )}
    </AnimatedPressable>
  );
});

const renderTabContent = (props: RenderTabContentProps) => {
  const { activeTab, similarMovies, movieDetails, movieCast, gallery, comments } = props;

  switch (activeTab) {
    case 'More Like This':
      return <MovieSimilar similarMovies={similarMovies} />;
    case 'About':
      return <MovieAbout movieDetails={movieDetails} movieCast={movieCast} gallery={gallery} />;
    case 'Comments':
      return <MovieComments comments={comments} />;
    default:
      return null;
  }
};
