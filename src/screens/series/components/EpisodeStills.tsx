import { FlashList, ImagePreviewModal, SectionTitle } from '@/components';
import { MovieImagesProps } from '@/interfaces';
import { IMAGE_PLACEHOLDER, tmdbResize } from '@/utils';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

export const EpisodeStills = ({ stills }: { stills: MovieImagesProps[] }) => {
  const [selected, setSelected] = useState<MovieImagesProps>();

  return (
    <>
      <View className="gap-3">
        <SectionTitle title="Stills" />

        <FlashList
          horizontal
          data={stills}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item, index }) => (
            <Pressable
              accessibilityRole="imagebutton"
              accessibilityLabel={`Open still ${index + 1} of ${stills.length}`}
              onPress={() => setSelected(item)}>
              <Image
                source={{ uri: tmdbResize(item.url, 'w780') ?? undefined }}
                style={{ width: 280, aspectRatio: 1.78, borderRadius: 12 }}
                cachePolicy="memory-disk"
                contentFit="cover"
                placeholder={IMAGE_PLACEHOLDER}
              />
            </Pressable>
          )}
        />
      </View>

      <ImagePreviewModal
        visible={!!selected}
        image={selected}
        onHide={() => setSelected(undefined)}
      />
    </>
  );
};
