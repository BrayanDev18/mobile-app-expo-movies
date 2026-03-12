import { Screen } from '@/components';
import {
  useDiscoverMovies,
  useDiscoverTv,
  useGetTrendingAll,
  useMovieGenres,
  useMoviesByCategory,
  useSearch,
  useSeriesByCategory,
  useTrendingMovies,
  useTrendingPeople,
  useTrendingTv,
  useTvGenres,
} from '@/hooks';
import { MovieProps } from '@/interfaces';
import {
  DiscoverSection,
  ExploreFilterTabs,
  ExploreSearchBar,
  SearchResultsGrid,
  TrendingPeopleStrip,
} from '@/screens/explore/components';
import { ExploreFilter } from '@/screens/explore/components/ExploreFilterTabs';
import { HomeSection, TrendingStrip } from '@/screens/home/components';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ExploreScreen = () => {
  const { top, bottom } = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ExploreFilter>('all');
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const { trendingAll, isLoading: loadingTrendingAll, refetch: refetchTrendingAll } =
    useGetTrendingAll();
  const { trendingMovies, isLoading: loadingTrendingMovies, refetch: refetchTrendingMovies } =
    useTrendingMovies();
  const { trendingTv, isLoading: loadingTrendingTv, refetch: refetchTrendingTv } =
    useTrendingTv();
  const { trendingPeople, isLoading: loadingTrendingPeople, refetch: refetchTrendingPeople } =
    useTrendingPeople();
  const { genres: movieGenres } = useMovieGenres();
  const { genres: tvGenres } = useTvGenres();
  const { movies: popularMovies, isLoading: loadingPopular, refetch: refetchPopular } =
    useMoviesByCategory('popular');
  const { movies: topRatedMovies, isLoading: loadingTopRated, refetch: refetchTopRated } =
    useMoviesByCategory('top_rated');
  const { series: popularSeries, isLoading: loadingPopularSeries, refetch: refetchPopularSeries } =
    useSeriesByCategory('popular');
  const { series: topRatedSeries, isLoading: loadingTopRatedSeries, refetch: refetchTopRatedSeries } =
    useSeriesByCategory('top_rated');

  const searchType =
    activeFilter === 'movies'
      ? 'movie'
      : activeFilter === 'series'
        ? 'tv'
        : activeFilter === 'people'
          ? 'person'
          : 'multi';
  const { searchMovies, searchPeople, isLoading: searching } = useSearch(debouncedQuery, searchType);
  const hasSearch = debouncedQuery.length >= 2;

  const { movies: discoverMovies, isLoading: loadingDiscoverMovies } = useDiscoverMovies(
    activeFilter !== 'series' ? activeGenre : null,
    sortBy,
  );
  const { series: discoverTv, isLoading: loadingDiscoverTv } = useDiscoverTv(
    activeFilter === 'series' ? activeGenre : null,
    sortBy,
  );
  const discoverResults = activeFilter === 'series' ? discoverTv : discoverMovies;
  const loadingDiscover = activeFilter === 'series' ? loadingDiscoverTv : loadingDiscoverMovies;

  const handleMixedItemPress = useCallback((item: MovieProps) => {
    if (item.media_type === 'tv') {
      router.push({ pathname: '/(root)/series/[id]', params: { id: item.id } });
    } else {
      router.push({ pathname: '/(root)/movie/[id]', params: { id: item.id } });
    }
  }, []);

  const handleMoviePress = useCallback((item: MovieProps) => {
    router.push({ pathname: '/(root)/movie/[id]', params: { id: item.id } });
  }, []);

  const handleSeriesPress = useCallback((item: MovieProps) => {
    router.push({ pathname: '/(root)/series/[id]', params: { id: item.id } });
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchTrendingAll(),
      refetchTrendingMovies(),
      refetchTrendingTv(),
      refetchTrendingPeople(),
      refetchPopular(),
      refetchTopRated(),
      refetchPopularSeries(),
      refetchTopRatedSeries(),
    ]);
    setIsRefreshing(false);
  }, [
    refetchTrendingAll,
    refetchTrendingMovies,
    refetchTrendingTv,
    refetchTrendingPeople,
    refetchPopular,
    refetchTopRated,
    refetchPopularSeries,
    refetchTopRatedSeries,
  ]);

  const handleGenreChange = useCallback((genreId: number | null) => {
    setActiveGenre(genreId);
    if (genreId === null) setSortBy('popularity.desc');
  }, []);

  const handleFilterChange = useCallback((filter: ExploreFilter) => {
    setActiveFilter(filter);
    setActiveGenre(null);
    setSortBy('popularity.desc');
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  const renderBrowseContent = () => {
    switch (activeFilter) {
      case 'movies':
        return (
          <View className="gap-8">
            <TrendingStrip
              movies={trendingMovies}
              isLoading={loadingTrendingMovies}
              title="Trending Movies"
              icon="Film"
              iconColor="#3B82F6"
              onItemPress={handleMoviePress}
            />
            <DiscoverSection
              genres={movieGenres}
              activeGenre={activeGenre}
              sortBy={sortBy}
              onGenreChange={handleGenreChange}
              onSortChange={setSortBy}
              movies={discoverMovies}
              isLoading={loadingDiscoverMovies}
              mediaType="movie"
            />
            <HomeSection
              title="Popular Movies"
              icon="TrendingUp"
              iconColor="#F97316"
              movies={popularMovies}
              isLoading={loadingPopular}
              onItemPress={handleMoviePress}
            />
            <HomeSection
              title="Top Rated"
              icon="Star"
              iconColor="#EAB308"
              movies={topRatedMovies}
              isLoading={loadingTopRated}
              onItemPress={handleMoviePress}
            />
          </View>
        );

      case 'series':
        return (
          <View className="gap-8">
            <TrendingStrip
              movies={trendingTv}
              isLoading={loadingTrendingTv}
              title="Trending Series"
              icon="Tv"
              iconColor="#8B5CF6"
              onItemPress={handleSeriesPress}
            />
            <DiscoverSection
              genres={tvGenres}
              activeGenre={activeGenre}
              sortBy={sortBy}
              onGenreChange={handleGenreChange}
              onSortChange={setSortBy}
              movies={discoverTv}
              isLoading={loadingDiscoverTv}
              mediaType="tv"
            />
            <HomeSection
              title="Popular Series"
              icon="TrendingUp"
              iconColor="#F97316"
              movies={popularSeries}
              isLoading={loadingPopularSeries}
              onItemPress={handleSeriesPress}
            />
            <HomeSection
              title="Top Rated Series"
              icon="Star"
              iconColor="#EAB308"
              movies={topRatedSeries}
              isLoading={loadingTopRatedSeries}
              onItemPress={handleSeriesPress}
            />
          </View>
        );

      case 'people':
        return (
          <View className="gap-8">
            <TrendingPeopleStrip people={trendingPeople} isLoading={loadingTrendingPeople} />
          </View>
        );

      default:
        return (
          <View className="gap-8">
            <TrendingStrip
              movies={trendingAll}
              isLoading={loadingTrendingAll}
              title="Trending Today"
              icon="Flame"
              iconColor="#F97316"
              onItemPress={handleMixedItemPress}
            />
            <TrendingPeopleStrip people={trendingPeople} isLoading={loadingTrendingPeople} />
            <DiscoverSection
              genres={movieGenres}
              activeGenre={activeGenre}
              sortBy={sortBy}
              onGenreChange={handleGenreChange}
              onSortChange={setSortBy}
              movies={discoverResults}
              isLoading={loadingDiscover}
              mediaType="movie"
            />
            <HomeSection
              title="Popular Movies"
              icon="Film"
              iconColor="#3B82F6"
              movies={popularMovies}
              isLoading={loadingPopular}
              onItemPress={handleMoviePress}
            />
            <HomeSection
              title="Popular Series"
              icon="Tv"
              iconColor="#8B5CF6"
              movies={popularSeries}
              isLoading={loadingPopularSeries}
              onItemPress={handleSeriesPress}
            />
            <TrendingStrip
              movies={trendingMovies}
              isLoading={loadingTrendingMovies}
              title="Trending Movies"
              icon="Clapperboard"
              iconColor="#EC4899"
              onItemPress={handleMoviePress}
            />
            <HomeSection
              title="Top Rated Movies"
              icon="Star"
              iconColor="#EAB308"
              movies={topRatedMovies}
              isLoading={loadingTopRated}
              onItemPress={handleMoviePress}
            />
          </View>
        );
    }
  };

  return (
    <Screen>
      <View style={{ paddingTop: top + 10 }} className="gap-4 pb-4">
        <ExploreSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
        />
        <ExploreFilterTabs activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </View>

      {hasSearch ? (
        <SearchResultsGrid
          movies={searchMovies}
          people={searchPeople}
          isPeople={activeFilter === 'people'}
          isLoading={searching}
          query={debouncedQuery}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="rgba(255,255,255,0.6)"
            />
          }
          contentContainerStyle={{ paddingBottom: bottom + 80 }}>
          {renderBrowseContent()}
        </ScrollView>
      )}
    </Screen>
  );
};

export default ExploreScreen;
