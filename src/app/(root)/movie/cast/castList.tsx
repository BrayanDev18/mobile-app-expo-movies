import { Icon, Loader, Screen, Tab, Text } from '@/components';
import { useMovieCast, useSeriesCast } from '@/hooks';
import { MovieCastProps, MovieCrewProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabKey = 'cast' | 'directors' | 'writers' | 'producers';

const CastList = () => {
  const { id, type } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('cast');
  const mediaType = type === 'series' ? 'series' : 'movie';

  const movieResult = useMovieCast(mediaType === 'movie' ? +id : 0);
  const seriesResult = useSeriesCast(mediaType === 'series' ? +id : 0);

  const movieCast = mediaType === 'movie' ? movieResult.movieCast : seriesResult.seriesCast;
  const movieCrew = mediaType === 'movie' ? movieResult.movieCrew : seriesResult.seriesCrew;
  const isMovieCastLoading =
    mediaType === 'movie' ? movieResult.isMovieCastLoading : seriesResult.isSeriesCastLoading;

  const directors = useMemo(() => movieCrew.filter((c) => c.job === 'Director'), [movieCrew]);

  const writers = useMemo(() => movieCrew.filter((c) => c.department === 'Writing'), [movieCrew]);

  const producers = useMemo(
    () => movieCrew.filter((c) => c.department === 'Production'),
    [movieCrew]
  );

  const renderCastItem = useCallback(
    ({ item, index }: { item: MovieCastProps; index: number }) => (
      <PersonItem
        id={item.id}
        name={item.name}
        subtitle={item.character}
        avatar={item.avatar}
        index={index}
      />
    ),
    []
  );

  const renderCrewItem = useCallback(
    ({ item, index }: { item: MovieCrewProps; index: number }) => (
      <PersonItem
        id={item.id}
        name={item.name}
        subtitle={item.job}
        avatar={item.avatar}
        index={index}
      />
    ),
    []
  );

  if (isMovieCastLoading) return <Loader />;

  return (
    <Screen safeAreaEdges={['top', 'bottom']} canGoBack preset="fixed" className="px-4">
      <View className="h-full gap-6 pt-14">
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}>
            <Tab
              title="Cast"
              isActive={activeTab === 'cast'}
              onPress={() => setActiveTab('cast')}
              adaptableWidth
            />
            <Tab
              title="Directors"
              isActive={activeTab === 'directors'}
              onPress={() => setActiveTab('directors')}
              adaptableWidth
            />
            <Tab
              title="Writers"
              isActive={activeTab === 'writers'}
              onPress={() => setActiveTab('writers')}
              adaptableWidth
            />
            <Tab
              title="Producers"
              isActive={activeTab === 'producers'}
              onPress={() => setActiveTab('producers')}
              adaptableWidth
            />
          </ScrollView>
        </View>

        <View className="flex-1">
          {activeTab === 'cast' && (
            <CastTabContent
              data={movieCast}
              renderItem={renderCastItem}
              emptyLabel="cast members"
            />
          )}
          {activeTab === 'directors' && (
            <CrewTabContent data={directors} renderItem={renderCrewItem} emptyLabel="directors" />
          )}
          {activeTab === 'writers' && (
            <CrewTabContent data={writers} renderItem={renderCrewItem} emptyLabel="writers" />
          )}
          {activeTab === 'producers' && (
            <CrewTabContent data={producers} renderItem={renderCrewItem} emptyLabel="producers" />
          )}
        </View>
      </View>
    </Screen>
  );
};

export default CastList;

// --- Tab content wrappers ---

const CastTabContent = ({
  data,
  renderItem,
  emptyLabel,
}: {
  data: MovieCastProps[];
  renderItem: ({ item, index }: { item: MovieCastProps; index: number }) => React.JSX.Element;
  emptyLabel: string;
}) => {
  if (!data?.length) return <EmptyState label={emptyLabel} />;

  return (
    <FlashList
      data={data}
      scrollEventThrottle={16}
      removeClippedSubviews
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
};

const CrewTabContent = ({
  data,
  renderItem,
  emptyLabel,
}: {
  data: MovieCrewProps[];
  renderItem: ({ item, index }: { item: MovieCrewProps; index: number }) => React.JSX.Element;
  emptyLabel: string;
}) => {
  if (!data?.length) return <EmptyState label={emptyLabel} />;

  return (
    <FlashList
      data={data}
      scrollEventThrottle={16}
      removeClippedSubviews
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => `${item.id}-${item.job}-${index}`}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
};

const EmptyState = ({ label }: { label: string }) => (
  <View className="flex-1 items-center justify-center gap-3">
    <Icon name="Users" size={48} color="rgba(255,255,255,0.2)" />
    <Text className="!text-neutral-400">No {label} found</Text>
  </View>
);

interface PersonItemProps {
  id: number;
  name: string;
  subtitle: string;
  avatar: string | null;
  index: number;
}

const PersonItem = ({ id, name, subtitle, avatar, index }: PersonItemProps) => (
  <AnimatedPressable
    entering={FadeInDown.delay(Math.min(50 * index, 500)).springify()}
    onPress={() => router.push({ pathname: '/(root)/movie/cast/[id]', params: { id } })}
    accessibilityRole="button"
    accessibilityLabel={`${name}, ${subtitle}`}
    className="flex-row items-center justify-between rounded-xl bg-neutral-800 p-2.5">
    <View className="flex-1 flex-row items-center gap-x-3">
      {avatar ? (
        <Image
          source={{ uri: avatar }}
          style={{ width: 62, height: 62, borderRadius: 8 }}
          cachePolicy="memory-disk"
          contentFit="cover"
        />
      ) : (
        <View
          className="items-center justify-center bg-neutral-700"
          style={{ width: 62, height: 62, borderRadius: 8 }}>
          <Icon name="User" size={24} color="rgba(255,255,255,0.3)" />
        </View>
      )}

      <View className="flex-1 gap-1.5">
        <Text className="!text-lg font-medium" numberOfLines={1}>
          {name}
        </Text>
        <Text className="!text-[14.5px] font-normal !text-neutral-400" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </View>

    <Icon name="ChevronRight" size={20} color="#757575" />
  </AnimatedPressable>
);
