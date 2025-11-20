import { CustomTabs, Loader, Screen, TabsList, TabsPanel, TabsTrigger } from '@/components';
import {
  useMovieCast,
  useMovieDetails,
  useMovieImages,
  useMovieReview,
  useMovieVideos,
  useMovieWatchProviders,
  useSimilarMovies,
} from '@/hooks';
import { MovieVideosProps } from '@/interfaces';
import {
  MovieAbout,
  MovieComments,
  MovieHeader,
  MovieInfo,
  MovieSimilar,
  MovieTrailers,
} from '@/screens/movie/components';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

const MovieDescriptionScreen = () => {
  const { id } = useLocalSearchParams();

  const { movieDetails, isMovieDetailsLoading } = useMovieDetails(+id);
  const { movieVideos, isMovieVideosLoading } = useMovieVideos(+id);
  const { similarMovies, isSimilarMoviesLoading } = useSimilarMovies(+id);
  const { movieCast, isMovieCastLoading } = useMovieCast(+id);
  const { movieImages, isMovieImagesLoading } = useMovieImages(+id);
  const { movieReviews, isMovieReviewsLoading } = useMovieReview(+id);
  const { movieWatchProviders, isMovieWatchProviders } = useMovieWatchProviders(+id);

  const filteredVideos = movieVideos?.filter(
    (video: MovieVideosProps) => video.type === 'Trailer' || video.type === 'Teaser'
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

          <CustomTabs defaultValue="similar">
            <View className="flex-1 gap-4">
              <TabsList>
                <TabsTrigger value="similar">Similar</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="comments">Reviews</TabsTrigger>
              </TabsList>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TabsPanel value="similar">
                  <MovieSimilar similarMovies={similarMovies} />
                </TabsPanel>

                <TabsPanel value="about">
                  <MovieAbout
                    movieDetails={movieDetails}
                    movieCast={movieCast}
                    gallery={movieImages}
                    providers={movieWatchProviders as string}
                  />
                </TabsPanel>

                <TabsPanel value="comments">
                  <MovieComments comments={movieReviews} />
                </TabsPanel>
              </ScrollView>
            </View>
          </CustomTabs>
        </View>
      </View>
    </Screen>
  );
};

export default MovieDescriptionScreen;
