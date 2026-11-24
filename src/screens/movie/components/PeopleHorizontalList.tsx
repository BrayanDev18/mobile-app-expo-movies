import { FlashList, SectionTitle, Text } from '@/components';
import { PersonProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openPersonDetails } from '@/utils';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslate } from '@/translate';

interface PeopleHorizontalListProps {
  title?: string;
  people: PersonProps[];
}

const AVATAR_SIZE = 110;

export const PeopleHorizontalList = ({ title, people }: PeopleHorizontalListProps) => {
  const { t } = useTranslate();

  const renderItem = useCallback(
    ({ item }: { item: PersonProps }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.viewDetails', { title: item.name })}
        style={{ width: AVATAR_SIZE }}
        className="items-center gap-2"
        onPress={() => openPersonDetails(item.id)}>
        <Image
          source={{ uri: item.avatar ?? undefined }}
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: 500 }}
          contentFit="cover"
          cachePolicy="memory-disk"
          placeholder={IMAGE_PLACEHOLDER}
          accessibilityLabel={t('common.portrait', { name: item.name })}
        />

        <View className="items-center">
          <Text numberOfLines={1} className="text-center !text-md font-semibold">
            {item.name}
          </Text>

          {item.knownFor && (
            <Text numberOfLines={1} className="text-center !text-[13px] !text-neutral-400">
              {item.knownFor}
            </Text>
          )}
        </View>
      </Pressable>
    ),
    [t]
  );

  return (
    <View className="gap-3">
      {title && <SectionTitle title={title} className="px-1" />}

      <FlashList
        horizontal
        data={people}
        keyExtractor={(item) => `${item.id}`}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={renderItem}
      />
    </View>
  );
};
