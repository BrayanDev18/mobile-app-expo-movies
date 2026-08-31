import { usePullToRefresh } from '@/hooks';
import { HomeSection, MediaType, MovieProps } from '@/interfaces';
import { openDiscover } from '@/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CrossfadeBackdrop } from './CrossfadeBackdrop';
import { HomeSkeleton } from './HomeSkeleton';
import { MovieHorizontalList } from './MovieHorizontalList';
import { MoviesHeader } from './MoviesHeader';
import { RankedCarousel } from './RankedCarousel';

interface MediaHomeProps {
  mediaType: MediaType;
  header: ReactNode;
  hero: MovieProps[];
  sections: HomeSection[];
  isLoading: boolean;
  topRated: MovieProps[];
  extraSections?: ReactNode;
}

// The shared frame of the Movies and Series homes: crossfading hero backdrop,
// scope tabs, hero carousel, and the section rails.
export const MediaHome = (props: MediaHomeProps) => {
  const { mediaType, header, hero, sections, isLoading, topRated, extraSections } = props;

  const scrollX = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  const { refreshing, onRefresh } = usePullToRefresh();

  if (isLoading) return <HomeSkeleton header={header} />;

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="rgba(255,255,255,0.6)"
          />
        }>
        <MoviesHeader movies={hero} scrollX={scrollX} />

        <View style={{ paddingBottom: bottom + 80 }} className="gap-8 p-3">
          {sections.map((section) =>
            section.ranked ? (
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
            )
          )}

          {extraSections}

          <RankedCarousel title="All-Time Greats" movies={topRated.slice(0, 10)} />
        </View>
      </ScrollView>
    </>
  );
};
