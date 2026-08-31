import { SERIES_GENRES, SERIES_NETWORKS } from '@/constants';
import { useViewedSeriesStore } from '@/stores';
import { claimUnique } from '@/utils';
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

export const useSeriesHomeSections = () => {
  const { trending: heroMedia, isLoading: isHeroLoading } = useTrending('tv', 'day');
  const { trending: trendingSeries } = useTrending('tv', 'week');
  const { series: airingToday } = useTvByCategory('airing_today');
  const { series: onTheAir } = useTvByCategory('on_the_air');

  const lastViewed = useViewedSeriesStore((state) => state.viewed[0]);
  const { series: recommendedSeries } = useTvRecommendations(lastViewed?.id);

  const discoverRows = useQueries({
    queries: [
      ...SERIES_NETWORKS.map((network) => discoverTvQuery({ networkId: network.id })),
      ...SERIES_GENRES.map((genre) => discoverTvQuery({ genreId: genre.id })),
      discoverTvQuery({ genreId: 16, originalLanguage: 'ja', minVotes: 300 }),
      discoverTvQuery({ showType: 2, minVotes: 200 }),
      discoverTvQuery({ firstAirDateFrom: newSeasonStartDate() }),
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
      title: lastViewed ? `Because you watched ${lastViewed.title}` : '',
      movies: lastViewed ? claimUnique(recommendedSeries, claimed) : [],
    },
    {
      key: 'trending',
      title: 'Trending This Week',
      movies: claimUnique(trendingSeries, claimed),
      ranked: true,
    },
    {
      key: 'airingToday',
      title: 'New Episodes Today',
      movies: claimUnique(airingToday, claimed),
    },
    {
      key: 'onTheAir',
      title: 'On The Air This Week',
      movies: claimUnique(onTheAir, claimed),
    },
    {
      key: 'newSeason',
      title: 'New This Season',
      movies: claimUnique(newSeasonRow.data ?? [], claimed),
      variant: 'backdrop' as const,
      cardWidth: 310,
    },
    ...SERIES_NETWORKS.map((network, index) => ({
      key: `network-${network.id}`,
      title: network.title,
      movies: claimUnique(discoverRows[index].data ?? [], claimed),
      seeAll: { networkId: network.id },
    })),
    ...SERIES_GENRES.map((genre, index) => ({
      key: `genre-${genre.id}`,
      title: genre.title,
      movies: claimUnique(discoverRows[SERIES_NETWORKS.length + index].data ?? [], claimed),
      seeAll: { genreId: genre.id },
    })),
    {
      key: 'anime',
      title: 'Anime',
      movies: claimUnique(animeRow.data ?? [], claimed),
      seeAll: { genreId: 16, originalLanguage: 'ja', minVotes: 300 },
    },
    {
      key: 'limited',
      title: 'Limited Series',
      movies: claimUnique(limitedRow.data ?? [], claimed),
      seeAll: { showType: 2, minVotes: 200 },
    },
  ].filter((section) => section.movies.length > 0);

  return { heroSeries, sections, isHeroLoading };
};
