import { SectionTitle } from '@/components';
import { useStreamingProviders } from '@/hooks';
import { MediaType } from '@/interfaces';
import { IMAGE_PLACEHOLDER, openDiscover } from '@/utils';
import { Image } from 'expo-image';
import { Dimensions, Pressable, View } from 'react-native';

const { width } = Dimensions.get('window');

const COLUMNS = 4;
const GAP = 12;
const TILE_SIZE = (width - 40 - GAP * (COLUMNS - 1)) / COLUMNS;

interface ProviderGridProps {
  title?: string;
  mediaType?: MediaType;
}

export const ProviderGrid = ({ title, mediaType = 'movie' }: ProviderGridProps) => {
  const { providers } = useStreamingProviders(mediaType);

  if (!providers.length) return null;

  const mediaLabel = mediaType === 'tv' ? 'series' : 'movies';

  return (
    <View className="gap-3 px-4">
      {title && <SectionTitle title={title} className="px-1" />}

      <View className="flex-row flex-wrap" style={{ gap: GAP }}>
        {providers.map((provider) => (
          <Pressable
            key={provider.id}
            accessibilityRole="button"
            accessibilityLabel={`Browse ${mediaLabel} on ${provider.name}`}
            onPress={() => openDiscover(mediaType, { providerId: provider.id, title: provider.name })}>
            <Image
              source={{ uri: provider.logo ?? undefined }}
              style={{ width: TILE_SIZE, height: TILE_SIZE, borderRadius: 16 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              placeholder={IMAGE_PLACEHOLDER}
              accessibilityLabel={`${provider.name} logo`}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};
