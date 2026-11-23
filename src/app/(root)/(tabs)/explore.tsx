import { BlurredBackdrop, ChipRow, EmptyState, Input, SectionTitle, Tab, Text } from '@/components';
import { useDebouncedValue, usePullToRefresh, useSearchMulti, useTrending } from '@/hooks';
import { MEDIA_SCOPES } from '@/constants';
import { MediaType } from '@/interfaces';
import {
  CollectionsRow,
  DecadeChips,
  GenreChips,
  MediaListRow,
  PeopleHorizontalList,
  ProviderGrid,
  RankedCarousel,
} from '@/screens/movie/components';
import { useRecentSearchesStore } from '@/stores';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@/translate';

const ExploreScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslate();

  const [scope, setScope] = useState<MediaType>('movie');
  const { control, setValue } = useForm({ defaultValues: { search: '' } });
  const search = useWatch({ control, name: 'search' });
  const query = useDebouncedValue(search);

  const { media, people, isSearching, hasQuery } = useSearchMulti(query);
  const { trending: topPicks } = useTrending(scope, 'day');
  const { trending: trendingAll } = useTrending('all', 'week');
  const searches = useRecentSearchesStore((state) => state.searches);
  const addSearch = useRecentSearchesStore((state) => state.addSearch);
  const clearSearches = useRecentSearchesStore((state) => state.clearSearches);
  const { refreshing, onRefresh } = usePullToRefresh();

  const rankedTrending = trendingAll.slice(0, 5);
  const showEmptyState = hasQuery && !isSearching && !media.length && !people.length;
  const backdrop = (rankedTrending[0] ?? topPicks[0])?.poster;

  return (
    <View className="flex-1 bg-neutral-900">
      <BlurredBackdrop path={backdrop} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: top + 15, paddingBottom: bottom + 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="rgba(255,255,255,0.6)"
          />
        }>
        <View className="px-4 pb-5">
          <Text className="!text-5xl font-black" style={{ lineHeight: 42, letterSpacing: -1 }}>
            {t('explore.title')}
          </Text>
        </View>

        <View className="mb-8 gap-3">
          <View className="px-4">
            <Input
              iconName="Search"
              name="search"
              control={control}
              placeholder={t('explore.searchPlaceholder')}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => addSearch(search)}
            />
          </View>

          {!hasQuery && searches.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row items-center gap-2 px-4">
                {searches.map((term) => (
                  <Tab
                    key={term}
                    title={term}
                    isActive={false}
                    adaptableWidth
                    className="rounded-full border border-white/15"
                    onPress={() => setValue('search', term)}
                  />
                ))}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('explore.clearRecentSearches')}
                  className="h-11 items-center justify-center px-3"
                  onPress={clearSearches}>
                  <Text className="!text-[13px] !text-neutral-400">{t('common.clear')}</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>

        {hasQuery ? (
          <View className="gap-8 px-4">
            {isSearching && <ActivityIndicator className="py-12" color="rgba(255,255,255,0.6)" />}

            {showEmptyState && (
              <EmptyState icon="Search" message={t('explore.noResults', { query: query.trim() })} />
            )}

            {people.length > 0 && (
              <PeopleHorizontalList title={t('explore.people')} people={people} />
            )}

            {media.length > 0 && (
              <View>
                <SectionTitle title={t('explore.moviesAndSeries')} className="px-1" />

                <View className="mt-2">
                  {media.map((item) => (
                    <View key={`${item.mediaType}-${item.id}`} className="border-b border-white/10">
                      <MediaListRow movie={item} />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={{ gap: 32 }}>
            <ChipRow
              items={MEDIA_SCOPES.map((item) => ({ key: item.key, label: t(item.labelKey) }))}
              active={scope}
              onSelect={setScope}
            />

            <Animated.View key={scope} entering={FadeIn.duration(250)} style={{ gap: 32 }}>
              <View className="gap-3">
                <GenreChips mediaType={scope} />

                <DecadeChips mediaType={scope} />
              </View>

              {topPicks.length > 0 && (
                <View className="px-4">
                  <RankedCarousel
                    title={t('explore.trendingToday')}
                    movies={topPicks.slice(0, 10)}
                  />
                </View>
              )}

              <ProviderGrid title={t('explore.browseByService')} mediaType={scope} />

              {rankedTrending.length > 0 && (
                <View className="px-4">
                  <RankedCarousel title={t('explore.topFiveThisWeek')} movies={rankedTrending} />
                </View>
              )}

              {scope === 'movie' && <CollectionsRow title={t('explore.sagas')} />}
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default ExploreScreen;
