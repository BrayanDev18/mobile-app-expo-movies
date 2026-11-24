import { ErrorState, FlashList, SectionTitle } from '@/components';
import { usePullToRefresh } from '@/hooks';
import { HomeSection, MediaType, MovieProps } from '@/interfaces';
import { openDiscover } from '@/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { RefreshControl, StyleSheet, View, ViewToken } from 'react-native';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CrossfadeBackdrop } from './CrossfadeBackdrop';
import { HomeSkeleton } from './HomeSkeleton';
import { MovieHorizontalList } from './MovieHorizontalList';
import { HERO_ITEM_SIZE, MoviesHeader } from './MoviesHeader';
import { RankedCarousel } from './RankedCarousel';

// Rails past the last visible one that are activated (fetched) ahead of the
// scroll, so a rail's data is usually in before it scrolls into view.
const LOOKAHEAD_RAILS = 2;

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 1, minimumViewTime: 0 };

const SECTION_GAP = 32;

interface MediaHomeProps {
  mediaType: MediaType;
  header: ReactNode;
  hero: MovieProps[];
  sections: HomeSection[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onRailVisible?: (key: string) => void;
  topRated: MovieProps[];
  extraSections?: ReactNode;
}

const RAIL_CARD = {
  poster: { width: 150, height: 230, borderRadius: 12 },
  backdrop: { width: 310, aspectRatio: 1.78, borderRadius: 12 },
} as const;

// Static on purpose — looping pulses run per-frame and overheat devices.
const PendingRail = ({ section }: { section: HomeSection }) => (
  <View className="gap-3" accessibilityLabel={`Loading ${section.title}`}>
    <SectionTitle title={section.title} className="px-1" />

    <View className="flex-row gap-3.5 overflow-hidden">
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          className="bg-white/10"
          style={RAIL_CARD[section.variant ?? 'poster']}
        />
      ))}
    </View>
  </View>
);

// The shared frame of the Movies and Series homes: crossfading hero backdrop,
// scope tabs, hero carousel, and the section rails. Rails live in a vertical
// FlashList so off-screen ones aren't mounted, and lazy ones are only fetched
// once they are viewable (or within LOOKAHEAD_RAILS of the last viewable one).
export const MediaHome = (props: MediaHomeProps) => {
  const {
    mediaType,
    header,
    hero,
    sections,
    isLoading,
    isError,
    onRetry,
    onRailVisible,
    topRated,
    extraSections,
  } = props;

  const scrollX = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  const { refreshing, onRefresh } = usePullToRefresh();

  const onHeroScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x / HERO_ITEM_SIZE;
  });

  // Viewability uses measured layout. Mounting doesn't work as the signal: the
  // list's first, unmeasured pass renders every cell.
  const sectionsRef = useRef(sections);

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<HomeSection>[] }) => {
      if (!onRailVisible || !viewableItems.length) return;

      const lastVisible = Math.max(...viewableItems.map((token) => token.index ?? 0));

      sectionsRef.current
        .slice(0, lastVisible + 1 + LOOKAHEAD_RAILS)
        .forEach((section) => section.isPending && onRailVisible(section.key));
    },
    [onRailVisible]
  );

  if (isLoading) return <HomeSkeleton header={header} />;

  if (isError && hero.length === 0 && onRetry) {
    return (
      <View className="flex-1 bg-neutral-900">
        {header}

        <ErrorState fullScreen={false} onRetry={onRetry} />
      </View>
    );
  }

  // The inner `key` remounts a recycled cell's rail, so a horizontal list never
  // inherits the scroll offset of the rail that used the cell before it.
  const renderSection = ({ item: section }: { item: HomeSection }) => (
    <View className="px-3">
      {section.isPending ? (
        <PendingRail key={section.key} section={section} />
      ) : section.ranked ? (
        <RankedCarousel
          key={section.key}
          title={section.title}
          movies={section.movies.slice(0, 10)}
        />
      ) : (
        <MovieHorizontalList
          key={section.key}
          title={section.title}
          movies={section.movies}
          variant={section.variant}
          cardWidth={section.cardWidth}
          onSeeAll={
            section.seeAll
              ? () => openDiscover(mediaType, { ...section.seeAll, title: section.title })
              : undefined
          }
        />
      )}
    </View>
  );

  return (
    <>
      <CrossfadeBackdrop media={hero} scrollX={scrollX} />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: '100%' }]}
      />

      {header}

      <FlashList
        data={sections}
        keyExtractor={(section) => section.key}
        getItemType={(section) =>
          section.isPending ? 'pending' : section.ranked ? 'ranked' : (section.variant ?? 'poster')
        }
        renderItem={renderSection}
        // On by default in FlashList v2: it anchors the first rail while the hero
        // header above it is measured, so the home opened part-way down.
        maintainVisibleContentPosition={{ disabled: true }}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: SECTION_GAP }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="rgba(255,255,255,0.6)"
          />
        }
        ListHeaderComponent={
          <View style={{ paddingBottom: SECTION_GAP + 12 }}>
            <MoviesHeader movies={hero} scrollX={scrollX} onScroll={onHeroScroll} />
          </View>
        }
        ListFooterComponent={
          <View
            style={{ paddingTop: SECTION_GAP, paddingBottom: bottom + 92 }}
            className="gap-8 px-3">
            {extraSections}

            <RankedCarousel title="All-Time Greats" movies={topRated.slice(0, 10)} />
          </View>
        }
      />
    </>
  );
};
