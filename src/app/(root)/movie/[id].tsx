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
  MovieWatchProviders,
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
    [activeTab, similarMovies, movieDetails, movieCast, movieImages, movieReviews]
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

          <MovieWatchProviders providers={movieWatchProviders} />

          <MovieTrailers videos={filteredVideos as MovieVideosProps[]} />

          <View className="flex-1 gap-4">
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              className="flex-row gap-2 rounded-full bg-neutral-800/50 p-1.5">
              <Tab
                title="More Like This"
                isActive={activeTab === 'More Like This'}
                onPress={() => setActiveTab('More Like This')}
              />

              <Tab
                title="About"
                isActive={activeTab === 'About'}
                onPress={() => setActiveTab('About')}
              />

              <Tab
                title="Comments"
                isActive={activeTab === 'Comments'}
                onPress={() => setActiveTab('Comments')}
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
