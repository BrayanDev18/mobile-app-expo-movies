import { Loader, Screen, Text } from '@/components';
import { useTvFull } from '@/hooks';
import {
  MediaActionsBar,
  MovieCastAndCrew,
  MovieComments,
  MovieGallery,
  MovieHeader,
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
import { useViewedSeriesStore } from '@/stores';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const SeriesDescriptionScreen = () => {
  const { id } = useLocalSearchParams();
  const recordView = useViewedSeriesStore((state) => state.recordView);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { series, isLoading, isError, refetch } = useTvFull(+id);
  const details = series?.details;

  useEffect(() => {
    if (details?.id && details.title) {
      recordView({ id: details.id, title: details.title });
    }
  }, [details?.id, details?.title, recordView]);

  if (isLoading) return <Loader />;

  if (isError || !series || !details) {
    return (
      <Screen canGoBack preset="fixed" safeAreaEdges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center gap-4 px-10">
          <Ionicons name="cloud-offline-outline" size={48} color="rgba(255,255,255,0.3)" />

          <Text className="!text-neutral-400">Something went wrong</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading series details"
            onPress={() => refetch()}
            className="rounded-full bg-blue-500/15 px-6 py-2">
            <Text className="font-medium !text-blue-400">Retry</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const { videos, cast, images, reviews, similar, recommendations, watchProviders, creator } =
    series;

  const trailers = videos.filter((video) => video.type === 'Trailer' || video.type === 'Teaser');
  const hasGallery = images.backdrops.length || images.logos.length || images.posters.length;
  const related = recommendations.length ? recommendations : similar;

  return (
    <Screen canGoBack safeAreaEdges={['bottom']}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        <MovieHeader poster={details.poster as string} scrollY={scrollY} />

        <View className="-mt-16 rounded-t-3xl bg-neutral-900 backdrop-blur-xl">
          <View className="items-center py-3">
            <View className="h-1.5 w-12 rounded-full bg-white/30" />
          </View>

          <View className="gap-6 px-4">
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

            {trailers.length > 0 && <MovieTrailers videos={trailers} />}

            {(cast.length > 0 || creator) && (
              <MovieCastAndCrew
                movieId={details.id}
                cast={cast}
                director={creator}
                mediaType="tv"
              />
            )}

            <SeasonsList
              seriesId={details.id}
              seriesTitle={details.title}
              seasons={details.seasons}
            />

            {hasGallery ? (
              <MovieGallery movieId={details.id} gallery={images} mediaType="tv" />
            ) : null}

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
          </View>
        </View>
      </Animated.ScrollView>
    </Screen>
  );
};

export default SeriesDescriptionScreen;
