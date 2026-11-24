import { SERIES_GENRES, SERIES_NETWORKS } from '@/constants';
import { selectLastViewed, useViewedMediaStore } from '@/stores';
import { useTranslate } from '@/translate';
import { claimUnique, lazyRail } from '@/utils';
import { useQueries } from '@tanstack/react-query';
import { useTrending } from '../../../hooks/useTrending';
import { HomeSection } from '@/interfaces';
import { discoverTvQuery } from './useDiscoverTv';
import { useTvByCategory } from './useTvByCategory';
import { useTvRecommendations } from './useTvRecommendations';

const newSeasonStartDate = () => {
  const date = new Date();

  date.setMonth(date.getMonth() - 3);

  return date.toISOString().slice(0, 10);
};

export const useSeriesHomeSections = (activeRails: ReadonlySet<string>) => {
  const { t } = useTranslate();
  const {
    trending: heroMedia,
    isLoading: isHeroLoading,
    isError: isHeroError,
    refetch: refetchHero,
  } = useTrending('tv', 'day');
  const { trending: trendingSeries, isLoading: isTrendingLoading } = useTrending('tv', 'week');
  const { series: airingToday, isLoading: isAiringTodayLoading } = useTvByCategory('airing_today');
  const { series: onTheAir, isLoading: isOnTheAirLoading } = useTvByCategory('on_the_air');

  const lastViewed = useViewedMediaStore(selectLastViewed('tv'));
  const { series: recommendedSeries, isLoading: isRecommendedLoading } = useTvRecommendations(
    lastViewed?.id
  );

  // Below-the-fold rails: each fetches only once MediaHome activates its key
  const lazy = <T>(query: T, key: string) => ({ ...query, enabled: activeRails.has(key) });

  const discoverRows = useQueries({
    queries: [
      ...SERIES_NETWORKS.map((network) =>
        lazy(discoverTvQuery({ networkId: network.id }), `network-${network.id}`)
      ),
      ...SERIES_GENRES.map((genre) =>
        lazy(discoverTvQuery({ genreId: genre.id }), `genre-${genre.id}`)
      ),
      lazy(discoverTvQuery({ genreId: 16, originalLanguage: 'ja', minVotes: 300 }), 'anime'),
      lazy(discoverTvQuery({ showType: 2, minVotes: 200 }), 'limited'),
      lazy(discoverTvQuery({ firstAirDateFrom: newSeasonStartDate() }), 'newSeason'),
    ],
  });

  const animeRow = discoverRows[SERIES_NETWORKS.length + SERIES_GENRES.length];
  const limitedRow = discoverRows[SERIES_NETWORKS.length + SERIES_GENRES.length + 1];
  const newSeasonRow = discoverRows[SERIES_NETWORKS.length + SERIES_GENRES.length + 2];

  const heroSeries = heroMedia.filter((media) => media.poster);

  const claimed = new Set<string>();

  const sections: HomeSection[] = [
    {
      key: 'recommended',
      title: lastViewed ? t('home.becauseYouWatched', { title: lastViewed.title }) : '',
      movies: lastViewed ? claimUnique(recommendedSeries, claimed) : [],
      isPending: isRecommendedLoading,
    },
    {
      key: 'trending',
      title: t('home.trendingThisWeek'),
      movies: claimUnique(trendingSeries, claimed),
      ranked: true,
      isPending: isTrendingLoading,
    },
    {
      key: 'airingToday',
      title: t('home.newEpisodesToday'),
      movies: claimUnique(airingToday, claimed),
      isPending: isAiringTodayLoading,
    },
    {
      key: 'onTheAir',
      title: t('home.onTheAirThisWeek'),
      movies: claimUnique(onTheAir, claimed),
      isPending: isOnTheAirLoading,
    },
    {
      key: 'newSeason',
      title: t('home.newThisSeason'),
      ...lazyRail(newSeasonRow, claimed),
      variant: 'backdrop' as const,
      cardWidth: 310,
    },
    ...SERIES_NETWORKS.map((network, index) => ({
      key: `network-${network.id}`,
      title: t(network.titleKey),
      ...lazyRail(discoverRows[index], claimed),
      seeAll: { networkId: network.id },
    })),
    ...SERIES_GENRES.map((genre, index) => ({
      key: `genre-${genre.id}`,
      title: t(genre.titleKey),
      ...lazyRail(discoverRows[SERIES_NETWORKS.length + index], claimed),
      seeAll: { genreId: genre.id },
    })),
    {
      key: 'anime',
      title: t('home.anime'),
      ...lazyRail(animeRow, claimed),
      seeAll: { genreId: 16, originalLanguage: 'ja', minVotes: 300 },
    },
    {
      key: 'limited',
      title: t('home.limitedSeries'),
      ...lazyRail(limitedRow, claimed),
      seeAll: { showType: 2, minVotes: 200 },
    },
  ].filter((section: HomeSection) => section.isPending || section.movies.length > 0);

  return { heroSeries, sections, isHeroLoading, isHeroError, refetchHero };
};
