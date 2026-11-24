import { openDiscover } from '@/utils';
import { FlashList, Tab } from '@/components';
import { DecadeProps, EXPLORE_DECADES } from '@/constants';
import { MediaType } from '@/interfaces';
import { useCallback } from 'react';
import { View } from 'react-native';
import { useTranslate } from '@/translate';

export const DecadeChips = ({ mediaType = 'movie' }: { mediaType?: MediaType }) => {
  const { t } = useTranslate();

  const renderItem = useCallback(
    ({ item }: { item: DecadeProps }) => (
      <Tab
        title={t(item.labelKey)}
        isActive={false}
        adaptableWidth
        className="rounded-full border border-white/15"
        onPress={() =>
          openDiscover(mediaType, { yearFrom: item.from, yearTo: item.to, title: t(item.labelKey) })
        }
      />
    ),
    [mediaType, t]
  );

  return (
    <FlashList
      horizontal
      data={EXPLORE_DECADES}
      keyExtractor={(item) => item.labelKey}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4"
      ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      renderItem={renderItem}
    />
  );
};
