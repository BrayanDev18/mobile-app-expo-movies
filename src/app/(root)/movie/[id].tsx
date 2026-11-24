import { ErrorState } from '@/components';
import { useMovieFull } from '@/hooks';
import {
  MediaActionsBar,
  MediaDetailShell,
  MediaDetailSkeleton,
  MovieCastAndCrew,
  MovieCollectionBanner,
  MovieComments,
  MovieFacts,
  MovieGallery,
  MovieInfo,
  MovieSimilar,
  MovieTrailers,
  MovieWatchProviders,
} from '@/screens/movie/components';
import { useViewedMediaStore } from '@/stores';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

const MovieDescriptionScreen = () => {
  const { id, poster } = useLocalSearchParams<{ id: string; poster?: string }>();
  const recordView = useViewedMediaStore((state) => state.recordView);

  const { movie, isLoading, isError, refetch } = useMovieFull(+id);
  const details = movie?.details;

  useEffect(() => {
    if (details?.id && details.title) {
      recordView({ id: details.id, title: details.title, mediaType: 'movie' });
    }
  }, [details?.id, details?.title, recordView]);

  // Same shell as the loaded state, so the header stays mounted when data lands
  if (isLoading) {
    return (
      <MediaDetailShell poster={poster ?? null}>
        <MediaDetailSkeleton />
      </MediaDetailShell>
    );
  }

  if (isError || !movie || !details) {
    return <ErrorState retryLabel="Retry loading movie details" onRetry={() => refetch()} />;
  }

  const { trailers, cast, images, hasGallery, reviews, related, watchProviders } = movie;

  return (
    <MediaDetailShell poster={details.poster}>
      <MovieInfo
        movie={details}
        certification={movie.certification}
        director={movie.director?.name}
      />

      <MediaActionsBar
        movie={{
          id: details.id,
          title: details.title,
          overview: details.overview,
          poster: details.poster,
          backdrop: details.backdrop,
          rating: details.rating,
          releaseDate: details.releaseDate ?? '',
          mediaType: 'movie',
        }}
      />

      {movie.collection && <MovieCollectionBanner collection={movie.collection} />}

      <MovieWatchProviders providers={watchProviders} />

      {trailers.length > 0 && <MovieTrailers videos={trailers} />}

      {(cast.length > 0 || movie.director) && (
        <MovieCastAndCrew movieId={details.id} cast={cast} director={movie.director} />
      )}

      {hasGallery ? <MovieGallery movieId={details.id} gallery={images} /> : null}

      <MovieFacts movie={details} />

      {reviews.length > 0 && <MovieComments comments={reviews} />}

      {related.length > 0 && <MovieSimilar movieId={details.id} similarMovies={related} />}
    </MediaDetailShell>
  );
};

export default MovieDescriptionScreen;
