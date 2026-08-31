import { FlashList, Tab } from '@/components';
import { DecadeProps, EXPLORE_DECADES } from '@/constants';
import { MediaType } from '@/interfaces';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

export const DecadeChips = ({ mediaType = 'movie' }: { mediaType?: MediaType }) => {
  const renderItem = useCallback(
    ({ item }: { item: DecadeProps }) => (
      <Tab
        title={item.label}
        isActive={false}
        adaptableWidth
        className="rounded-full border border-white/15"
        onPress={() =>
          router.push({
            pathname: mediaType === 'tv' ? '/(root)/tv/discover' : '/(root)/movie/discover',
            params: { yearFrom: item.from, yearTo: item.to, title: item.label },
          })
        }
      />
    ),
    [mediaType]
  );

  return (
    <FlashList
      horizontal
      data={EXPLORE_DECADES}
      keyExtractor={(item) => item.label}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4"
      ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      renderItem={renderItem}
    />
  );
};
