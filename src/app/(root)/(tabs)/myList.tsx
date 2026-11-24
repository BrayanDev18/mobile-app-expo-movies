import {
  BlurredBackdrop,
  ChipRow,
  EmptyState,
  Icon,
  IconName,
  RatingBadge,
  Text,
} from '@/components';
import { MediaType, MyListFlag, SavedMediaProps } from '@/interfaces';
import { EASE_IN_OUT, EASE_OUT, MEDIA_SCOPES } from '@/constants';
import { useMyListStore } from '@/stores';
import { MediaListRow } from '@/screens/movie/components';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TxKeyPath, useTranslate } from '@/translate';

type ListFilter = 'all' | MediaType;

const FILTERS: { key: ListFilter; labelKey: TxKeyPath }[] = [
  { key: 'all', labelKey: 'common.all' },
  ...MEDIA_SCOPES,
];

const LISTS: {
  key: MyListFlag;
  labelKey: TxKeyPath;
  removeIcon: IconName;
  emptyKey: TxKeyPath;
}[] = [
  {
    key: 'watchlist',
    labelKey: 'myList.lists.watchlist',
    removeIcon: 'BookmarkMinus',
    emptyKey: 'myList.empty.watchlist',
  },
  {
    key: 'watched',
    labelKey: 'myList.lists.watched',
    removeIcon: 'EyeOff',
    emptyKey: 'myList.empty.watched',
  },
  {
    key: 'favorite',
    labelKey: 'myList.lists.favorites',
    removeIcon: 'HeartOff',
    emptyKey: 'myList.empty.favorites',
  },
];

const MyListScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslate();

  const items = useMyListStore((state) => state.items);
  const toggleFlag = useMyListStore((state) => state.toggleFlag);
  const [activeList, setActiveList] = useState<MyListFlag>('watchlist');
  const [filter, setFilter] = useState<ListFilter>('all');

  const list = LISTS.find((item) => item.key === activeList) ?? LISTS[0];
  const listItems = items.filter((item) => item[activeList]);

  const hasMovies = listItems.some((item) => (item.mediaType ?? 'movie') === 'movie');
  const hasSeries = listItems.some((item) => item.mediaType === 'tv');
  const showFilters = hasMovies && hasSeries;

  const filtered =
    filter === 'all' || !showFilters
      ? listItems
      : listItems.filter((item) => (item.mediaType ?? 'movie') === filter);

  const backdrop = (listItems[0] ?? items[0])?.poster;

  const onRemove = (movie: SavedMediaProps) => {
    Haptics.selectionAsync();
    toggleFlag(movie, activeList);
  };

  return (
    <View className="flex-1 bg-neutral-900">
      <BlurredBackdrop path={backdrop} />

      {items.length === 0 ? (
        <View style={{ paddingTop: top }} className="flex-1 justify-center">
          <EmptyState
            icon="Bookmark"
            title={t('myList.nothingSaved')}
            message={t('myList.nothingSavedMessage')}
            action={{
              title: t('myList.exploreTitles'),
              onPress: () => router.navigate('/(root)/(tabs)/explore'),
            }}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: top + 15, paddingBottom: bottom + 80 }}>
          <Animated.View entering={FadeIn.duration(300).easing(EASE_OUT)}>
            <View className="gap-1 px-4 pb-5">
              <Text className="!text-5xl font-black" style={{ lineHeight: 42, letterSpacing: -1 }}>
                {t('myList.title')}
              </Text>

              <Text className="!text-[13px] !text-neutral-400">
                {t('myList.titlesSaved', { count: items.length })}
              </Text>
            </View>

            <View className="mb-4">
              <ChipRow
                items={LISTS.map((item) => {
                  const count = items.filter((saved) => saved[item.key]).length;
                  const label = t(item.labelKey);

                  return {
                    key: item.key,
                    label: count ? t('myList.listWithCount', { label, count }) : label,
                  };
                })}
                active={activeList}
                onSelect={(key) => {
                  setActiveList(key);
                  setFilter('all');
                }}
              />
            </View>

            {showFilters && (
              <View className="mb-6">
                <ChipRow
                  items={FILTERS.map((item) => ({ key: item.key, label: t(item.labelKey) }))}
                  active={filter}
                  onSelect={setFilter}
                />
              </View>
            )}

            {listItems.length === 0 ? (
              <View className="py-8">
                <EmptyState icon="ListX" message={t(list.emptyKey)} />
              </View>
            ) : (
              <View className="px-4">
                {filtered.map((movie, index) => (
                  <Animated.View
                    key={`${movie.mediaType ?? 'movie'}-${movie.id}`}
                    exiting={FadeOut.duration(200).easing(EASE_OUT)}
                    layout={LinearTransition.duration(250).easing(EASE_IN_OUT)}
                    className={index < filtered.length - 1 ? 'border-b border-white/10' : ''}>
                    <MediaListRow
                      movie={movie}
                      subtitle={
                        movie.userRating ? (
                          <View className="mt-1 self-start">
                            <RatingBadge
                              value={movie.userRating}
                              size="xs"
                              suffix="/10"
                              precise={false}
                            />
                          </View>
                        ) : undefined
                      }
                      trailing={
                        <Icon
                          name={list.removeIcon}
                          size={20}
                          color="rgba(255,255,255,0.55)"
                          className="h-11 w-11 items-center justify-center"
                          accessibilityLabel={t('myList.removeFromList', { title: movie.title })}
                          onPress={() => onRemove(movie)}
                        />
                      }
                    />
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyListScreen;
