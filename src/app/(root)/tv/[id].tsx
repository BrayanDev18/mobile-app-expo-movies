import { ErrorState, Loader } from '@/components';
import { useTvFull } from '@/hooks';
import {
  MediaActionsBar,
  MediaDetailShell,
  MovieCastAndCrew,
  MovieComments,
  MovieGallery,
  MovieHorizontalList,
  MovieTrailers,
  MovieWatchProviders,
} from '@/screens/movie/components';
import {
  NextEpisodeBanner,
  SeasonsList,
  SeriesFacts,
  SeriesInfo,
} from '@/screens/series/components';
import { useViewedMediaStore } from '@/stores';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

const SeriesDescriptionScreen = () => {
  const { id } = useLocalSearchParams();
  const recordView = useViewedMediaStore((state) => state.recordView);

  const { series, isLoading, isError, refetch } = useTvFull(+id);
  const details = series?.details;

  useEffect(() => {
    if (details?.id && details.title) {
      recordView({ id: details.id, title: details.title, mediaType: 'tv' });
    }
  }, [details?.id, details?.title, recordView]);

  if (isLoading) return <Loader />;

  if (isError || !series || !details) {
    return <ErrorState retryLabel="Retry loading series details" onRetry={() => refetch()} />;
  }

  const { trailers, cast, images, hasGallery, reviews, related, watchProviders, creator } = series;

  return (
    <MediaDetailShell poster={details.poster}>
      <SeriesInfo series={details} certification={series.certification} />

      <MediaActionsBar
        movie={{
          id: details.id,
          title: details.title,
          overview: details.overview,
          poster: details.poster,
          backdrop: details.backdrop,
          rating: details.rating,
          releaseDate: details.firstAirDate ?? '',
          mediaType: 'tv',
        }}
      />

      {details.nextEpisode && <NextEpisodeBanner nextEpisode={details.nextEpisode} />}

      <MovieWatchProviders providers={watchProviders} />

      {trailers.length > 0 && <MovieTrailers videos={trailers} mediaType="tv" />}

      {(cast.length > 0 || creator) && (
        <MovieCastAndCrew movieId={details.id} cast={cast} director={creator} mediaType="tv" />
      )}

      <SeasonsList seriesId={details.id} seriesTitle={details.title} seasons={details.seasons} />

      {hasGallery ? <MovieGallery movieId={details.id} gallery={images} mediaType="tv" /> : null}

      <SeriesFacts series={details} />

      {reviews.length > 0 && <MovieComments comments={reviews} />}

      {related.length > 0 && (
        <MovieHorizontalList
          title="You might also like"
          movies={related.slice(0, 10)}
          cardWidth={145}
          cardHeight={200}
        />
      )}
    </MediaDetailShell>
  );
};

export default SeriesDescriptionScreen;
