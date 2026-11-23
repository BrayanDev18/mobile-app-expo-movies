import { HOME_GENRES, HOME_PROVIDERS } from '@/constants';
import { HomeSection } from '@/interfaces';
import { useTrending } from '../../../hooks/useTrending';
import { selectLastViewed, useViewedMediaStore } from '@/stores';
import { useTranslate } from '@/translate';
import { claimUnique, deviceRegion } from '@/utils';
import { useQueries } from '@tanstack/react-query';
import { discoverMoviesQuery } from './useDiscoverMovies';
import { useMovieRecommendations } from './useMovieRecommendations';
import { useMoviesByCategory } from './useMoviesByCategory';

export const useHomeSections = () => {
  const { t } = useTranslate();
  const {
    trending: heroMedia,
    isLoading: isHeroLoading,
    isError: isHeroError,
    refetch: refetchHero,
  } = useTrending('all', 'day');
  const { trending: trendingMovies } = useTrending('movie', 'week');
  const { trending: trendingSeries } = useTrending('tv', 'week');
  const { movies: nowPlayingMovies } = useMoviesByCategory('now_playing');
  const { movies: upcomingMovies } = useMoviesByCategory('upcoming');

  const lastViewed = useViewedMediaStore(selectLastViewed('movie'));
  const { movies: recommendedMovies } = useMovieRecommendations(lastViewed?.id);

  const region = deviceRegion();

  const discoverRows = useQueries({
    queries: [
      ...HOME_GENRES.map((genre) => discoverMoviesQuery({ genreId: genre.id }, region)),
      ...HOME_PROVIDERS.map((provider) => discoverMoviesQuery({ providerId: provider.id }, region)),
    ],
  });

  const heroMovies = heroMedia.filter((media) => media.poster);

  const claimed = new Set<string>();

  const sections: HomeSection[] = [
    {
      key: 'recommended',
      title: lastViewed ? t('home.becauseYouWatched', { title: lastViewed.title }) : '',
      movies: lastViewed ? claimUnique(recommendedMovies, claimed) : [],
    },
    {
      key: 'trending',
      title: t('home.trendingThisWeek'),
      movies: claimUnique(trendingMovies, claimed),
      ranked: true,
    },
    {
      key: 'nowPlaying',
      title: t('home.nowInTheaters'),
      movies: claimUnique(nowPlayingMovies, claimed),
    },
    { key: 'series', title: t('home.popularSeries'), movies: claimUnique(trendingSeries, claimed) },
    ...HOME_GENRES.map((genre, index) => ({
      key: `genre-${genre.id}`,
      title: t(genre.titleKey),
      movies: claimUnique(discoverRows[index].data ?? [], claimed),
      seeAll: { genreId: genre.id },
    })),
    ...HOME_PROVIDERS.map((provider, index) => ({
      key: `provider-${provider.id}`,
      title: t(provider.titleKey),
      movies: claimUnique(discoverRows[HOME_GENRES.length + index].data ?? [], claimed),
      seeAll: { providerId: provider.id },
    })),
    {
      key: 'upcoming',
      title: t('home.comingSoon'),
      movies: claimUnique(upcomingMovies, claimed),
      variant: 'backdrop' as const,
      cardWidth: 310,
    },
  ].filter((section) => section.movies.length > 0);

  return { heroMovies, sections, isHeroLoading, isHeroError, refetchHero };
};
