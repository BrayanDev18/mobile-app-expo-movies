import { Text } from '@/components';
import { useStreamingProviders } from '@/hooks';
import { IMAGE_PLACEHOLDER } from '@/utils';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Dimensions, Pressable, View } from 'react-native';

const { width } = Dimensions.get('window');

const COLUMNS = 4;
const GAP = 12;
const TILE_SIZE = (width - 40 - GAP * (COLUMNS - 1)) / COLUMNS;

interface ProviderGridProps {
  title?: string;
}

export const ProviderGrid = ({ title }: ProviderGridProps) => {
  const { providers } = useStreamingProviders();

  if (!providers.length) return null;

  return (
    <View className="gap-3 px-4">
      {title && <Text className="px-1 !text-[18px] font-semibold">{title}</Text>}

      <View className="flex-row flex-wrap" style={{ gap: GAP }}>
        {providers.map((provider) => (
          <Pressable
            key={provider.id}
            accessibilityRole="button"
            accessibilityLabel={`Browse movies on ${provider.name}`}
            onPress={() =>
              router.push({
                pathname: '/(root)/movie/discover',
                params: { providerId: provider.id, title: provider.name },
              })
            }>
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
