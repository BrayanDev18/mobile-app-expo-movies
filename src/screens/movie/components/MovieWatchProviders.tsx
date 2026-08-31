import { SectionTitle, Text } from '@/components';
import { MovieProvidersProps, RegionWatchProvidersProps } from '@/interfaces';
import { tmdbImage } from '@/utils';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Linking, Pressable, View } from 'react-native';

export const MovieWatchProviders = ({
  providers,
}: {
  providers: RegionWatchProvidersProps | null;
}) => {
  if (!providers) return null;

  const { flatrate, rent, buy, link } = providers;

  const groups = [
    { title: 'Streaming', data: flatrate },
    { title: 'Rent', data: rent },
    { title: 'Buy', data: buy },
  ];

  if (groups.every((group) => !group.data?.length)) return null;

  return (
    <View className="gap-3">
      <SectionTitle title="Where to watch" />

      <View className="w-full gap-4">
        {groups.map((group, index) => {
          if (!group.data?.length) return null;

          return (
            <View key={index} className="gap-3">
              <Text className="text-sm font-medium !text-neutral-400">{group.title}</Text>

              <View className="flex-row flex-wrap gap-2 px-2">
                {group.data.slice(0, 3).map((provider: MovieProvidersProps, index: number) => (
                  <View
                    key={index}
                    className="w-[32%] overflow-hidden rounded-2xl border border-white/10">
                    <BlurView intensity={50} tint="dark">
                      <View className="flex-row items-center justify-between gap-2 p-1.5">
                        <View className="rounded-xl bg-white/10 p-1">
                          <Image
                            source={{
                              uri: tmdbImage(provider.logo_path, 'w92') ?? undefined,
                            }}
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 6,
                            }}
                            contentFit="fill"
                            cachePolicy="memory-disk"
                            accessibilityLabel={`${provider.provider_name} logo`}
                          />
                        </View>

                        <Text className="flex-1 text-[12px] font-medium" numberOfLines={2}>
                          {provider.provider_name}
                        </Text>
                      </View>
                    </BlurView>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {link ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all watch options on TMDB"
            onPress={() => Linking.openURL(link)}
            className="self-start">
            <Text className="text-sm !text-blue-400 underline">See all options</Text>
          </Pressable>
        ) : null}

        <Text className="!text-[11px] !text-neutral-400">Streaming availability by JustWatch</Text>
      </View>
    </View>
  );
};
