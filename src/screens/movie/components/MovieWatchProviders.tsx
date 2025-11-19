import { Text } from '@/components';
import { MovieProvidersProps } from '@/interfaces';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Linking, Pressable, View } from 'react-native';

export const MovieWatchProviders = ({ providers }: { providers: any }) => {
  if (!providers) return null;

  const { flatrate, rent, buy, link } = providers;

  const groups = [
    { title: 'Streaming', data: flatrate },
    { title: 'Alquiler', data: rent },
    { title: 'Compra', data: buy },
  ];

  return (
    <View className="gap-4">
      <Text className="!text-lg font-bold">Watch providers: </Text>

      <View className="w-full gap-4">
        {groups.map((group, index) => {
          if (!group.data) return null;

          return (
            <View key={index} className="gap-2">
              <Text className="text-sm font-medium !text-neutral-400">{group.title}</Text>

              <View className="flex-row flex-wrap gap-3 px-2">
                {group.data.map((provider: MovieProvidersProps, index: number) => (
                  <ProviderItem key={index} provider={provider} />
                ))}
              </View>
            </View>
          );
        })}

        {link && (
          <Pressable onPress={() => Linking.openURL(link)}>
            <Text className="mt-2 text-sm text-blue-400 underline">Ver más detalles</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const ProviderItem = ({ provider }: { provider: MovieProvidersProps }) => {
  return (
    <View className="w-[160px] overflow-hidden rounded-2xl border border-white/10">
      <BlurView intensity={50} tint="dark">
        <View className="flex-row items-center justify-between gap-3 p-2">
          <View className="rounded-xl bg-white/10 p-1.5">
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
              }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 6,
              }}
              contentFit="fill"
              cachePolicy="memory-disk"
            />
          </View>

          <Text className="flex-1 pl-1.5 text-[14px] font-semibold" numberOfLines={2}>
            {provider.provider_name}
          </Text>
        </View>
      </BlurView>
    </View>
  );
};
