import { HOME_GENRES, HOME_PROVIDERS } from '@/constants';
import { HomeSection } from '@/interfaces';
import { useTrending } from '../../../hooks/useTrending';
import { selectLastViewed, useViewedMediaStore } from '@/stores';
import { claimUnique, deviceRegion } from '@/utils';
import { useQueries } from '@tanstack/react-query';
import { discoverMoviesQuery } from './useDiscoverMovies';
import { useMovieRecommendations } from './useMovieRecommendations';
import { useMoviesByCategory } from './useMoviesByCategory';

export const useHomeSections = () => {
  const { trending: heroMedia, isLoading: isHeroLoading } = useTrending('all', 'day');
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
      title: lastViewed ? `Because you watched ${lastViewed.title}` : '',
      movies: lastViewed ? claimUnique(recommendedMovies, claimed) : [],
    },
    {
      key: 'trending',
      title: 'Trending This Week',
      movies: claimUnique(trendingMovies, claimed),
      ranked: true,
    },
    {
      key: 'nowPlaying',
      title: 'Now in Theaters',
      movies: claimUnique(nowPlayingMovies, claimed),
    },
    { key: 'series', title: 'Popular Series', movies: claimUnique(trendingSeries, claimed) },
    ...HOME_GENRES.map((genre, index) => ({
      key: `genre-${genre.id}`,
      title: genre.title,
      movies: claimUnique(discoverRows[index].data ?? [], claimed),
      seeAll: { genreId: genre.id },
    })),
    ...HOME_PROVIDERS.map((provider, index) => ({
      key: `provider-${provider.id}`,
      title: provider.title,
      movies: claimUnique(discoverRows[HOME_GENRES.length + index].data ?? [], claimed),
      seeAll: { providerId: provider.id },
    })),
    {
      key: 'upcoming',
      title: 'Coming Soon',
      movies: claimUnique(upcomingMovies, claimed),
      variant: 'backdrop' as const,
      cardWidth: 310,
    },
  ].filter((section) => section.movies.length > 0);

  return { heroMovies, sections, isHeroLoading };
};
