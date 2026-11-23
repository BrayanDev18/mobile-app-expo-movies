import { HOME_GENRES, HOME_PROVIDERS } from '@/constants';
import { HomeSection } from '@/interfaces';
import { useTrending } from '../../../hooks/useTrending';
import { selectLastViewed, useViewedMediaStore } from '@/stores';
import { claimUnique, deviceRegion, lazyRail } from '@/utils';
import { useQueries } from '@tanstack/react-query';
import { discoverMoviesQuery } from './useDiscoverMovies';
import { useMovieRecommendations } from './useMovieRecommendations';
import { useMoviesByCategory } from './useMoviesByCategory';

export const useHomeSections = (activeRails: ReadonlySet<string>) => {
  const {
    trending: heroMedia,
    isLoading: isHeroLoading,
    isError: isHeroError,
    refetch: refetchHero,
  } = useTrending('all', 'day');
  const { trending: trendingMovies, isLoading: isTrendingLoading } = useTrending('movie', 'week');
  const { trending: trendingSeries, isLoading: isSeriesLoading } = useTrending('tv', 'week');
  const { movies: nowPlayingMovies, isLoading: isNowPlayingLoading } =
    useMoviesByCategory('now_playing');
  const { movies: upcomingMovies, isLoading: isUpcomingLoading } = useMoviesByCategory('upcoming');

  const lastViewed = useViewedMediaStore(selectLastViewed('movie'));
  const { movies: recommendedMovies, isLoading: isRecommendedLoading } = useMovieRecommendations(
    lastViewed?.id
  );

  const region = deviceRegion();

  // Below-the-fold rails: each fetches only once MediaHome activates its key
  const discoverRows = useQueries({
    queries: [
      ...HOME_GENRES.map((genre) => ({
        ...discoverMoviesQuery({ genreId: genre.id }, region),
        enabled: activeRails.has(`genre-${genre.id}`),
      })),
      ...HOME_PROVIDERS.map((provider) => ({
        ...discoverMoviesQuery({ providerId: provider.id }, region),
        enabled: activeRails.has(`provider-${provider.id}`),
      })),
    ],
  });

  const heroMovies = heroMedia.filter((media) => media.poster);

  const claimed = new Set<string>();

  const sections: HomeSection[] = [
    {
      key: 'recommended',
      title: lastViewed ? `Because you watched ${lastViewed.title}` : '',
      movies: lastViewed ? claimUnique(recommendedMovies, claimed) : [],
      isPending: isRecommendedLoading,
    },
    {
      key: 'trending',
      title: 'Trending This Week',
      movies: claimUnique(trendingMovies, claimed),
      ranked: true,
      isPending: isTrendingLoading,
    },
    {
      key: 'nowPlaying',
      title: 'Now in Theaters',
      movies: claimUnique(nowPlayingMovies, claimed),
      isPending: isNowPlayingLoading,
    },
    {
      key: 'series',
      title: 'Popular Series',
      movies: claimUnique(trendingSeries, claimed),
      isPending: isSeriesLoading,
    },
    ...HOME_GENRES.map((genre, index) => ({
      key: `genre-${genre.id}`,
      title: genre.title,
      ...lazyRail(discoverRows[index], claimed),
      seeAll: { genreId: genre.id },
    })),
    ...HOME_PROVIDERS.map((provider, index) => ({
      key: `provider-${provider.id}`,
      title: provider.title,
      ...lazyRail(discoverRows[HOME_GENRES.length + index], claimed),
      seeAll: { providerId: provider.id },
    })),
    {
      key: 'upcoming',
      title: 'Coming Soon',
      movies: claimUnique(upcomingMovies, claimed),
      isPending: isUpcomingLoading,
      variant: 'backdrop' as const,
      cardWidth: 310,
    },
  ].filter((section: HomeSection) => section.isPending || section.movies.length > 0);

  return { heroMovies, sections, isHeroLoading, isHeroError, refetchHero };
};
