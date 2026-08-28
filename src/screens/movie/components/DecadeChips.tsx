import { FlashList, Tab } from '@/components';
import { DecadeProps, EXPLORE_DECADES } from '@/constants';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

export const DecadeChips = () => {
  const renderItem = useCallback(
    ({ item }: { item: DecadeProps }) => (
      <Tab
        title={item.label}
        isActive={false}
        adaptableWidth
        className="rounded-full border border-white/15"
        onPress={() =>
          router.push({
            pathname: '/(root)/movie/discover',
            params: { yearFrom: item.from, yearTo: item.to, title: item.label },
          })
        }
      />
    ),
    []
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
