import { Loader, Screen, Tab } from '@/components';
import {
  useMovieCast,
  useMovieDetails,
  useMovieImages,
  useMovieReview,
  useMovieVideos,
  useMovieWatchProviders,
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
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface RenderTabContentProps {
  activeTab: string;
  similarMovies: SimilarMoviesProps[];
  movieDetails: MovieDetailsProps;
  movieCast: MovieCastProps[];
  gallery: MovieImagesProps[];
  comments: MovieReviewProps[];
  watchProviders: string;
}

const MovieDescriptionScreen = () => {
  const { id } = useLocalSearchParams();

  const { movieDetails, isMovieDetailsLoading } = useMovieDetails(+id);
  const { movieVideos, isMovieVideosLoading } = useMovieVideos(+id);
  const { similarMovies, isSimilarMoviesLoading } = useSimilarMovies(+id);
  const { movieCast, isMovieCastLoading } = useMovieCast(+id);
  const { movieImages, isMovieImagesLoading } = useMovieImages(+id);
  const { movieReviews, isMovieReviewsLoading } = useMovieReview(+id);
  const { movieWatchProviders, isMovieWatchProviders } = useMovieWatchProviders(+id);

  const [activeTab, setActiveTab] = useState<'similar' | 'about' | 'comments'>('similar');

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
        watchProviders: movieWatchProviders as string,
      }),
    [
      activeTab,
      similarMovies,
      movieDetails,
      movieCast,
      movieImages,
      movieReviews,
      movieWatchProviders,
    ]
  );

  if (
    isMovieDetailsLoading ||
    isMovieVideosLoading ||
    isSimilarMoviesLoading ||
    isMovieCastLoading ||
    isMovieImagesLoading ||
    isMovieReviewsLoading ||
    isMovieWatchProviders
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

          <View className="flex-1 gap-4">
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              className="flex-row gap-2 rounded-full bg-neutral-800/50 p-1.5">
              <Tab
                title="Similar"
                isActive={activeTab === 'similar'}
                onPress={() => setActiveTab('similar')}
              />

              <Tab
                title="About"
                isActive={activeTab === 'about'}
                onPress={() => setActiveTab('about')}
              />

              <Tab
                title="Reviews"
                isActive={activeTab === 'comments'}
                onPress={() => setActiveTab('comments')}
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

const renderTabContent = (props: RenderTabContentProps) => {
  const { activeTab, similarMovies, movieDetails, movieCast, gallery, comments, watchProviders } =
    props;

  switch (activeTab) {
    case 'similar':
      return <MovieSimilar similarMovies={similarMovies} />;
    case 'about':
      return (
        <MovieAbout
          movieDetails={movieDetails}
          movieCast={movieCast}
          gallery={gallery}
          providers={watchProviders}
        />
      );
    case 'comments':
      return <MovieComments comments={comments} />;
    default:
      return null;
  }
};
