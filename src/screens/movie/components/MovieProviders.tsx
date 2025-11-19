import { Text } from '@/components';
import { MovieProvidersProps } from '@/interfaces';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { View } from 'react-native';

export const MovieProviders = ({ movieProviders }: { movieProviders: MovieProvidersProps[] }) => {
  return (
    <View className="gap-3">
      <Text className="!text-[18px] font-semibold">Movie providers</Text>

      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={movieProviders}
        keyExtractor={(item, i) => `${item.provider_id}-${i}`}
        scrollEventThrottle={16}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item: provider }) => <ProviderItem provider={provider} />}
      />
    </View>
  );
};

const ProviderItem = ({ provider }: { provider: MovieProvidersProps }) => {
  return (
    <View className="w-[150px] overflow-hidden rounded-2xl border border-white/10">
      <BlurView intensity={50} tint="dark">
        <View className="flex-row items-center justify-between gap-3 p-2">
          <Text className="flex-1 pl-1.5 text-[14px] font-semibold" numberOfLines={2}>
            {provider.provider_name}
          </Text>

          <View className="rounded-xl bg-white/10 p-1.5">
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
              }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
              }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </View>
        </View>
      </BlurView>
    </View>
  );
};
