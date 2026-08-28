import { Loader, RowBack, Screen, Text } from '@/components';
import { useMovieFull } from '@/hooks';
import {
  BookmarkButton,
  MovieCastAndCrew,
  MovieCollectionBanner,
  MovieComments,
  MovieFacts,
  MovieGallery,
  MovieHeader,
  MovieInfo,
  MovieSimilar,
  MovieTrailers,
  MovieWatchProviders,
} from '@/screens/movie/components';
import { useViewedMoviesStore } from '@/stores';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MovieDescriptionScreen = () => {
  const { id } = useLocalSearchParams();
  const { bottom } = useSafeAreaInsets();
  const recordView = useViewedMoviesStore((state) => state.recordView);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { movie, isLoading, isError, refetch } = useMovieFull(+id);
  const details = movie?.details;

  useEffect(() => {
    if (details?.id && details.title) {
      recordView({ id: details.id, title: details.title });
    }
  }, [details?.id, details?.title, recordView]);

  if (isLoading) return <Loader />;

  if (isError || !movie || !details) {
    return (
      <Screen canGoBack preset="fixed" safeAreaEdges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center gap-4 px-10">
          <Ionicons name="cloud-offline-outline" size={48} color="rgba(255,255,255,0.3)" />

          <Text className="!text-neutral-400">Something went wrong</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading movie details"
            onPress={() => refetch()}
            className="rounded-full bg-blue-500/15 px-6 py-2">
            <Text className="font-medium !text-blue-400">Retry</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const { videos, cast, images, reviews, similar, recommendations, watchProviders } = movie;

  const trailers = videos.filter((video) => video.type === 'Trailer' || video.type === 'Teaser');
  const hasGallery = images.backdrops.length || images.logos.length || images.posters.length;
  const related = recommendations.length ? recommendations : similar;

  return (
    <Screen canGoBack safeAreaEdges={["bottom"]}>
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
            <MovieInfo
              movie={details}
              certification={movie.certification}
              director={movie.director?.name}
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
          </View>
        </View>
      </Animated.ScrollView>

      <BookmarkButton
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
    </Screen>
  );
};

export default MovieDescriptionScreen;
