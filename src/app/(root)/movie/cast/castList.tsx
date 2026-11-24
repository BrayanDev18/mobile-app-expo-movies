import { ChipRow, EmptyState, FlashList, Loader, Screen, Text } from '@/components';
import { useMovieCast } from '@/hooks';
import { MovieCastProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openPersonDetails } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { TxKeyPath, useTranslate } from '@/translate';

type CastTab = 'actors' | 'producers' | 'directors' | 'writers';

const TABS: { key: CastTab; labelKey: TxKeyPath }[] = [
  { key: 'actors', labelKey: 'castList.actors' },
  { key: 'directors', labelKey: 'castList.directors' },
  { key: 'producers', labelKey: 'castList.producers' },
  { key: 'writers', labelKey: 'castList.writers' },
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
  const { t } = useTranslate();

  const { movieCast, movieCrew, isLoading } = useMovieCast(+id, type === 'tv' ? 'tv' : 'movie');

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

  if (isLoading) return <Loader />;

  return (
    <Screen safeAreaEdges={['top', 'bottom']} canGoBack preset="fixed" className="gap-4 px-4">
      <View className="h-full gap-4 pt-14">
        <Text accessibilityRole="header" className="!text-2xl font-bold">
          {t('castList.title')}
        </Text>

        <ChipRow
          items={TABS.map((tab) => ({ key: tab.key, label: t(tab.labelKey) }))}
          active={activeTab}
          onSelect={setActiveTab}
          scrollable
          className=""
        />

        {/* Keyed so each role tab starts scrolled to the top; no fade on a frequent toggle. */}
        <View key={activeTab} className="flex-1">
          <FlashList
            data={members}
            scrollEventThrottle={16}
            removeClippedSubviews
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={<EmptyState icon="Users" message={t('castList.nothingListed')} />}
          />
        </View>
      </View>
    </Screen>
  );
};

export default CastList;

const CastItem = ({ cast }: { cast: MovieCastProps }) => {
  const { t } = useTranslate();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('common.viewDetails', { title: cast.name })}
      onPress={() => openPersonDetails(cast.id)}
      className="flex-row items-center justify-between rounded-2xl bg-neutral-800 p-2.5">
      <View className="flex-1 flex-row items-center gap-x-3 pr-2">
        <Image
          source={{ uri: cast.avatar || undefined }}
          style={{ width: 62, height: 62, borderRadius: 8 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={IMAGE_PLACEHOLDER}
          accessibilityLabel={t('common.portrait', { name: cast.name })}
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
