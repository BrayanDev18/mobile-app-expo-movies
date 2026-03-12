import { Loader, Screen } from '@/components';
import {
  useSeriesCast,
  useSeriesDetails,
  useSeriesImages,
  useSeriesReviews,
  useSeriesVideos,
  useSeriesWatchProviders,
  useSimilarSeries,
} from '@/hooks';
import { MovieVideosProps } from '@/interfaces';
import {
  MovieCastAndCrew,
  MovieComments,
  MovieGallery,
  MovieHeader,
  MovieTrailers,
  MovieWatchProviders,
} from '@/screens/movie/components';
import { SeriesEpisodes, SeriesInfo, SeriesSimilar } from '@/screens/series/components';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

const SeriesDescriptionScreen = () => {
  const { id } = useLocalSearchParams();

  const { seriesDetails, isSeriesDetailsLoading } = useSeriesDetails(+id);
  const { seriesVideos, isSeriesVideosLoading } = useSeriesVideos(+id);
  const { seriesCast, seriesCrew, isSeriesCastLoading } = useSeriesCast(+id);
  const { seriesImages, isSeriesImagesLoading } = useSeriesImages(+id);
  const { seriesReviews, isSeriesReviewsLoading } = useSeriesReviews(+id);
  const { seriesWatchProviders, isSeriesWatchProvidersLoading } = useSeriesWatchProviders(+id);
  const { similarSeries, isSimilarSeriesLoading } = useSimilarSeries(+id);

  const filteredVideos = seriesVideos?.filter(
    (video: MovieVideosProps) => video.type === 'Trailer' || video.type === 'Teaser'
  );

  if (
    isSeriesDetailsLoading ||
    isSeriesVideosLoading ||
    isSeriesCastLoading ||
    isSeriesImagesLoading ||
    isSeriesReviewsLoading ||
    isSeriesWatchProvidersLoading ||
    isSimilarSeriesLoading
  )
    return <Loader />;

  return (
    <Screen canGoBack preset="scroll" safeAreaEdges={['bottom']}>
      <MovieHeader poster={seriesDetails.poster as string} />

      <View className="-mt-12 rounded-t-3xl bg-neutral-900 backdrop-blur-xl">
        <View className="items-center py-3">
          <View className="h-1.5 w-12 rounded-full bg-white/30" />
        </View>

        <View className="gap-6 px-4">
          <SeriesInfo series={seriesDetails} />

          {seriesDetails.seasons?.length > 0 && (
            <SeriesEpisodes
              seriesId={seriesDetails.id}
              seasons={seriesDetails.seasons}
              seriesTitle={seriesDetails.title}
            />
          )}

          {filteredVideos?.length > 0 && <MovieTrailers videos={filteredVideos} />}

          {seriesCast?.length > 0 && (
            <MovieCastAndCrew
              movieId={seriesDetails.id}
              cast={seriesCast}
              movieCrew={seriesCrew}
              mediaType="series"
            />
          )}

          <MovieWatchProviders providers={seriesWatchProviders} />

          {seriesReviews?.length > 0 && <MovieComments comments={seriesReviews} />}

          {similarSeries?.length > 0 && (
            <SeriesSimilar seriesId={seriesDetails.id} similarSeries={similarSeries} />
          )}

          {seriesImages?.backdrops?.length ||
          seriesImages?.logos?.length ||
          seriesImages?.posters?.length ? (
            <MovieGallery movieId={seriesDetails.id} gallery={seriesImages} />
          ) : null}
        </View>
      </View>
    </Screen>
  );
};

export default SeriesDescriptionScreen;
