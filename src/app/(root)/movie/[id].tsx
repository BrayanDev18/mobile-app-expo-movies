import { Loader, Screen } from '@/components';
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
  MovieCastAndCrew,
  MovieComments,
  MovieGallery,
  MovieHeader,
  MovieInfo,
  MovieSimilar,
  MovieTrailers,
  MovieWatchProviders,
} from '@/screens/movie/components';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

const MovieDescriptionScreen = () => {
  const { id } = useLocalSearchParams();

  const { movieDetails, isMovieDetailsLoading } = useMovieDetails(+id);
  const { movieVideos, isMovieVideosLoading } = useMovieVideos(+id);
  const { similarMovies, isSimilarMoviesLoading } = useSimilarMovies(+id);
  const { movieCast, movieCrew, isMovieCastLoading } = useMovieCast(+id);
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
      <MovieHeader poster={movieDetails.poster as string} />

      <View className="-mt-12 rounded-t-3xl bg-neutral-900 backdrop-blur-xl">
        <View className="items-center py-3">
          <View className="h-1.5 w-12 rounded-full bg-white/30" />
        </View>

        <View className="gap-6 px-4">
          <MovieInfo movie={movieDetails} />

          <MovieTrailers videos={filteredVideos} />

          <MovieCastAndCrew movieId={movieDetails.id} cast={movieCast} movieCrew={movieCrew} />

          <MovieWatchProviders providers={movieWatchProviders} />

          <MovieComments comments={movieReviews} />

          <MovieSimilar movieId={movieDetails.id} similarMovies={similarMovies} />

          {movieImages?.backdrops.length ||
          movieImages?.logos.length ||
          movieImages?.posters.length ? (
            <MovieGallery movieId={movieDetails.id} gallery={movieImages} />
          ) : null}
        </View>
      </View>
    </Screen>
  );
};

export default MovieDescriptionScreen;
