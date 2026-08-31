import { ChipRow, EmptyState, Loader, Screen, Text } from '@/components';
import { useMovieCast } from '@/hooks';
import { MovieCastProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openPersonDetails } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type CastTab = 'actors' | 'producers' | 'directors' | 'writers';

const TABS: { key: CastTab; label: string }[] = [
  { key: 'actors', label: 'Actors' },
  { key: 'directors', label: 'Directors' },
  { key: 'producers', label: 'Producers' },
  { key: 'writers', label: 'Writers' },
];

const WRITER_JOBS = ['Writer', 'Screenplay', 'Story', 'Novel', 'Author', 'Characters'];

const uniqueById = <T extends { id: number }>(members: T[]): T[] => {
  const seen = new Set<number>();

  return members.filter((member) => {
    if (seen.has(member.id)) return false;

    seen.add(member.id);
    return true;
  });
};

const CastList = () => {
  const { id, type } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<CastTab>('actors');

  const { movieCast, movieCrew, isMovieCastLoading } = useMovieCast(
    +id,
    type === 'tv' ? 'tv' : 'movie'
  );

  const members = useMemo(() => {
    if (activeTab === 'actors') return movieCast;

    if (activeTab === 'directors') {
      return uniqueById(movieCrew.filter((member) => member.job === 'Director'));
    }

    if (activeTab === 'writers') {
      return uniqueById(movieCrew.filter((member) => WRITER_JOBS.includes(member.job)));
    }

    return uniqueById(movieCrew.filter((member) => member.job.includes('Producer')));
  }, [activeTab, movieCast, movieCrew]);

  const renderItem = useCallback(
    ({ item }: { item: MovieCastProps }) => <CastItem cast={item} />,
    []
  );

  if (isMovieCastLoading) return <Loader />;

  return (
    <Screen safeAreaEdges={['top', 'bottom']} canGoBack preset="fixed" className="gap-4 px-4">
      <View className="h-full gap-4 pt-14">
        <Text accessibilityRole="header" className="!text-2xl font-bold">
          Cast & Crew
        </Text>

        <ChipRow items={TABS} active={activeTab} onSelect={setActiveTab} scrollable className="" />

        <Animated.View key={activeTab} entering={FadeIn.duration(250)} className="flex-1">
          <FlashList
            data={members}
            scrollEventThrottle={16}
            removeClippedSubviews
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={<EmptyState icon="Users" message="Nothing listed here" />}
          />
        </Animated.View>
      </View>
    </Screen>
  );
};

export default CastList;

const CastItem = ({ cast }: { cast: MovieCastProps }) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${cast.name}`}
      onPress={() => openPersonDetails(cast.id)}
      className="flex-row items-center justify-between rounded-2xl bg-neutral-800 p-2.5">
      <View className="flex-1 flex-row items-center gap-x-3 pr-2">
        <Image
          source={{ uri: cast.avatar || undefined }}
          style={{ width: 62, height: 62, borderRadius: 8 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={IMAGE_PLACEHOLDER}
          accessibilityLabel={`${cast.name} portrait`}
        />

        <View className="flex-1 gap-1.5">
          <Text numberOfLines={1} className="!text-lg font-medium">
            {cast.name}
          </Text>

          {cast.character ? (
            <Text numberOfLines={1} className="!text-[14.5px] font-normal !text-neutral-400">
              {cast.character}
            </Text>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward-outline" color="#757575" size={22} />
    </Pressable>
  );
};
